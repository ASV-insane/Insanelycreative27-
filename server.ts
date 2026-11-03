import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.disable('x-powered-by');

// Production Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://generativelanguage.googleapis.com; media-src 'self' blob: data:;"
  );
  next();
});

app.use(express.json({ limit: '2mb' }));

// Safe in-memory Rate Limiting
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const rateLimit = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'ip';
  const now = Date.now();
  const entry = requestCounts.get(ip) || { count: 0, resetAt: now + 60000 };
  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + 60000;
  } else {
    entry.count += 1;
  }
  requestCounts.set(ip, entry);
  if (entry.count > 40) {
    return res.status(429).json({ error: 'Rate limit exceeded. Please wait a minute.' });
  }
  next();
};

// Initialize GoogleGenAI client on server
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Endpoint: Extract campaign parameters from freeform natural language
app.post('/api/campaign/extract', rateLimit, async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  if (prompt.length > 5000) {
    return res.status(400).json({ error: 'Prompt is too long (max 5000 characters)' });
  }

  // Fallback intelligent extraction
  const fallbackExtract = () => {
    const lower = prompt.toLowerCase();
    let brandName = 'New Venture';
    const calledMatch = prompt.match(/(?:called|named|brand is|venture is|centre called)\s+([A-Za-z0-9\s&'-]+?)(?:\.|\,|$|\sfor|\swith|\sbefore)/i);
    if (calledMatch && calledMatch[1]) {
      brandName = calledMatch[1].trim();
    } else {
      const words = prompt.split(' ');
      if (words.length > 2) brandName = words.slice(0, 3).join(' ');
    }

    let targetAudience = 'Target customers and local community';
    if (lower.includes('student') || lower.includes('college') || lower.includes('class 10')) {
      targetAudience = 'High school & college students, parents, and academic aspirants';
    } else if (lower.includes('developer') || lower.includes('engineer') || lower.includes('b2b')) {
      targetAudience = 'Software engineers, engineering leaders, and modern dev teams';
    } else if (lower.includes('fitness') || lower.includes('gym')) {
      targetAudience = 'Fitness enthusiasts, busy professionals seeking health transformation';
    }

    let objective = 'Brand Awareness & Launch Attendance';
    if (lower.includes('grand opening') || lower.includes('opening') || lower.includes('launch')) {
      objective = 'Grand Opening Buzz & Foot Traffic';
    } else if (lower.includes('exam') || lower.includes('tutoring') || lower.includes('enroll')) {
      objective = 'Course Enrollments & Student Registrations';
    }

    return {
      name: `${brandName} Launch Campaign`,
      whatPromoting: prompt.slice(0, 120),
      brandName,
      targetAudience,
      objective,
      tone: lower.includes('student') ? 'Energetic, encouraging, relatable' : 'Modern, authoritative, crisp',
      suggestedPrimaryColor: lower.includes('brew') || lower.includes('coffee') ? '#0c1222' : '#0f172a',
      suggestedSecondaryColor: lower.includes('brew') ? '#e0a96d' : '#38bdf8',
      platforms: ['Instagram', 'Shorts / Reels', 'Posters / Print', 'Email Announcement'],
    };
  };

  if (!ai) {
    return res.json(fallbackExtract());
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an expert marketing creative director. Extract core campaign parameters from this idea: "${prompt}".
Return ONLY a valid JSON object with keys:
- name (string: concise campaign title)
- whatPromoting (string: 1 sentence summary of the offering)
- brandName (string: inferred brand or business name)
- targetAudience (string: specific audience segment)
- objective (string: primary goal e.g. Awareness, Launch, Foot traffic, Registrations)
- tone (string: 3 descriptive tone adjectives)
- suggestedPrimaryColor (hex code e.g. #0f172a)
- suggestedSecondaryColor (hex code e.g. #38bdf8)
- platforms (array of strings e.g. ["Instagram", "Shorts / Reels", "Posters", "Email"])`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      ...fallbackExtract(),
      ...parsed,
    });
  } catch (err: any) {
    console.warn('Gemini extraction failed, using intelligent fallback:', err?.message);
    return res.json(fallbackExtract());
  }
});

// Endpoint: Generate full coordinated campaign package
app.post('/api/campaign/generate', rateLimit, async (req, res) => {
  const { prompt, name, whatPromoting, brandName, targetAudience, objective, tone, brandKit, platforms } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Valid prompt is required' });
  }

  const fallbackCampaign = () => {
    const bName = brandName || 'Brand';
    const pTone = tone || 'Bold, engaging, and professional';
    const aud = targetAudience || 'Modern discerning customers';
    const obj = objective || 'Driving immediate buzz and conversions';
    const primaryCol = brandKit?.primaryColor || '#0c1222';
    const accentCol = brandKit?.accentColor || '#e0a96d';

    return {
      strategy: {
        objective: obj,
        targetAudience: aud,
        coreMessage: `${bName} brings a transformative experience designed specifically for ${aud}.`,
        recommendedTone: pTone,
        keySellingPoints: [
          `Engineered specifically around the pain points of ${aud}`,
          `Uncompromising quality and attention to craft`,
          `Special launch privilege and community incentives`,
          `Accessible, memorable, and built for lasting impact`,
        ],
        suggestedCta: `Experience ${bName} Firsthand`,
      },
      assets: {
        socialPost: {
          id: `sp-${Date.now()}`,
          type: 'social_post',
          title: 'Instagram & Threads Feed Announcement',
          visualConcept: `Striking modern composition featuring ${bName} core aesthetic with bold typography and atmospheric ambient lighting.`,
          headline: `Everything you thought you knew about ${whatPromoting ? whatPromoting.slice(0, 40) : 'this space'} just changed.`,
          supportingCopy: `Meet ${bName}. Crafted for those who demand more than ordinary standards. Launching now.`,
          cta: 'Save this post & tag your inner circle',
          caption: `It’s finally happening. We’re thrilled to introduce ${bName} — built from the ground up for ${aud}. Whether you're here for the craft or the community, this is where you belong. Swipe through to see what we've prepared, and drop a comment below to claim your early access pass! #LaunchDay #${bName.replace(/\s+/g, '')} #NewRelease`,
          layoutStyle: 'editorial_split',
          aspectRatio: '1:1',
          badgeText: 'OFFICIAL LAUNCH',
        },
        poster: {
          id: `po-${Date.now()}`,
          type: 'poster',
          title: 'Promotional Canvas & Display Poster',
          posterConcept: `High-impact typographic layout with minimalist focal iconography, dramatic contrast, and clear date markers.`,
          headline: `MEET THE NEW STANDARD.`,
          subheadline: `${bName.toUpperCase()} · OFFICIAL LAUNCH`,
          supportingText: `Designed for ${aud}. Uncompromising craft, immersive atmosphere, and special opening privileges.`,
          dateOrDetails: 'LAUNCHING THIS WEEKEND · DOORS OPEN 10 AM · LIMITED PASSES',
          cta: 'BE THE FIRST THROUGH THE DOORS',
          layoutRecommendation: 'Dominant geometric hero block with brutalist contrast borders and luminous callout ribbons.',
          visualDirection: `Deep moody background with glowing ${accentCol} typography accents and subtle film grain.`,
          accentColor: accentCol,
          badgeText: 'LIMITED EDITION',
          fontFamily: 'Outfit',
          aspectRatio: '3:4',
        },
        instagramStory: {
          id: `st-${Date.now()}`,
          type: 'instagram_story',
          title: '3-Frame Interactive Story Sequence',
          overallTheme: 'Tease → Reveal → Convert flow engineered for high swipe-through rate.',
          frames: [
            {
              id: 'f-1',
              frameNumber: 1,
              visualDirection: 'Moody cinematic teaser texture with subtle motion zoom',
              mainText: `Ready for something better?`,
              subText: `We’ve been keeping a secret for months.`,
              stickerOrInteractive: 'Tap to Reveal Sticker',
              cta: 'Tap next →',
              backgroundColor: primaryCol,
            },
            {
              id: 'f-2',
              frameNumber: 2,
              visualDirection: 'Hero reveal frame showcasing product detail and core advantage',
              mainText: `Introducing ${bName}.`,
              subText: `Created for ${aud}. No shortcuts, just pure craft.`,
              stickerOrInteractive: 'Slider: How excited are you? 🔥',
              cta: 'Swipe up for details',
              backgroundColor: '#161b2e',
            },
            {
              id: 'f-3',
              frameNumber: 3,
              visualDirection: 'High-energy closing frame with bold date and exclusive offer',
              mainText: `Opening weekend passes are live.`,
              subText: `First 100 supporters unlock exclusive launch rewards.`,
              stickerOrInteractive: 'Countdown Timer to Launch Day',
              cta: 'Tap the link in bio to secure yours',
              backgroundColor: '#0b0f19',
            },
          ],
        },
        reel: {
          id: `re-${Date.now()}`,
          type: 'short_video',
          platform: 'Instagram Reel',
          hook: `POV: You just discovered what everyone will be talking about next week.`,
          musicSuggestion: 'Upbeat modern synthwave with rhythmic sub-bass and crisp percussion.',
          mood: 'Energetic, modern, confident, aspirational.',
          cta: 'Send this to someone who needs to be there on opening day.',
          totalDurationSeconds: 20,
          aspectRatio: '9:16',
          scenes: [
            {
              id: 'sc-1',
              sceneNumber: 1,
              visualDescription: 'Kinetic fast cuts showing common frustrations before the solution',
              onScreenText: 'Tired of the usual options?',
              voiceover: `If you’ve been looking for something truly tailored to ${aud}, stop scrolling.`,
              durationSeconds: 4,
              cameraOrTransition: 'Fast whip-pan transition with sound whoosh',
            },
            {
              id: 'sc-2',
              sceneNumber: 2,
              visualDescription: `Cinematic beauty shots of ${bName} in full action with vibrant colors`,
              onScreenText: `Meet ${bName}.`,
              voiceover: `This is ${bName}. We took everything you wished existed and built it without compromise.`,
              durationSeconds: 6,
              cameraOrTransition: 'Slow-motion glide with smooth depth-of-field blur',
            },
            {
              id: 'sc-3',
              sceneNumber: 3,
              visualDescription: 'Demonstration of key unique feature and community delight',
              onScreenText: 'Crafted for real impact.',
              voiceover: `From premium materials to personalized experiences, every single detail is dialed in.`,
              durationSeconds: 5,
              cameraOrTransition: 'Snap zoom on focal hero element',
            },
            {
              id: 'sc-4',
              sceneNumber: 4,
              visualDescription: 'Bold animated title card with date, venue, and action prompt',
              onScreenText: 'Launching this weekend. Don’t miss out.',
              voiceover: `Doors open this weekend. First 100 visitors receive exclusive perks. Tap the link in bio right now.`,
              durationSeconds: 5,
              cameraOrTransition: 'High-contrast logo slam end card',
            },
          ],
        },
        youtubeShort: {
          id: `yt-${Date.now()}`,
          type: 'youtube_short',
          hook: `The one thing nobody told you about ${whatPromoting ? whatPromoting.slice(0, 30) : 'launching today'}...`,
          soundDesign: 'Punchy bass drop into crisp rhythmic lo-fi beat.',
          pinnedComment: `Ready to experience ${bName}? Check the pinned link in description for early perks!`,
          cta: 'Subscribe & share this Short for VIP launch entry.',
          totalDurationSeconds: 24,
          aspectRatio: '9:16',
          scenes: [
            {
              id: 'y-1',
              sceneNumber: 1,
              visualDescription: 'Surprising visual contrast hook that stops the feed scroll',
              onScreenText: 'Stop making this mistake.',
              voiceover: `Most people settle for generic solutions when they could have something custom-built for them.`,
              durationSeconds: 6,
              cameraOrTransition: 'Rapid zoom cut',
            },
            {
              id: 'y-2',
              sceneNumber: 2,
              visualDescription: `Highlighting the signature differentiator of ${bName}`,
              onScreenText: `Why ${bName} is different.`,
              voiceover: `Here is exactly how ${bName} changes the equation for ${aud}.`,
              durationSeconds: 10,
              cameraOrTransition: 'Split-screen side by side demonstration',
            },
            {
              id: 'y-3',
              sceneNumber: 3,
              visualDescription: 'Clear call to action with animated button graphic',
              onScreenText: 'Join the launch wave.',
              voiceover: `Head to the link below and grab your early bird pass before all slots fill up.`,
              durationSeconds: 8,
              cameraOrTransition: 'Kinetic typography lockup',
            },
          ],
        },
        captions: {
          id: `cap-${Date.now()}`,
          type: 'caption_hashtags',
          instagramCaption: `The next chapter starts here. 🚀

We built ${bName} because we believe ${aud} deserves an experience that refuses to compromise on quality, atmosphere, and real value.

Here's the plan:
• Official launch festivities this weekend
• Early access privileges for our founding community
• Special rewards for the first 100 arrivals

Save this post, set your calendar reminder, and tag a friend who needs to see this today. Link in bio!`,
          linkedinCaption: `Thrilled to introduce ${bName} to our network today.

Our team set out with a simple mission: build an offering tailored from the ground up for ${aud}. By focusing on deliberate craft, community alignment, and modern workflow, ${bName} represents an exciting milestone in our journey.

Special thanks to our early testers, advisors, and supporters who shaped this launch. Discover more details via the link below.`,
          tiktokCaption: `If you’ve been looking for a sign to try something new, this is it 👀 ${bName} is finally here! Run don't walk #newlaunch #viral #musttry #${bName.replace(/\s+/g, '')}`,
          xCaption: `It's official: ${bName} is live.

Designed specifically for ${aud}.
• Groundbreaking craft
• Opening week perks
• Limited availability

Don't sleep on this launch. Link in bio 🚀`,
          hashtags: {
            primary: [`#${bName.replace(/\s+/g, '')}`, '#NewLaunch', '#Innovation', '#Community'],
            niche: ['#QualityFirst', '#DesignDriven', '#TrendingNow', '#CreatorEconomy'],
            campaign: ['#LaunchWave', '#EarlyAccess', '#ExperienceMore'],
          },
        },
        adCopy: {
          id: `ad-${Date.now()}`,
          type: 'ad_copy',
          variants: [
            {
              id: 'v-1',
              framework: 'Problem-Agitate-Solve',
              headline: `Struggling with standard options? Discover ${bName}.`,
              primaryText: `You shouldn’t have to settle for outdated solutions. ${bName} delivers the precision, quality, and experience you’ve been waiting for. Opening this week.`,
              ctaButton: 'Claim Launch Offer',
            },
            {
              id: 'v-2',
              framework: 'Benefit-Driven',
              headline: `Built From Scratch For ${aud}`,
              primaryText: `Experience why ${bName} is winning early praise. Enjoy exclusive perks when you join our inaugural cohort today.`,
              ctaButton: 'Get Started Today',
            },
            {
              id: 'v-3',
              framework: 'Urgency / FOMO',
              headline: `First 100 Supporters Receive Exclusive Perks ⚡`,
              primaryText: `Limited slots available for launch week. Secure your priority spot and experience ${bName} before everyone else.`,
              ctaButton: 'Reserve Your Spot Now',
            },
          ],
        },
        email: {
          id: `em-${Date.now()}`,
          type: 'email_announcement',
          subjectLines: [
            `Introducing ${bName}: An exciting new chapter begins`,
            `Special invitation: Join the official launch of ${bName}`,
            `Doors open this weekend — your early access pass inside`,
          ],
          previewText: `Be among the first to experience ${bName} with exclusive opening week perks.`,
          headerGreeting: 'Hello and welcome,',
          bodyParagraphs: [
            `We couldn’t be more proud to officially introduce ${bName} to you today.`,
            `Over the past several months, our team has poured relentless craft into building something truly meaningful for ${aud}. We noticed that existing alternatives were either too generic or lacked the focus needed for real results.`,
            `To mark our launch, we’re extending an exclusive welcome invitation to our early community. Drop by this weekend to experience what we've built, meet the team, and take advantage of our opening perks.`,
          ],
          bulletPoints: [
            `🚀 What: Official launch celebration for ${bName}`,
            `🎯 Who: Tailored specifically for ${aud}`,
            `🎁 Launch Privilege: Special gift or bonus for the first 100 attendees`,
            `📍 Where: Check our official channels for venue & access details`,
          ],
          ctaButton: {
            text: `RSVP & Claim Your Launch Pass`,
            linkPlaceholder: `https://${bName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/launch`,
          },
          psNote: `P.S. Forward this email to two colleagues or friends and show this confirmation at the check-in for an additional complimentary surprise.`,
        },
      },
    };
  };

  if (!ai) {
    return res.json(fallbackCampaign());
  }

  try {
    const systemPrompt = `You are the creative director of "Insanely creative 27", an elite AI Content Production Studio.
Generate a cohesive, synchronized multi-channel content campaign.
Maintain total consistency across brand voice, visual identity, target audience, and key selling propositions.

Input details:
- Idea / Prompt: "${prompt}"
- Campaign Name: "${name || 'Campaign'}"
- What is being promoted: "${whatPromoting || prompt}"
- Brand Name: "${brandName || 'Brand'}"
- Target Audience: "${targetAudience || 'Core audience'}"
- Campaign Objective: "${objective || 'Launch'}"
- Preferred Tone: "${tone || 'Bold and captivating'}"
- Brand Colors: Primary=${brandKit?.primaryColor || '#0c1222'}, Accent=${brandKit?.accentColor || '#e0a96d'}

Return a strictly valid JSON object matching this schema:
{
  "strategy": {
    "objective": string,
    "targetAudience": string,
    "coreMessage": string,
    "recommendedTone": string,
    "keySellingPoints": [string, string, string, string],
    "suggestedCta": string
  },
  "assets": {
    "socialPost": {
      "id": string,
      "type": "social_post",
      "title": string,
      "visualConcept": string,
      "headline": string,
      "supportingCopy": string,
      "cta": string,
      "caption": string,
      "layoutStyle": "bold_centered" | "editorial_split" | "minimal_accent",
      "aspectRatio": "1:1",
      "badgeText": string
    },
    "poster": {
      "id": string,
      "type": "poster",
      "title": string,
      "posterConcept": string,
      "headline": string,
      "subheadline": string,
      "supportingText": string,
      "dateOrDetails": string,
      "cta": string,
      "layoutRecommendation": string,
      "visualDirection": string,
      "accentColor": string,
      "badgeText": string,
      "fontFamily": "Outfit" | "Plus Jakarta Sans",
      "aspectRatio": "3:4"
    },
    "instagramStory": {
      "id": string,
      "type": "instagram_story",
      "title": string,
      "overallTheme": string,
      "frames": [
        {
          "id": string,
          "frameNumber": number,
          "visualDirection": string,
          "mainText": string,
          "subText": string,
          "stickerOrInteractive": string,
          "cta": string,
          "backgroundColor": string
        }
      ]
    },
    "reel": {
      "id": string,
      "type": "short_video",
      "platform": "Instagram Reel",
      "hook": string,
      "musicSuggestion": string,
      "mood": string,
      "cta": string,
      "totalDurationSeconds": number,
      "aspectRatio": "9:16",
      "scenes": [
        {
          "id": string,
          "sceneNumber": number,
          "visualDescription": string,
          "onScreenText": string,
          "voiceover": string,
          "durationSeconds": number,
          "cameraOrTransition": string
        }
      ]
    },
    "youtubeShort": {
      "id": string,
      "type": "youtube_short",
      "hook": string,
      "soundDesign": string,
      "pinnedComment": string,
      "cta": string,
      "totalDurationSeconds": number,
      "aspectRatio": "9:16",
      "scenes": [
        {
          "id": string,
          "sceneNumber": number,
          "visualDescription": string,
          "onScreenText": string,
          "voiceover": string,
          "durationSeconds": number,
          "cameraOrTransition": string
        }
      ]
    },
    "captions": {
      "id": string,
      "type": "caption_hashtags",
      "instagramCaption": string,
      "linkedinCaption": string,
      "tiktokCaption": string,
      "xCaption": string,
      "hashtags": {
        "primary": [string, string, string, string],
        "niche": [string, string, string, string],
        "campaign": [string, string, string]
      }
    },
    "adCopy": {
      "id": string,
      "type": "ad_copy",
      "variants": [
        {
          "id": string,
          "framework": "Problem-Agitate-Solve" | "Benefit-Driven" | "Urgency / FOMO",
          "headline": string,
          "primaryText": string,
          "ctaButton": string
        }
      ]
    },
    "email": {
      "id": string,
      "type": "email_announcement",
      "subjectLines": [string, string, string],
      "previewText": string,
      "headerGreeting": string,
      "bodyParagraphs": [string, string, string],
      "bulletPoints": [string, string, string, string],
      "ctaButton": {
        "text": string,
        "linkPlaceholder": string
      },
      "psNote": string
    }
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (!parsed.strategy || !parsed.assets) {
      throw new Error('Incomplete structure from Gemini response');
    }
    return res.json(parsed);
  } catch (err: any) {
    console.warn('Gemini campaign generation failed, using rich fallback:', err?.message);
    return res.json(fallbackCampaign());
  }
});

// Endpoint: Edit specific asset with natural language
app.post('/api/campaign/edit-asset', async (req, res) => {
  const { assetType, currentAsset, instruction, brandKit, campaignContext } = req.body;

  if (!ai) {
    // Intelligent fallback editing
    const updated = { ...currentAsset };
    const inst = (instruction || '').toLowerCase();
    if (inst.includes('short')) {
      if (updated.headline) updated.headline = updated.headline.split(' ').slice(0, 5).join(' ');
      if (updated.subheadline) updated.subheadline = 'Now Open · Limited Passes';
    } else if (inst.includes('gen z') || inst.includes('casual')) {
      if (updated.headline) updated.headline = `No cap, this is about to change everything 🔥`;
      if (updated.cta) updated.cta = 'Tap in before it blows up';
    } else if (inst.includes('professional') || inst.includes('formal')) {
      if (updated.headline) updated.headline = `Engineered for Exceptional Performance & Focus`;
      if (updated.cta) updated.cta = 'Request Your Consultation';
    } else if (inst.includes('stronger cta') || inst.includes('cta')) {
      updated.cta = 'Claim Your Priority Access Today — Limited Spots';
    } else {
      if (updated.headline) updated.headline = `${updated.headline} (Updated)`;
    }
    return res.json({ updatedAsset: updated });
  }

  try {
    const prompt = `You are an AI creative director. Modify the given marketing asset based on the user's natural language instruction.
Asset Type: ${assetType}
Current Asset JSON:
${JSON.stringify(currentAsset, null, 2)}

User Instruction: "${instruction}"
Brand Tone: ${brandKit?.tone || 'Consistent and high quality'}
Campaign Context: ${campaignContext || ''}

Apply the requested modifications while maintaining valid JSON structure and marketing effectiveness.
Return ONLY the updated Asset as a JSON object matching the exact original structure.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ updatedAsset: parsed });
  } catch (err: any) {
    console.warn('Gemini asset edit failed:', err?.message);
    return res.json({ updatedAsset: currentAsset });
  }
});

