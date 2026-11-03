import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Share2,
  Film,
  Play,
  FileText,
  Target,
  Mail,
  Edit3,
  RefreshCw,
  Copy,
  Download,
  Check,
  ChevronDown,
  SlidersHorizontal,
  ArrowLeft,
  Wand2,
  Maximize2,
  RotateCcw,
  Palette,
  ExternalLink,
  FolderArchive,
  Loader2,
} from 'lucide-react';
import JSZip from 'jszip';
import { Campaign, BrandKit } from '../types/campaign';
import { applyCampaignTone } from '../services/apiClient';

interface CampaignViewProps {
  campaign: Campaign;
  onUpdateCampaign: (updated: Campaign) => void;
  onBackToOverview: () => void;
  onOpenVisualEditor: (assetType: 'poster' | 'social_post') => void;
  onOpenVideoStudio: (videoType: 'reel' | 'youtubeShort') => void;
  onOpenAiEditModal: (assetKey: string, currentAsset: any) => void;
  onDuplicateAsset: (assetKey: string) => void;
}

type TabCategory = 'all' | 'visuals' | 'videos' | 'copy';

const fetchImageBlob = async (
  url: string
): Promise<{ data: Blob | Uint8Array; extension: string } | null> => {
  try {
    if (url.startsWith('data:')) {
      const parts = url.split(',');
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const ext =
        mime.includes('jpeg') || mime.includes('jpg')
          ? 'jpg'
          : mime.includes('svg')
          ? 'svg'
          : mime.includes('webp')
          ? 'webp'
          : 'png';
      return { data: u8arr, extension: ext };
    }
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    const contentType = res.headers.get('content-type') || '';
    let ext = 'png';
    if (
      contentType.includes('jpeg') ||
      contentType.includes('jpg') ||
      url.endsWith('.jpg') ||
      url.endsWith('.jpeg')
    ) {
      ext = 'jpg';
    } else if (contentType.includes('svg') || url.endsWith('.svg')) {
      ext = 'svg';
    } else if (contentType.includes('webp') || url.endsWith('.webp')) {
      ext = 'webp';
    }
    return { data: blob, extension: ext };
  } catch (err) {
    console.warn('Could not fetch asset image for ZIP packaging:', url, err);
    return null;
  }
};

