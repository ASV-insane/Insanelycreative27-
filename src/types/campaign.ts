export interface BrandKit {
  brandName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontPairing: 'modern-sans' | 'editorial-serif' | 'bold-condensed' | 'minimal-mono';
  tone: string;
  logoUrl?: string;
  logoText?: string;
  valueProps?: string[];
}

export interface CampaignStrategy {
  objective: string;
  targetAudience: string;
  coreMessage: string;
  recommendedTone: string;
  keySellingPoints: string[];
  suggestedCta: string;
}

export interface SocialPostAsset {
  id: string;
  type: 'social_post';
  title: string;
  visualConcept: string;
  headline: string;
  supportingCopy: string;
  cta: string;
  caption: string;
  layoutStyle: 'bold_centered' | 'editorial_split' | 'minimal_accent' | 'card_elevated';
  aspectRatio: '1:1' | '4:5' | '16:9';
  imageUrl?: string;
  badgeText?: string;
}

export interface PosterAsset {
  id: string;
  type: 'poster';
  title: string;
  posterConcept: string;
  headline: string;
  subheadline: string;
  supportingText: string;
  dateOrDetails: string;
  cta: string;
  layoutRecommendation: string;
  visualDirection: string;
  accentColor: string;
  badgeText: string;
  imageUrl?: string;
  fontFamily: 'Outfit' | 'Plus Jakarta Sans' | 'serif' | 'monospace';
  aspectRatio: '3:4' | '1:1' | '9:16';
}

export interface StoryFrame {
  id: string;
  frameNumber: number;
  visualDirection: string;
  mainText: string;
  subText: string;
  stickerOrInteractive: string;
  cta: string;
  backgroundColor: string;
}

export interface InstagramStoryAsset {
  id: string;
  type: 'instagram_story';
  title: string;
  overallTheme: string;
  frames: StoryFrame[];
}

export interface VideoScene {
  id: string;
  sceneNumber: number;
  visualDescription: string;
  onScreenText: string;
  voiceover: string;
  durationSeconds: number;
  cameraOrTransition: string;
  imageUrl?: string;
}

export interface ShortVideoAsset {
  id: string;
  type: 'short_video';
  platform: 'Instagram Reel' | 'TikTok';
  hook: string;
  scenes: VideoScene[];
  musicSuggestion: string;
  mood: string;
  cta: string;
  totalDurationSeconds: number;
  aspectRatio: '9:16' | '1:1' | '16:9';
}

export interface YouTubeShortAsset {
  id: string;
  type: 'youtube_short';
  hook: string;
  scenes: VideoScene[];
  soundDesign: string;
  pinnedComment: string;
  cta: string;
  totalDurationSeconds: number;
  aspectRatio: '9:16' | '16:9';
}

export interface CaptionHashtagsAsset {
  id: string;
  type: 'caption_hashtags';
  instagramCaption: string;
  linkedinCaption: string;
  tiktokCaption: string;
  xCaption: string;
  hashtags: {
    primary: string[];
    niche: string[];
    campaign: string[];
  };
}

export interface AdVariant {
  id: string;
  framework: 'Problem-Agitate-Solve' | 'Benefit-Driven' | 'Urgency / FOMO' | 'Curiosity Hook';
  headline: string;
  primaryText: string;
  ctaButton: string;
}

export interface AdCopyAsset {
  id: string;
  type: 'ad_copy';
  variants: AdVariant[];
}

export interface EmailAnnouncementAsset {
  id: string;
  type: 'email_announcement';
  subjectLines: string[];
  previewText: string;
  headerGreeting: string;
  bodyParagraphs: string[];
  bulletPoints: string[];
  ctaButton: { text: string; linkPlaceholder: string };
  psNote: string;
}

export interface CampaignAssets {
  socialPost: SocialPostAsset;
  poster: PosterAsset;
  instagramStory: InstagramStoryAsset;
  reel: ShortVideoAsset;
  youtubeShort: YouTubeShortAsset;
  captions: CaptionHashtagsAsset;
  adCopy: AdCopyAsset;
  email: EmailAnnouncementAsset;
}

export interface Campaign {
  id: string;
  name: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'ready' | 'active';
  thumbnailUrl?: string;
  strategy: CampaignStrategy;
  brandKit: BrandKit;
  assets: CampaignAssets;
}

export interface CampaignExtractResult {
  name: string;
  whatPromoting: string;
  brandName: string;
  targetAudience: string;
  objective: string;
  tone: string;
  suggestedPrimaryColor: string;
  suggestedSecondaryColor: string;
  platforms: string[];
}
