import { Campaign, BrandKit } from '../types/campaign';

export const defaultBrandKit: BrandKit = {
  brandName: 'Insanely creative 27',
  tagline: 'Turn one idea into an entire content campaign.',
  primaryColor: '#090a0f',
  secondaryColor: '#74cfb6',
  accentColor: '#bef264',
  fontPairing: 'modern-sans',
  tone: 'Avant-garde, sharp, high-energy, futuristic & bold',
  logoUrl: '/logo.png',
  logoText: '27 INSANELY CREATIVE',
  valueProps: [
    'One prompt generates 8 coordinated multi-channel assets',
    'Automated visual identity, copy, storyboards & audio vibe',
    'Campaign memory ensures harmonious cross-platform consistency',
  ],
};

export const sampleMoonBrewCampaign: Campaign = {
  id: 'moon-brew-grand-opening',
  name: 'Moon Brew — Grand Opening Campaign',
  prompt: 'I’m launching a new café called Moon Brew. Grand opening this Saturday. Target audience is college students and creative night owls.',
  createdAt: '2026-10-31T20:00:00.000Z',
  updatedAt: '2026-11-01T06:00:00.000Z',
  status: 'ready',
  thumbnailUrl: '/src/assets/images/moon_brew_hero_coffee_1793543143910.jpg',
  brandKit: defaultBrandKit,
  strategy: {
    objective: 'Drive packed attendance on opening day and build an organic campus word-of-mouth loop.',
    targetAudience: 'University undergraduates, graduate researchers, student founders, and local night owls.',
    coreMessage: 'Where late-night focus meets slow-crafted caffeine. Your new sanctuary opens this Saturday.',
    recommendedTone: 'Atmospheric, culturally savvy, warm, and inviting without feeling corporate.',
    keySellingPoints: [
      'First 100 students get free Moon Cold Brew & custom enamel pin',
      'Acoustic ambient lo-fi sessions from 7 PM to midnight',
      'Ultra-fast Wi-Fi, study bays, and beanbag reading nooks',
      'Open until 2:00 AM every Thursday through Sunday',
    ],
    suggestedCta: 'Claim Your Opening Night Pass',
  },
  assets: {
    socialPost: {
      id: 'asset-sp-1',
      type: 'social_post',
      title: 'Instagram & Threads Feed Drop',
      visualConcept: 'Moody top-down view of Moon Brew specialty cold brew with crescent foam art on dark rustic oak wood.',
      headline: 'Late nights just got a serious upgrade.',
      supportingCopy: 'Moon Brew opens its doors this Saturday at 10 AM. First 100 through the door unlock free signature cold brew all weekend.',
      cta: 'Tag your study partner below',
      caption: 'The rumor on campus is true. Moon Brew opens this Saturday at 10 AM right on 4th & College. 🌙☕ First 100 students grab our 24-hour slow drip for free + an opening night survival kit. Flash your college ID for 20% off all semester. Tag who you’re dragging along! #MoonBrew #CampusLife',
      layoutStyle: 'editorial_split',
      aspectRatio: '1:1',
      imageUrl: '/src/assets/images/moon_brew_hero_coffee_1793543143910.jpg',
      badgeText: 'THIS SATURDAY · 10 AM',
    },
    poster: {
      id: 'asset-po-1',
      type: 'poster',
      title: 'Campus & Window Display Poster',
      posterConcept: 'High-contrast nocturnal celestial artwork combining a crescent moon and steaming artisanal mug with gold stardust typography.',
      headline: 'FUEL FOR THE MIDNIGHT MIND.',
      subheadline: 'GRAND OPENING CELEBRATION',
      supportingText: 'Single-origin cold brew steeped 24 hours. Deep acoustics. Zero rush. Doors open Saturday at 10:00 AM.',
      dateOrDetails: 'SATURDAY, NOV 7 · 10 AM TILL 2 AM · 402 COLLEGE BLVD',
      cta: 'FIRST 100 CUPS ON US WITH STUDENT ID',
      layoutRecommendation: 'High-contrast poster with celestial focal emblem, structured brutalist typography base, and prominent date kicker.',
      visualDirection: 'Midnight deep blue canvas with luminous warm amber typography and grain overlay.',
      accentColor: '#e0a96d',
      badgeText: 'GRAND OPENING',
      imageUrl: '/src/assets/images/moon_brew_poster_visual_1793543144586.jpg',
      fontFamily: 'Outfit',
      aspectRatio: '3:4',
    },
    instagramStory: {
      id: 'asset-st-1',
      type: 'instagram_story',
      title: '3-Part Launch Countdown Sequence',
      overallTheme: 'Nocturnal countdown teasing campus students to reserve their spot.',
      frames: [
        {
          id: 'frame-1',
          frameNumber: 1,
          visualDirection: 'Slow motion steam rising off freshly brewed espresso against amber glowing neon café sign.',
          mainText: 'Tired of studying in sterile library basements?',
          subText: 'Something different is arriving to campus this weekend.',
          stickerOrInteractive: 'Poll: Coffee person or Matcha lover?',
          cta: 'Tap to see the space →',
          backgroundColor: '#0c1222',
        },
        {
          id: 'frame-2',
          frameNumber: 2,
          visualDirection: 'Warm pan of comfortable velvet booths, power outlets at every desk, and dim amber ambient lamps.',
          mainText: 'Meet Moon Brew.',
          subText: '24-hour cold brew on tap. Open until 2 AM. Fiber internet that never drops.',
          stickerOrInteractive: 'Countdown Timer: Grand Opening Saturday 10:00 AM',
          cta: 'Swipe up for sneak peek',
          backgroundColor: '#161b2e',
        },
        {
          id: 'frame-3',
          frameNumber: 3,
          visualDirection: 'Barista pouring creamy oat milk into swirling cold brew with celestial crescent art.',
          mainText: 'First 100 students get free brew.',
          subText: 'Saturday Nov 7 · 402 College Blvd · Bring your student ID.',
          stickerOrInteractive: 'Add Yours: Your late-night study crew',
          cta: 'Claim Your Pass in Bio',
          backgroundColor: '#0b0f19',
        },
      ],
    },
    reel: {
      id: 'asset-re-1',
      type: 'short_video',
      platform: 'Instagram Reel',
      hook: 'POV: You found the holy grail study spot that stays open until 2 AM with actually insane coffee.',
      musicSuggestion: 'Chill instrumental lo-fi jazz beat with warm vinyl crackle and smooth bass drop.',
      mood: 'Aesthetic, cozy, aspirational, late-night student haven.',
      cta: 'Save this for your next finals cram session or opening Saturday!',
      totalDurationSeconds: 22,
      aspectRatio: '9:16',
      scenes: [
        {
          id: 'scene-1',
          sceneNumber: 1,
          visualDescription: 'Extreme close-up: Ice dropping into a heavy ribbed glass tumbler, amber cold brew pouring in slow-motion.',
          onScreenText: 'Campus just got its new obsession.',
          voiceover: 'If your current study spot closes at 8 PM and smells like stale printer paper... listen up.',
          durationSeconds: 4,
          cameraOrTransition: 'Macro push-in with crisp audio foley of ice clinking',
          imageUrl: '/src/assets/images/moon_brew_hero_coffee_1793543143910.jpg',
        },
        {
          id: 'scene-2',
          sceneNumber: 2,
          visualDescription: 'Fast aesthetic montage of plush emerald armchairs, glowing warm amber lamps, quiet laptop workspaces.',
          onScreenText: 'Moon Brew: open until 2 AM every weekend.',
          voiceover: 'Moon Brew is officially opening its doors this Saturday right across from student commons.',
          durationSeconds: 6,
          cameraOrTransition: 'Smooth lateral gimbal glide through cozy seating bays',
          imageUrl: '/src/assets/images/studio_creative_desk_1793543143344.jpg',
        },
        {
          id: 'scene-3',
          sceneNumber: 3,
          visualDescription: 'Barista dusting cinnamon crescent stencil on silky foam, student smiling with steaming cup.',
          onScreenText: 'First 100 students drink free this Saturday.',
          voiceover: 'Single-origin 24-hour slow drip, actual fiber internet, and the first 100 students on Saturday drink completely free.',
          durationSeconds: 7,
          cameraOrTransition: 'Rack focus from coffee cup to excited friend table',
          imageUrl: '/src/assets/images/moon_brew_poster_visual_1793543144586.jpg',
        },
        {
          id: 'scene-4',
          sceneNumber: 4,
          visualDescription: 'Animated logo lockup with calendar pin dropping on Saturday 10 AM, location coordinates.',
          onScreenText: 'Doors open Saturday @ 10 AM. Tag the crew.',
          voiceover: 'Doors swing open Saturday at 10 AM. Send this to whoever needs a new caffeine dealer.',
          durationSeconds: 5,
          cameraOrTransition: 'Quick snap zoom to animated logo card',
          imageUrl: '/src/assets/images/moon_brew_hero_coffee_1793543143910.jpg',
        },
      ],
    },
    youtubeShort: {
      id: 'asset-yt-1',
      type: 'youtube_short',
      hook: 'Don’t buy another watered-down library latte until you watch this.',
      soundDesign: 'Punchy 808 beat with subtle vinyl ambient cafe noise in background.',
      pinnedComment: 'First 100 students get free coffee this Saturday! Link in description for opening event details.',
      cta: 'Subscribe & show this Short at the counter for 15% off your first pastry.',
      totalDurationSeconds: 26,
      aspectRatio: '9:16',
      scenes: [
        {
          id: 'yt-s-1',
          sceneNumber: 1,
          visualDescription: 'Student looking dejected at a closed campus cafeteria at 9 PM, cut to vibrant neon sign lighting up.',
          onScreenText: 'Why does everything good close at 9 PM?',
          voiceover: 'College town tragedy number one: having an exam tomorrow and nowhere open with quiet corners and good caffeine.',
          durationSeconds: 6,
          cameraOrTransition: 'Snap cut between frustration and revelation',
          imageUrl: '/src/assets/images/studio_creative_desk_1793543143344.jpg',
        },
        {
          id: 'yt-s-2',
          sceneNumber: 2,
          visualDescription: 'Cinematic barista shot pulling espresso shot with rich crema and pouring oat milk.',
          onScreenText: 'Enter Moon Brew. 24h Cold Drip.',
          voiceover: 'We built Moon Brew specifically for the night owls, researchers, and creators who do their best thinking after dark.',
          durationSeconds: 9,
          cameraOrTransition: 'High frame-rate slow motion liquid pour',
          imageUrl: '/src/assets/images/moon_brew_hero_coffee_1793543143910.jpg',
        },
        {
          id: 'yt-s-3',
          sceneNumber: 3,
          visualDescription: 'Map overlay showing walking route from campus quad right to 402 College Blvd.',
          onScreenText: 'Grand Opening this Saturday @ 10 AM',
          voiceover: 'Opening this Saturday morning at 10. Free cups to the first hundred people through the door.',
          durationSeconds: 11,
          cameraOrTransition: 'Fast kinetic text with animated map pin',
          imageUrl: '/src/assets/images/moon_brew_poster_visual_1793543144586.jpg',
        },
      ],
    },
    captions: {
      id: 'asset-cap-1',
      type: 'caption_hashtags',
      instagramCaption: `The wait is over, night owls. 🌙☕

Say goodbye to fighting for outlets in overcrowded campus dining halls. Moon Brew is officially opening its doors this Saturday, Nov 7 at 10:00 AM.

What you need to know:
• First 100 students get a complimentary 24-hr Moon Cold Brew + commemorative pin
• Open until 2:00 AM Thursday through Sunday
• Dedicated quiet study alcoves with high-speed fiber internet
• 20% off all semester long when you present your student ID

📍 402 College Blvd (right next to the North Quad)
🗓 Saturday, Nov 7 · Doors open at 10:00 AM sharp

Tag your study partner who runs on iced coffee and big dreams. See you under the moon.`,
      linkedinCaption: `Excited to announce the launch of Moon Brew — an independent third-wave café concept engineered for academic and creative focus.

Opening this Saturday at 402 College Blvd, Moon Brew bridges the gap between artisanal specialty roasting and purposeful, productivity-centric spaces. Featuring single-origin beans, extended evening operating hours until 2:00 AM, and quiet study alcoves equipped with fiber connectivity.

Congratulations to the entire founding crew and local baristas bringing this vision to life. If you are in the university district this Saturday, drop by for our opening celebration starting at 10:00 AM.`,
      tiktokCaption: `POV: your campus finally gets an aesthetic café that doesn't kick you out at 8pm 😭🌙 Opening this Saturday! First 100 get free coffee run don't walk #collegelife #studywithme #cafetok #grandopening #coffeetiktok`,
      xCaption: `College students: your late-night study drought ends this Saturday.

Moon Brew opens at 10 AM on 402 College Blvd.
• 24-hr cold brew
• Outlets at every single seat
• Open until 2 AM
• First 100 cups are 100% free

Don't sleep on it. 🌙`,
      hashtags: {
        primary: ['#MoonBrew', '#CoffeeLovers', '#GrandOpening', '#CampusLife'],
        niche: ['#NightOwlVibes', '#SpecialtyCoffeeRoaster', '#StudySpotGoals', '#ColdBrewAddict'],
        campaign: ['#First100Free', '#StudyAfterDark', '#MoonBrewSaturday'],
      },
    },
    adCopy: {
      id: 'asset-ad-1',
      type: 'ad_copy',
      variants: [
        {
          id: 'ad-v1',
          framework: 'Problem-Agitate-Solve',
          headline: 'Tired of fighting for library outlets at 9 PM?',
          primaryText: 'Most campus spots kick you out right when your brain starts flowing. Moon Brew is built different: artisanal cold brew, fiber internet, and doors open until 2 AM. Opening this Saturday on College Blvd.',
          ctaButton: 'Get Your Opening Day Invite',
        },
        {
          id: 'ad-v2',
          framework: 'Urgency / FOMO',
          headline: 'First 100 Students Drink Free This Saturday ☕',
          primaryText: 'The secret is out. Moon Brew opens Saturday at 10 AM. Be one of the first 100 in line to score our signature 24-hour slow drip on the house. Bring your student ID.',
          ctaButton: 'Set a Reminder Now',
        },
        {
          id: 'ad-v3',
          framework: 'Benefit-Driven',
          headline: 'Craft Coffee Engineered For Focus & Flow',
          primaryText: 'Single-origin Ethiopian roasts, quiet acoustic seating, and power outlets at every booth. Discover your new second home on campus starting this Saturday.',
          ctaButton: 'Explore The Menu & Space',
        },
      ],
    },
    email: {
      id: 'asset-em-1',
      type: 'email_announcement',
      subjectLines: [
        '🌙 Coffee that keeps up with your late nights: Moon Brew opens Saturday!',
        'Your new campus sanctuary (plus free coffee this Saturday inside)',
        'Doors open at 10 AM: Come celebrate Moon Brew’s Grand Opening',
      ],
      previewText: 'First 100 students score free 24-hour cold brew on Saturday. See location & details inside.',
      headerGreeting: 'Hey fellow coffee enthusiast,',
      bodyParagraphs: [
        'If you’ve ever found yourself packing up your laptop because a café was closing at 8:00 PM just as your breakthrough hit, we built Moon Brew for you.',
        'This Saturday, November 7 at 10:00 AM, we’re officially opening our doors at 402 College Boulevard. We designed every square foot around deep work and relaxed socializing: whisper-quiet acoustics, comfortable booths, high-speed fiber internet, and our proprietary 24-hour slow drip cold brew.',
        'To celebrate our arrival in the community, the first 100 students through the door on Saturday morning will receive their choice of specialty cold brew completely on us, plus an exclusive Moon Brew opening badge.',
      ],
      bulletPoints: [
        '📍 Location: 402 College Blvd (200m from the North Campus Gate)',
        '⏰ Hours: Thursday – Sunday, 7:00 AM to 2:00 AM (Monday – Wednesday till 11:00 PM)',
        '🎓 Student Advantage: 20% off all espresso and cold brew drinks with valid ID',
        '⚡ Space Perks: Ergonomic seating, dual power outlets per seat, curated lo-fi acoustics',
      ],
      ctaButton: {
        text: 'RSVP on Campus Community & Save to Calendar',
        linkPlaceholder: 'https://moonbrew.coffee/opening',
      },
      psNote: 'P.S. Bringing your whole study squad? Show this email at the counter anytime during opening weekend for a free warm cinnamon brioche with any two drinks.',
    },
  },
};