// Endpoint: Apply global tone change across assets
app.post('/api/campaign/apply-tone', async (req, res) => {
  const { campaign, newTone, targetAssetKeys } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      updatedTone: newTone,
      message: `Updated campaign tone to: ${newTone}`,
    });
  }

  try {
    const prompt = `You are an AI brand strategist. The user wants to change their campaign tone to: "${newTone}".
Current Campaign Core Message: "${campaign?.strategy?.coreMessage}"
Current Tone: "${campaign?.strategy?.recommendedTone}"

Rewrite the headlines and CTAs for:
1. Social Post (headline, cta)
2. Poster (headline, cta, subheadline)
3. Reel Hook & CTA
4. Email Subject Line

Return a JSON with keys:
{
  "recommendedTone": string,
  "socialHeadline": string,
  "socialCta": string,
  "posterHeadline": string,
  "posterSubheadline": string,
  "posterCta": string,
  "reelHook": string,
  "reelCta": string,
  "emailSubject": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, changes: parsed });
  } catch (err: any) {
    return res.json({ success: false, error: err?.message });
  }
});

// Google Play Store Digital Asset Links for Trusted Web Activity (TWA)
app.get('/.well-known/assetlinks.json', (req, res) => {
  res.json([
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'com.aryansood.insanelycreative27',
        sha256_cert_fingerprints: [
          'FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C'
        ]
      }
    }
  ]);
});

// App Store & Play Store mandatory Privacy Policy
app.get('/privacy', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Privacy Policy — Insanely creative 27</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;line-height:1.6;color:#222;}</style></head><body><h1>Privacy Policy</h1><p><strong>Effective Date:</strong> November 1, 2026</p><p><strong>Application:</strong> Insanely creative 27</p><p><strong>Developer & Publisher:</strong> Aryan Sood (aryansood2704@gmail.com)</p><h2>1. Overview</h2><p>Insanely creative 27 respects your privacy. All campaign content, brand kits, and prompts remain private. We do not sell or monetize personal data.</p><h2>2. Data Collection</h2><p>• Local Storage: Campaign drafts and brand preferences are stored locally in your browser/app container.<br>• AI Processing: Prompt text is processed securely via Google Gemini APIs exclusively to generate campaign assets.</p><h2>3. Ownership & Copyright</h2><p>All intellectual property, branding, and rights in the software are owned by Aryan Sood. You retain full ownership of the custom marketing copy and images generated for your campaigns.</p><h2>4. Contact</h2><p>For privacy inquiries, contact Aryan Sood at aryansood2704@gmail.com.</p></body></html>`);
});

// Terms of Service
app.get('/terms', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Terms of Service — Insanely creative 27</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;line-height:1.6;color:#222;}</style></head><body><h1>Terms of Service</h1><p><strong>Developer & Publisher:</strong> Aryan Sood</p><p>By using Insanely creative 27, you agree to use the service for lawful marketing and creative purposes.</p></body></html>`);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    publisher: 'Aryan Sood',
    timestamp: new Date().toISOString(),
  });
});

// Setup Vite middleware in dev or static files in production
if (!isProd) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Insanely creative 27 studio server running at http://0.0.0.0:${PORT}`);
});