export const CampaignView: React.FC<CampaignViewProps> = ({
  campaign,
  onUpdateCampaign,
  onBackToOverview,
  onOpenVisualEditor,
  onOpenVideoStudio,
  onOpenAiEditModal,
  onDuplicateAsset,
}) => {
  const [activeTab, setActiveTab] = useState<TabCategory>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isToneModalOpen, setIsToneModalOpen] = useState(false);
  const [newToneInput, setNewToneInput] = useState('');
  const [isApplyingTone, setIsApplyingTone] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showStrategyDrawer, setShowStrategyDrawer] = useState(true);

  const { strategy, assets, brandKit } = campaign;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const copyToClipboard = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    triggerToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApplyToneChange = async () => {
    if (!newToneInput.trim()) return;
    setIsApplyingTone(true);
    try {
      const result = await applyCampaignTone({
        campaign,
        newTone: newToneInput.trim(),
      });

      if (result.success && result.changes) {
        const c = result.changes;
        const updated: Campaign = {
          ...campaign,
          strategy: {
            ...campaign.strategy,
            recommendedTone: c.recommendedTone || newToneInput.trim(),
          },
          assets: {
            ...campaign.assets,
            socialPost: {
              ...campaign.assets.socialPost,
              headline: c.socialHeadline || campaign.assets.socialPost.headline,
              cta: c.socialCta || campaign.assets.socialPost.cta,
            },
            poster: {
              ...campaign.assets.poster,
              headline: c.posterHeadline || campaign.assets.poster.headline,
              subheadline: c.posterSubheadline || campaign.assets.poster.subheadline,
              cta: c.posterCta || campaign.assets.poster.cta,
            },
            reel: {
              ...campaign.assets.reel,
              hook: c.reelHook || campaign.assets.reel.hook,
              cta: c.reelCta || campaign.assets.reel.cta,
            },
            email: {
              ...campaign.assets.email,
              subjectLines: c.emailSubject
                ? [c.emailSubject, ...campaign.assets.email.subjectLines.slice(1)]
                : campaign.assets.email.subjectLines,
            },
          },
        };
        onUpdateCampaign(updated);
        triggerToast(`Campaign harmonized to new tone: ${newToneInput.trim()}`);
      } else {
        // Local fallback update
        const updated: Campaign = {
          ...campaign,
          strategy: {
            ...campaign.strategy,
            recommendedTone: newToneInput.trim(),
          },
        };
        onUpdateCampaign(updated);
        triggerToast(`Updated campaign tone.`);
      }
    } finally {
      setIsApplyingTone(false);
      setIsToneModalOpen(false);
      setNewToneInput('');
    }
  };

  const exportFullCampaign = () => {
    const markdown = `# Campaign: ${campaign.name}
**Prompt**: ${campaign.prompt}
**Target Audience**: ${strategy.targetAudience}
**Core Message**: ${strategy.coreMessage}
**Tone**: ${strategy.recommendedTone}

---

## 1. Promotional Poster
- **Headline**: ${assets.poster.headline}
- **Subheadline**: ${assets.poster.subheadline}
- **Supporting**: ${assets.poster.supportingText}
- **Details**: ${assets.poster.dateOrDetails}
- **CTA**: ${assets.poster.cta}

## 2. Social Post (Feed)
- **Headline**: ${assets.socialPost.headline}
- **Supporting**: ${assets.socialPost.supportingCopy}
- **CTA**: ${assets.socialPost.cta}
- **Caption**:
${assets.socialPost.caption}

## 3. Instagram Story Sequence
${assets.instagramStory.frames.map((f) => `### Frame ${f.frameNumber}: ${f.mainText}\n${f.subText} (Sticker: ${f.stickerOrInteractive})`).join('\n\n')}

## 4. Short Video / Reel Storyboard
**Hook**: "${assets.reel.hook}"
**Duration**: ${assets.reel.totalDurationSeconds}s | **Music**: ${assets.reel.musicSuggestion}
${assets.reel.scenes.map((s) => `### Scene ${s.sceneNumber} (${s.durationSeconds}s): ${s.visualDescription}\nOn-Screen: "${s.onScreenText}"\nVoiceover: "${s.voiceover}"`).join('\n\n')}

## 5. Captions & Hashtags
### Instagram:
${assets.captions.instagramCaption}

### LinkedIn:
${assets.captions.linkedinCaption}

### Hashtags:
${assets.captions.hashtags.primary.join(' ')} ${assets.captions.hashtags.niche.join(' ')}

## 6. Ad Copy Variations
${assets.adCopy.variants.map((v) => `### [${v.framework}] ${v.headline}\n${v.primaryText}\nButton: ${v.ctaButton}`).join('\n\n')}

## 7. Announcement Email
**Subject Lines**:
${assets.email.subjectLines.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}
**Body**:
${assets.email.bodyParagraphs.join('\n\n')}
`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${campaign.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-campaign.md`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Full campaign package exported as Markdown!');
  };

  const exportCampaignZip = async () => {
    setIsExportingZip(true);
    triggerToast('Packaging campaign assets into ZIP archive...');
    try {
      const zip = new JSZip();
      const slug = (campaign.name || 'campaign')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');

      // 1. Root README & Overview
      const readme = `# ${campaign.name} — Coordinated Campaign Asset Bundle
Generated with 27 Insanely Creative Studio
Creator: Aryan Sood (Founder & Creative Director)

## Campaign Strategy Summary
- **Campaign Name**: ${campaign.name}
- **Original Brief**: "${campaign.prompt}"
- **Objective**: ${strategy.objective}
- **Target Audience**: ${strategy.targetAudience}
- **Core Message**: "${strategy.coreMessage}"
- **Tone & Voice**: ${strategy.recommendedTone}
- **Suggested CTA**: ${strategy.suggestedCta}

## Asset Directory Structure
- \`strategy/\`: Comprehensive marketing brief and JSON schema
- \`brand/\`: Brand kit specifications, color palette, typography guidelines
- \`copy/\`: Ready-to-publish social captions, hashtags, AIDA/PAS ad variants, and email launch copy
- \`video/\`: Storyboards, shot lists, audio cues, voiceover scripts for Reels & YouTube Shorts
- \`visuals/\`: Layout specifications, poster copy, visual prompts, and rendered graphic assets
`;
      zip.file('README.md', readme);

      // 2. Full Campaign Markdown
      const fullMarkdown = `# Campaign: ${campaign.name}
**Prompt**: ${campaign.prompt}
**Target Audience**: ${strategy.targetAudience}
**Core Message**: ${strategy.coreMessage}
**Tone**: ${strategy.recommendedTone}

---

## 1. Promotional Poster
- **Headline**: ${assets.poster.headline}
- **Subheadline**: ${assets.poster.subheadline}
- **Supporting**: ${assets.poster.supportingText}
- **Details**: ${assets.poster.dateOrDetails}
- **CTA**: ${assets.poster.cta}

## 2. Social Post (Feed)
- **Headline**: ${assets.socialPost.headline}
- **Supporting**: ${assets.socialPost.supportingCopy}
- **CTA**: ${assets.socialPost.cta}
- **Caption**:
${assets.socialPost.caption}

## 3. Instagram Story Sequence
${assets.instagramStory.frames.map((f) => `### Frame ${f.frameNumber}: ${f.mainText}\n${f.subText} (Sticker: ${f.stickerOrInteractive})`).join('\n\n')}

## 4. Short Video / Reel Storyboard
**Hook**: "${assets.reel.hook}"
**Duration**: ${assets.reel.totalDurationSeconds}s | **Music**: ${assets.reel.musicSuggestion}
${assets.reel.scenes.map((s) => `### Scene ${s.sceneNumber} (${s.durationSeconds}s): ${s.visualDescription}\nOn-Screen: "${s.onScreenText}"\nVoiceover: "${s.voiceover}"`).join('\n\n')}

## 5. Captions & Hashtags
### Instagram:
${assets.captions.instagramCaption}

### LinkedIn:
${assets.captions.linkedinCaption}

### Hashtags:
${assets.captions.hashtags.primary.join(' ')} ${assets.captions.hashtags.niche.join(' ')}

## 6. Ad Copy Variations
${assets.adCopy.variants.map((v) => `### [${v.framework}] ${v.headline}\n${v.primaryText}\nButton: ${v.ctaButton}`).join('\n\n')}

## 7. Announcement Email
**Subject Lines**:
${assets.email.subjectLines.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}
**Body**:
${assets.email.bodyParagraphs.join('\n\n')}
`;
      zip.file('campaign_overview.md', fullMarkdown);

      // 3. Strategy folder
      const strategyFolder = zip.folder('strategy');
      if (strategyFolder) {
        strategyFolder.file('campaign_strategy.json', JSON.stringify(strategy, null, 2));
        strategyFolder.file(
          'campaign_strategy.md',
          `# Campaign Strategy: ${campaign.name}

## Objective
${strategy.objective}

## Target Audience
${strategy.targetAudience}

## Core Message
"${strategy.coreMessage}"

## Tone & Voice
${strategy.recommendedTone}

## Key Selling Points
${strategy.keySellingPoints.map((k) => `- ${k}`).join('\n')}

## Suggested Call to Action
${strategy.suggestedCta}
`
        );
      }

      // 4. Brand folder
      const brandFolder = zip.folder('brand');
      if (brandFolder) {
        brandFolder.file('brand_kit.json', JSON.stringify(brandKit, null, 2));
        brandFolder.file(
          'brand_guidelines.txt',
          `BRAND GUIDELINES — ${brandKit.brandName}
Tagline: ${brandKit.tagline || 'N/A'}
Primary Color: ${brandKit.primaryColor}
Secondary Color: ${brandKit.secondaryColor}
Accent Color: ${brandKit.accentColor}
Font Pairing: ${brandKit.fontPairing}
Brand Tone: ${brandKit.tone}
`
        );
        if (brandKit.logoUrl) {
          const logoBlob = await fetchImageBlob(brandKit.logoUrl);
          if (logoBlob) {
            brandFolder.file(`logo.${logoBlob.extension}`, logoBlob.data);
          }
        }
      }

      // 5. Copy folder
      const copyFolder = zip.folder('copy');
      if (copyFolder) {
        // Captions & Hashtags
        const captionsText = `==============================
INSTAGRAM CAPTION
==============================
${assets.captions.instagramCaption}

==============================
LINKEDIN CAPTION
==============================
${assets.captions.linkedinCaption}

==============================
TIKTOK / X CAPTION
==============================
${assets.captions.tiktokCaption || assets.captions.xCaption || ''}

==============================
HASHTAG CLUSTERS
==============================
[Primary]
${assets.captions.hashtags.primary.join(' ')}

[Niche]
${assets.captions.hashtags.niche.join(' ')}

[Campaign]
${assets.captions.hashtags.campaign?.join(' ') || ''}
`;
        copyFolder.file('social_captions.txt', captionsText);

        // Ad Copy
        const adCopyText = assets.adCopy.variants
          .map(
            (v, idx) => `==============================
VARIANT #${idx + 1} — [${v.framework}]
==============================
HEADLINE:
${v.headline}

PRIMARY TEXT:
${v.primaryText}

CALL TO ACTION BUTTON:
[${v.ctaButton}]
`
          )
          .join('\n\n');
        copyFolder.file('ad_copy_variants.txt', adCopyText);

        // Email Announcement
        const emailText = `==============================
ANNOUNCEMENT EMAIL DRAFT
==============================
SUBJECT LINE OPTIONS:
${assets.email.subjectLines.map((s, idx) => `  ${idx + 1}. ${s}`).join('\n')}

PREVIEW TEXT:
${assets.email.previewText}

GREETING:
${assets.email.headerGreeting}

BODY:
${assets.email.bodyParagraphs.join('\n\n')}

KEY HIGHLIGHTS:
${assets.email.bulletPoints.map((b) => `  • ${b}`).join('\n')}

CTA BUTTON:
[${assets.email.ctaButton.text}] -> ${assets.email.ctaButton.linkPlaceholder}

PS NOTE:
${assets.email.psNote}
`;
        copyFolder.file('announcement_email.txt', emailText);

        // Instagram Story script
        const storyText = `==============================
INSTAGRAM STORY SEQUENCE (Multi-frame)
==============================
Theme: ${assets.instagramStory.overallTheme}

${assets.instagramStory.frames
  .map(
    (f) => `--- FRAME ${f.frameNumber} ---
Main Text: ${f.mainText}
Sub Text: ${f.subText}
Interactive / Sticker: ${f.stickerOrInteractive}
Call to Action: ${f.cta}
Visual Direction: ${f.visualDirection}
Background Color: ${f.backgroundColor}
`
  )
  .join('\n')}`;
        copyFolder.file('instagram_story_scripts.txt', storyText);
      }

      // 6. Video folder
      const videoFolder = zip.folder('video');
      if (videoFolder) {
        // Reel Storyboard Markdown & JSON
        const reelMd = `# Short Video / Reel Storyboard: ${assets.reel.platform}
**Total Duration**: ${assets.reel.totalDurationSeconds}s
**Aspect Ratio**: ${assets.reel.aspectRatio}
**Mood / Style**: ${assets.reel.mood}
**Music Suggestion**: ${assets.reel.musicSuggestion}
**Opening Hook**: "${assets.reel.hook}"
**Closing CTA**: "${assets.reel.cta}"

## Shot-by-Shot Scene Breakdown
${assets.reel.scenes
  .map(
    (s) => `### Scene ${s.sceneNumber} (${s.durationSeconds}s)
- **Visual Description**: ${s.visualDescription}
- **Camera Movement / Transition**: ${s.cameraOrTransition}
- **On-Screen Text**: "${s.onScreenText}"
- **Voiceover**: "${s.voiceover}"
`
  )
  .join('\n')}
`;
        videoFolder.file('reel_storyboard.md', reelMd);
        videoFolder.file('reel_storyboard.json', JSON.stringify(assets.reel, null, 2));

        // YouTube Short Storyboard
        const ytMd = `# YouTube Short Storyboard
**Total Duration**: ${assets.youtubeShort.totalDurationSeconds}s
**Aspect Ratio**: ${assets.youtubeShort.aspectRatio}
**Hook**: "${assets.youtubeShort.hook}"
**Sound Design**: ${assets.youtubeShort.soundDesign}
**Pinned Comment**: "${assets.youtubeShort.pinnedComment}"
**Closing CTA**: "${assets.youtubeShort.cta}"

## Scene Breakdown
${assets.youtubeShort.scenes
  .map(
    (s) => `### Scene ${s.sceneNumber} (${s.durationSeconds}s)
- **Visual**: ${s.visualDescription}
- **Camera/Transition**: ${s.cameraOrTransition}
- **On-Screen Text**: "${s.onScreenText}"
- **Voiceover**: "${s.voiceover}"
`
  )
  .join('\n')}
`;
        videoFolder.file('youtube_short_storyboard.md', ytMd);
        videoFolder.file('youtube_short_storyboard.json', JSON.stringify(assets.youtubeShort, null, 2));
      }

      // 7. Visuals folder
      const visualsFolder = zip.folder('visuals');
      if (visualsFolder) {
        visualsFolder.file('poster_specifications.json', JSON.stringify(assets.poster, null, 2));
        visualsFolder.file(
          'poster_copy_and_layout.txt',
          `PROMOTIONAL POSTER SPECIFICATIONS
Headline: ${assets.poster.headline}
Subheadline: ${assets.poster.subheadline}
Supporting Text: ${assets.poster.supportingText}
Event/Details: ${assets.poster.dateOrDetails}
Call to Action: ${assets.poster.cta}
Layout Recommendation: ${assets.poster.layoutRecommendation}
Visual Direction: ${assets.poster.visualDirection}
Font Family: ${assets.poster.fontFamily}
Aspect Ratio: ${assets.poster.aspectRatio}
Accent Color: ${assets.poster.accentColor}
Badge: ${assets.poster.badgeText}
`
        );

        visualsFolder.file('social_post_specifications.json', JSON.stringify(assets.socialPost, null, 2));
        visualsFolder.file(
          'social_post_copy.txt',
          `SOCIAL FEED POST SPECIFICATIONS
Title: ${assets.socialPost.title}
Headline: ${assets.socialPost.headline}
Supporting Copy: ${assets.socialPost.supportingCopy}
CTA: ${assets.socialPost.cta}
Caption:
${assets.socialPost.caption}
Visual Concept: ${assets.socialPost.visualConcept}
Layout Style: ${assets.socialPost.layoutStyle}
Aspect Ratio: ${assets.socialPost.aspectRatio}
`
        );

        // Fetch & bundle images if available
        if (assets.poster.imageUrl) {
          const img = await fetchImageBlob(assets.poster.imageUrl);
          if (img) {
            visualsFolder.file(`poster_graphic.${img.extension}`, img.data);
          }
        }

        if (assets.socialPost.imageUrl) {
          const img = await fetchImageBlob(assets.socialPost.imageUrl);
          if (img) {
            visualsFolder.file(`social_feed_graphic.${img.extension}`, img.data);
          }
        }
      }

      // Generate the zip blob and initiate download
      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}-campaign-assets.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      triggerToast('ZIP archive downloaded! All campaign assets packaged successfully.');
    } catch (error) {
      console.error('Failed to export campaign ZIP:', error);
      triggerToast('Export failed. Please check console or try Markdown export.');
    } finally {
      setIsExportingZip(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 max-w-7xl mx-auto w-full relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-neutral-900 border border-lime-400/40 text-neutral-100 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-lime-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToOverview}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-xs text-neutral-400 flex items-center gap-2">
            <span>Campaigns</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-200 font-medium">{brandKit.brandName}</span>
          </div>
        </div>

        {/* Global Campaign Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsToneModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 hover:text-white font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5 text-lime-400" />
            <span>Harmonize Tone</span>
          </button>

          <button
            onClick={exportFullCampaign}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 hover:text-white font-medium flex items-center gap-2 transition-colors cursor-pointer"
            title="Download full campaign text as Markdown"
          >
            <FileText className="w-3.5 h-3.5 text-neutral-400" />
            <span>Export Markdown</span>
          </button>

          <button
            onClick={exportCampaignZip}
            disabled={isExportingZip}
            className="px-3.5 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-lime-400/10 flex items-center gap-2 cursor-pointer active:scale-95"
            title="Download complete campaign package as ZIP archive with images, storyboards, and copy"
          >
            {isExportingZip ? (
              <Loader2 className="w-3.5 h-3.5 text-neutral-950 animate-spin" />
            ) : (
              <FolderArchive className="w-3.5 h-3.5 text-neutral-950" />
            )}
            <span>{isExportingZip ? 'Packaging Assets...' : 'Export Assets (ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* Campaign Header Banner */}
      <div className="p-6 rounded-2xl bg-[#10121a] border border-neutral-800/80 shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-display font-bold text-white tracking-tight">
                {campaign.name}
              </h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                8 Coordinated Assets
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-3xl leading-relaxed">
              <strong className="text-neutral-300">Prompt:</strong> “{campaign.prompt}”
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowStrategyDrawer(!showStrategyDrawer)}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-lime-400" />
              <span>{showStrategyDrawer ? 'Hide Strategy' : 'View Strategy'}</span>
            </button>

            <button
              onClick={exportCampaignZip}
              disabled={isExportingZip}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-lime-400/30 hover:border-lime-400/60 text-xs text-lime-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download structured ZIP package"
            >
              {isExportingZip ? (
                <Loader2 className="w-3.5 h-3.5 text-lime-400 animate-spin" />
              ) : (
                <FolderArchive className="w-3.5 h-3.5 text-lime-400" />
              )}
              <span>{isExportingZip ? 'Packaging ZIP...' : 'Download ZIP Bundle'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Campaign Strategy Section (Section 3 of requirements) */}
        {showStrategyDrawer && (
          <div className="mt-6 pt-6 border-t border-neutral-800/80 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                Objective & Audience
              </div>
              <div className="text-neutral-200 font-medium">{strategy.objective}</div>
              <div className="text-neutral-400">{strategy.targetAudience}</div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                Core Message & Tone
              </div>
              <div className="text-neutral-200 font-medium">“{strategy.coreMessage}”</div>
              <div className="text-lime-300 font-mono text-[11px]">Tone: {strategy.recommendedTone}</div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                Key Selling Points
              </div>
              <ul className="space-y-1 text-neutral-300">
                {strategy.keySellingPoints.slice(0, 3).map((pt, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-lime-400 shrink-0" />
                    <span className="truncate">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Asset Category Segmented Tabs */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Assets (8)' },
            { id: 'visuals', label: 'Visuals & Stories (3)' },
            { id: 'videos', label: 'Reels & Shorts (2)' },
            { id: 'copy', label: 'Captions & Emails (3)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabCategory)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-lime-400 text-neutral-950 shadow-xs'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-neutral-400 hidden sm:block">
          Every asset belongs to the same coordinated identity
        </div>
      </div>

      {/* Connected Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {/* ASSET 1: Promotional Poster */}
        {(activeTab === 'all' || activeTab === 'visuals') && (
          <div className="p-5 rounded-2xl bg-[#0f1118] border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-mono text-[11px] text-lime-400 uppercase tracking-wider">
                  Poster · 3:4
                </span>
                <span className="text-[11px] text-neutral-400">Print & Window</span>
              </div>

              {/* Poster Visual Preview */}
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 p-5 flex flex-col justify-between group">
                {assets.poster.imageUrl ? (
                  <img
                    src={assets.poster.imageUrl}
                    alt={assets.poster.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black" />
                )}

                <div className="relative z-10">
                  <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-lime-400 text-neutral-950 font-bold uppercase">
                    {assets.poster.badgeText || 'ANNOUNCEMENT'}
                  </span>
                </div>

                <div className="relative z-10 text-white space-y-1">
                  <div className="text-[10px] font-mono tracking-widest text-lime-300 uppercase">
                    {assets.poster.subheadline}
                  </div>
                  <h3 className="text-xl font-display font-extrabold leading-tight text-white line-clamp-2">
                    {assets.poster.headline}
                  </h3>
                  <p className="text-[11px] text-neutral-300 line-clamp-2 mt-1">
                    {assets.poster.supportingText}
                  </p>
                  <div className="pt-2 text-[10px] font-mono text-neutral-400 border-t border-neutral-700/60 truncate">
                    {assets.poster.dateOrDetails}
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-neutral-400">
                <strong className="text-neutral-200">Concept:</strong> {assets.poster.posterConcept}
              </div>
            </div>

            {/* Asset Actions */}
            <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-1.5">
              <button
                onClick={() => onOpenVisualEditor('poster')}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-lime-400" />
                <span>Visual Editor</span>
              </button>

              <button
                onClick={() => onOpenAiEditModal('poster', assets.poster)}
                title="Regenerate with AI instructions"
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-lime-400 transition-colors cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDuplicateAsset('poster')}
                title="Duplicate Asset"
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ASSET 2: Social Post (Instagram Feed) */}
        {(activeTab === 'all' || activeTab === 'visuals') && (
          <div className="p-5 rounded-2xl bg-[#0f1118] border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-mono text-[11px] text-lime-400 uppercase tracking-wider">
                  Social Post · 1:1
                </span>
                <span className="text-[11px] text-neutral-400">Feed Drop</span>
              </div>

              {/* Social Graphic Preview */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 p-5 flex flex-col justify-between group">
                {assets.socialPost.imageUrl ? (
                  <img
                    src={assets.socialPost.imageUrl}
                    alt={assets.socialPost.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />
                )}

                <div className="relative z-10 flex justify-between items-start">
                  <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-neutral-900/90 border border-neutral-700 text-lime-400 font-bold uppercase">
                    {brandKit.brandName}
                  </span>
                </div>

                <div className="relative z-10 text-white space-y-1">
                  <h3 className="text-lg font-display font-bold leading-tight text-white line-clamp-2">
                    {assets.socialPost.headline}
                  </h3>
                  <p className="text-[11px] text-neutral-300 line-clamp-2 mt-1">
                    {assets.socialPost.supportingCopy}
                  </p>
                  <div className="pt-2 text-[10px] font-mono text-lime-300 truncate">
                    → {assets.socialPost.cta}
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-neutral-400 line-clamp-2">
                <strong className="text-neutral-200">Caption snippet:</strong> {assets.socialPost.caption}
              </div>
            </div>

            {/* Asset Actions */}
            <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-1.5">
              <button
                onClick={() => onOpenVisualEditor('social_post')}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-lime-400" />
                <span>Visual Editor</span>
              </button>

              <button
                onClick={() => copyToClipboard(assets.socialPost.caption, 'sp-cap', 'Feed Caption')}
                title="Copy Caption"
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenAiEditModal('socialPost', assets.socialPost)}
                title="Regenerate with AI instructions"
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-lime-400 transition-colors cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ASSET 3: Instagram Story Sequence */}
        {(activeTab === 'all' || activeTab === 'visuals') && (
          <div className="p-5 rounded-2xl bg-[#0f1118] border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-mono text-[11px] text-lime-400 uppercase tracking-wider">
                  Instagram Story · Multi-Frame
                </span>
                <span className="text-[11px] text-neutral-400">
                  {assets.instagramStory.frames.length} Frames
                </span>
              </div>

              {/* Multi-Frame List */}
              <div className="space-y-2 mb-3">
                {assets.instagramStory.frames.map((frame) => (
                  <div
                    key={frame.id}
                    className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                      <span className="text-lime-400 font-bold">FRAME 0{frame.frameNumber}</span>
                      <span>{frame.stickerOrInteractive}</span>
                    </div>
                    <div className="font-semibold text-neutral-200">{frame.mainText}</div>
                    <div className="text-[11px] text-neutral-400 line-clamp-1">{frame.subText}</div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-neutral-400">
                <strong className="text-neutral-200">Theme:</strong> {assets.instagramStory.overallTheme}
              </div>
            </div>

            {/* Asset Actions */}
            <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-1.5">
              <button
                onClick={() =>
                  copyToClipboard(
                    assets.instagramStory.frames
                      .map((f) => `Frame ${f.frameNumber}: ${f.mainText} - ${f.subText} (Sticker: ${f.stickerOrInteractive})`)
                      .join('\n'),
                    'story-copy',
                    'Story Script'
                  )
                }
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-lime-400" />
                <span>Copy Story Flow</span>
              </button>

              <button
                onClick={() => onOpenAiEditModal('instagramStory', assets.instagramStory)}
                title="Regenerate with AI instructions"
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-lime-400 transition-colors cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ASSET 4: Short Video / Reel Storyboard */}
        {(activeTab === 'all' || activeTab === 'videos') && (
          <div className="p-5 rounded-2xl bg-[#0f1118] border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-mono text-[11px] text-lime-400 uppercase tracking-wider">
                  Short Video / Reel
                </span>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {assets.reel.totalDurationSeconds}s · 9:16
                </span>
              </div>

              {/* Reel Hook Card */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 mb-3">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">Opening Hook</div>
                <div className="text-xs font-semibold text-lime-300 mt-1 italic">
                  "{assets.reel.hook}"
                </div>
              </div>

              {/* Storyboard scenes preview */}
              <div className="space-y-1.5">
                {assets.reel.scenes.slice(0, 3).map((scene) => (
                  <div
                    key={scene.id}
                    className="p-2.5 rounded-lg bg-neutral-950/40 border border-neutral-800/50 text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] text-lime-400">0{scene.sceneNumber}</span>
                      <span className="truncate text-neutral-300">{scene.onScreenText}</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                      {scene.durationSeconds}s
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 text-[11px] text-neutral-400 flex items-center justify-between">
                <span>Music: {assets.reel.musicSuggestion.slice(0, 28)}...</span>
              </div>
            </div>

            {/* Asset Actions */}
            <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-1.5">
              <button
                onClick={() => onOpenVideoStudio('reel')}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-lime-400/10"
              >
                <Play className="w-3.5 h-3.5 fill-neutral-950" />
                <span>Video Studio & Player</span>
              </button>

              <button
                onClick={() => onOpenAiEditModal('reel', assets.reel)}
                title="Regenerate with AI instructions"
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-lime-400 transition-colors cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ASSET 5: YouTube Short Package */}
        {(activeTab === 'all' || activeTab === 'videos') && (
          <div className="p-5 rounded-2xl bg-[#0f1118] border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-mono text-[11px] text-lime-400 uppercase tracking-wider">
                  YouTube Short
                </span>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {assets.youtubeShort.totalDurationSeconds}s · 9:16
                </span>
              </div>

              {/* Short Hook & Sound */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 mb-3 space-y-1.5">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">Algorithm Hook</div>
                <div className="text-xs font-semibold text-white">"{assets.youtubeShort.hook}"</div>
                <div className="text-[11px] text-neutral-400">
                  <strong className="text-neutral-300">Sound:</strong> {assets.youtubeShort.soundDesign}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950/40 border border-neutral-800/60 text-xs">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">Pinned Comment Idea</div>
                <div className="text-[11px] text-lime-300 mt-1 line-clamp-2">
                  {assets.youtubeShort.pinnedComment}
                </div>
              </div>
            </div>

            {/* Asset Actions */}
            <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-1.5">
              <button
                onClick={() => onOpenVideoStudio('youtubeShort')}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-lime-400 fill-lime-400" />
                <span>Inspect Storyboard</span>
              </button>

              <button
                onClick={() => onOpenAiEditModal('youtubeShort', assets.youtubeShort)}
                title="Regenerate with AI instructions"
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-lime-400 transition-colors cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ASSET 6: Platform Captions & Hashtags */}
        {(activeTab === 'all' || activeTab === 'copy') && (
          <div className="p-5 rounded-2xl bg-[#0f1118] border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-mono text-[11px] text-lime-400 uppercase tracking-wider">
                  Captions & Hashtags
                </span>
                <span className="text-[11px] text-neutral-400">Multi-Platform</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1">
                    <span>INSTAGRAM</span>
                    <button
                      onClick={() =>
                        copyToClipboard(assets.captions.instagramCaption, 'cap-ig', 'Instagram Caption')
                      }
                      className="text-lime-400 hover:underline cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-300 line-clamp-3">
                    {assets.captions.instagramCaption}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1">
                    <span>LINKEDIN</span>
                    <button
                      onClick={() =>
                        copyToClipboard(assets.captions.linkedinCaption, 'cap-li', 'LinkedIn Caption')
                      }
                      className="text-lime-400 hover:underline cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-300 line-clamp-2">
                    {assets.captions.linkedinCaption}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs">
                  <div className="text-[10px] font-mono text-neutral-400 mb-1">HASHTAG CLUSTERS</div>
                  <div className="flex flex-wrap gap-1 text-[10px] font-mono text-lime-300">
                    {assets.captions.hashtags.primary.slice(0, 4).map((h, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Asset Actions */}
            <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-1.5">
              <button
                onClick={() =>
                  copyToClipboard(
                    `${assets.captions.instagramCaption}\n\n${assets.captions.hashtags.primary.join(' ')} ${assets.captions.hashtags.niche.join(' ')}`,
                    'cap-all',
                    'Caption & Tags'
                  )
                }
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-lime-400" />
                <span>Copy All Captions</span>
              </button>

              <button
                onClick={() => onOpenAiEditModal('captions', assets.captions)}
                title="Regenerate with AI instructions"
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-lime-400 transition-colors cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ASSET 7: Ad Copy Variants */}
        {(activeTab === 'all' || activeTab === 'copy') && (
          <div className="p-5 rounded-2xl bg-[#0f1118] border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-mono text-[11px] text-lime-400 uppercase tracking-wider">
                  Ad Copy · 3 Frameworks
                </span>
                <span className="text-[11px] text-neutral-400">Paid Media</span>
              </div>

              <div className="space-y-2.5">
                {assets.adCopy.variants.map((v) => (
                  <div
                    key={v.id}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                      <span className="text-lime-400 uppercase">{v.framework}</span>
                      <button
                        onClick={() =>
                          copyToClipboard(`${v.headline}\n${v.primaryText}\nCTA: ${v.ctaButton}`, v.id, 'Ad Copy')
                        }
                        className="hover:text-white cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="font-semibold text-white">{v.headline}</div>
                    <div className="text-[11px] text-neutral-400 line-clamp-2">{v.primaryText}</div>
                    <div className="pt-1 text-[10px] font-mono text-lime-300">
                      Button: [{v.ctaButton}]
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Asset Actions */}
            <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-1.5">
              <button
                onClick={() =>
                  copyToClipboard(
                    assets.adCopy.variants.map((v) => `[${v.framework}]\n${v.headline}\n${v.primaryText}\nCTA: ${v.ctaButton}`).join('\n\n'),
                    'ads-all',
                    'All Ad Variants'
                  )
                }
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-lime-400" />
                <span>Copy All Variants</span>
              </button>

              <button
                onClick={() => onOpenAiEditModal('adCopy', assets.adCopy)}
                title="Regenerate with AI instructions"
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-lime-400 transition-colors cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ASSET 8: Launch Announcement Email */}
        {(activeTab === 'all' || activeTab === 'copy') && (
          <div className="p-5 rounded-2xl bg-[#0f1118] border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-mono text-[11px] text-lime-400 uppercase tracking-wider">
                  Email Announcement
                </span>
                <span className="text-[11px] text-neutral-400">Newsletter</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs space-y-2 mb-3">
                <div>
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">Subject Line (A/B)</div>
                  <div className="font-semibold text-lime-300 mt-0.5">
                    {assets.email.subjectLines[0]}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-300 line-clamp-3">
                  {assets.email.bodyParagraphs[0]}
                </div>

                <div className="pt-1 text-[10px] font-mono text-neutral-400">
                  CTA Button: [{assets.email.ctaButton.text}]
                </div>
              </div>

              <div className="text-xs text-neutral-400">
                <strong className="text-neutral-200">Bullet points included:</strong>{' '}
                {assets.email.bulletPoints.length} launch highlights
              </div>
            </div>

            {/* Asset Actions */}
            <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-1.5">
              <button
                onClick={() =>
                  copyToClipboard(
                    `Subject: ${assets.email.subjectLines[0]}\nPreview: ${assets.email.previewText}\n\n${assets.email.bodyParagraphs.join('\n\n')}\n\nHighlights:\n${assets.email.bulletPoints.join('\n')}\n\nCTA: ${assets.email.ctaButton.text} (${assets.email.ctaButton.linkPlaceholder})\n\n${assets.email.psNote}`,
                    'email-all',
                    'Full Email Copy'
                  )
                }
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-lime-400" />
                <span>Copy Full Email</span>
              </button>

              <button
                onClick={() => onOpenAiEditModal('email', assets.email)}
                title="Regenerate with AI instructions"
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-lime-400 transition-colors cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Campaign Memory / Harmonize Tone Modal */}
      {isToneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0e1017] border border-neutral-800 p-6 shadow-2xl space-y-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-lime-400">
                Campaign Memory
              </div>
              <h3 className="text-lg font-bold text-white mt-1">Harmonize Campaign Tone</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Tell AI how to adjust the tone, and it will update the headlines, CTAs, and hooks consistently across your connected assets.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                New Desired Tone or Style
              </label>
              <input
                type="text"
                value={newToneInput}
                onChange={(e) => setNewToneInput(e.target.value)}
                placeholder="e.g. Change tone to high-energy Gen Z, or Make it ultra-luxurious and minimal"
                className="w-full px-3 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-lime-400 outline-none"
              />

              <div className="mt-2 flex flex-wrap gap-1.5">
                {['Make it Gen Z', 'Make it ultra-premium', 'Make it academic', 'Stronger urgency / FOMO'].map(
                  (chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setNewToneInput(chip)}
                      className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 text-[10px] cursor-pointer"
                    >
                      {chip}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsToneModalOpen(false)}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!newToneInput.trim() || isApplyingTone}
                onClick={handleApplyToneChange}
                className="px-4 py-2 rounded-lg bg-lime-400 hover:bg-lime-300 text-neutral-950 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                {isApplyingTone ? 'Harmonizing...' : 'Apply Across Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
