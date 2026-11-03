import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Wand2,
  Layers,
  ArrowRight,
  Palette,
  Check,
  Upload,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { BrandKit, Campaign } from '../types/campaign';
import { extractCampaignDetails, generateCampaignPackage } from '../services/apiClient';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandKit: BrandKit;
  onCampaignCreated: (newCampaign: Campaign) => void;
  initialPrompt?: string;
}

const OBJECTIVE_OPTIONS = [
  'Grand Opening & Foot Traffic',
  'Brand Awareness & Buzz',
  'Product / Service Launch',
  'Lead Generation & Inquiries',
  'Course / Event Registrations',
  'Flash Sale & Community Offer',
];

const TONE_OPTIONS = [
  'Modern, playful & warm',
  'Bold, disruptive & high-energy',
  'Premium, elegant & minimal',
  'Authoritative & academic',
  'Gen Z, witty & culturally savvy',
  'Inspiring & community-driven',
];

const PLATFORM_OPTIONS = [
  'Instagram Feed',
  'Instagram Story',
  'Reels & TikTok',
  'YouTube Shorts',
  'Print / Window Poster',
  'Email Announcement',
  'LinkedIn',
  'X (Twitter)',
];

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  brandKit,
  onCampaignCreated,
  initialPrompt = '',
}) => {
  const [nlPrompt, setNlPrompt] = useState(initialPrompt);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // Form Fields
  const [name, setName] = useState('');
  const [whatPromoting, setWhatPromoting] = useState('');
  const [brandName, setBrandName] = useState(brandKit.brandName || '');
  const [targetAudience, setTargetAudience] = useState('');
  const [objective, setObjective] = useState(OBJECTIVE_OPTIONS[0]);
  const [tone, setTone] = useState(brandKit.tone || TONE_OPTIONS[0]);
  const [primaryColor, setPrimaryColor] = useState(brandKit.primaryColor || '#090a0f');
  const [accentColor, setAccentColor] = useState(brandKit.accentColor || '#bef264');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'Instagram Feed',
    'Instagram Story',
    'Reels & TikTok',
    'Print / Window Poster',
    'Email Announcement',
  ]);
  const [logoText, setLogoText] = useState(brandKit.logoText || brandKit.brandName || '');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  // Sync initialPrompt if provided
  React.useEffect(() => {
    if (initialPrompt) {
      setNlPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  if (!isOpen) return null;

  const handleExtractWithAi = async () => {
    if (!nlPrompt.trim()) return;
    setIsExtracting(true);
    try {
      const extracted = await extractCampaignDetails(nlPrompt.trim());
      if (extracted.name) setName(extracted.name);
      if (extracted.whatPromoting) setWhatPromoting(extracted.whatPromoting);
      if (extracted.brandName) {
        setBrandName(extracted.brandName);
        setLogoText(extracted.brandName);
      }
      if (extracted.targetAudience) setTargetAudience(extracted.targetAudience);
      if (extracted.objective) {
        const found = OBJECTIVE_OPTIONS.find((o) =>
          o.toLowerCase().includes(extracted.objective.toLowerCase().slice(0, 5))
        );
        if (found) setObjective(found);
      }
      if (extracted.tone) setTone(extracted.tone);
      if (extracted.suggestedPrimaryColor) setPrimaryColor(extracted.suggestedPrimaryColor);
      if (extracted.suggestedSecondaryColor) setAccentColor(extracted.suggestedSecondaryColor);
    } catch (err) {
      console.warn('Extraction fallback handled', err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleTogglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartGeneration = async () => {
    const activePrompt = nlPrompt.trim() || whatPromoting.trim() || `${brandName} ${objective}`;
    setIsGenerating(true);
    setGenerationStep(0);

    const steps = [
      'Extracting campaign essence & target psychology...',
      'Synthesizing cross-channel creative strategy...',
      'Composing promotional poster & visual graphics...',
      'Crafting multi-frame Instagram stories...',
      'Storyboarding short-form Reel & YouTube Short...',
      'Tailoring platform captions, hashtags & ad copy...',
      'Drafting launch announcement email...',
      'Harmonizing brand voice across all assets...',
    ];

    // Progress tick simulation
    const interval = setInterval(() => {
      setGenerationStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const generated = await generateCampaignPackage({
        prompt: activePrompt,
        name: name || `${brandName || 'New'} Campaign`,
        whatPromoting: whatPromoting || activePrompt,
        brandName: brandName || 'Brand',
        targetAudience: targetAudience || 'Modern audience',
        objective,
        tone,
        brandKit: {
          ...brandKit,
          brandName: brandName || brandKit.brandName,
          primaryColor,
          accentColor,
          tone,
          logoText,
        },
        platforms: selectedPlatforms,
      });

      clearInterval(interval);

      // Create full Campaign object
      const finalCampaign: Campaign = {
        id: `campaign-${Date.now()}`,
        name: name || `${brandName || 'Brand'} Launch Campaign`,
        prompt: activePrompt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'ready',
        thumbnailUrl: uploadedImagePreview || '/src/assets/images/studio_creative_desk_1793543143344.jpg',
        brandKit: {
          ...brandKit,
          brandName: brandName || brandKit.brandName,
          primaryColor,
          accentColor,
          tone,
          logoText,
        },
        strategy: generated.strategy,
        assets: {
          ...generated.assets,
          // Attach uploaded image to poster or social post if user provided one
          ...(uploadedImagePreview && {
            poster: {
              ...generated.assets.poster,
              imageUrl: uploadedImagePreview,
            },
            socialPost: {
              ...generated.assets.socialPost,
              imageUrl: uploadedImagePreview,
            },
          }),
        },
      };

      onCampaignCreated(finalCampaign);
      onClose();
    } catch (err) {
      clearInterval(interval);
      console.error('Campaign generation failed:', err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-2xl bg-[#0e1017] border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800/80 flex items-center justify-between shrink-0">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-lime-400">
              Coordinated Campaign Builder
            </div>
            <h2 className="text-xl font-display font-bold text-white tracking-tight mt-0.5">
              Create a Campaign
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isGenerating ? (
          /* Generation Experience Screen */
          <div className="p-10 flex flex-col items-center justify-center text-center my-auto space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-lime-400 animate-spin" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-lime-400 animate-ping" />
            </div>

            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-lime-400 mb-2">
                Coordinating Multi-Channel Campaign
              </div>
              <h3 className="text-xl font-display font-bold text-white">
                Building {brandName || 'your'} campaign package...
              </h3>
              <p className="mt-2 text-sm text-neutral-400 max-w-md mx-auto">
                The AI is orchestrating branding, visual design, storyboards, copy, and captions so everything feels connected.
              </p>
            </div>

            {/* Checkpoint list */}
            <div className="w-full max-w-md space-y-2 text-left pt-4">
              {[
                'Analyzing audience psychology & hooks',
                'Composing synchronized visual direction',
                'Generating video & Reel storyboard sequence',
                'Formatting multi-platform captions & ad variants',
              ].map((label, idx) => (
                <div
                  key={label}
                  className={`flex items-center gap-2.5 text-xs px-3.5 py-2 rounded-lg border transition-all ${
                    idx <= generationStep / 2
                      ? 'bg-lime-400/10 border-lime-400/30 text-lime-200'
                      : 'bg-neutral-900/40 border-neutral-800 text-neutral-500'
                  }`}
                >
                  {idx <= generationStep / 2 ? (
                    <Check className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-neutral-700 shrink-0" />
                  )}
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Guided & Natural Language Form */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Step 1: Natural Language Quick Input */}
            <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center justify-between text-xs mb-2">
                <label className="font-semibold text-neutral-200 flex items-center gap-2">
                  <Wand2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>Describe your idea in your own words</span>
                </label>
                <button
                  type="button"
                  onClick={handleExtractWithAi}
                  disabled={isExtracting || !nlPrompt.trim()}
                  className="text-xs font-semibold text-lime-400 hover:text-lime-300 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Extracting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" />
                      <span>Auto-fill details with AI</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                rows={3}
                value={nlPrompt}
                onChange={(e) => setNlPrompt(e.target.value)}
                placeholder="e.g. I want to promote my new tutoring centre called Apex Scholars for Class 10 students before upcoming board exams. High-impact revision, mock tests, and top rank mentors."
                className="w-full p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none resize-none font-sans"
              />
              <div className="mt-2 text-[11px] text-neutral-500">
                You can write anything here, and AI will extract the brand, audience, and campaign parameters for you.
              </div>
            </div>

            {/* Guided Detailed Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Campaign / Project Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Moon Brew Grand Opening"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-lime-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Business / Brand Name
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => {
                    setBrandName(e.target.value);
                    if (!logoText) setLogoText(e.target.value);
                  }}
                  placeholder="e.g. Moon Brew"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-lime-400 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  What are you promoting?
                </label>
                <input
                  type="text"
                  value={whatPromoting}
                  onChange={(e) => setWhatPromoting(e.target.value)}
                  placeholder="e.g. Grand opening of nocturnal café with cold brew"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-lime-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. College students, night owls & remote workers"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-lime-400 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Campaign Objective
                </label>
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                >
                  {OBJECTIVE_OPTIONS.map((obj) => (
                    <option key={obj} value={obj}>
                      {obj}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Preferred Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                >
                  {TONE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Brand Colors & Visual Identity */}
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-3">
              <div className="text-xs font-semibold text-neutral-200 flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-lime-400" />
                <span>Brand Colors & Visual Identity</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border border-neutral-700 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-medium text-neutral-300">Primary Color</div>
                    <div className="text-[11px] font-mono text-neutral-500">{primaryColor}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border border-neutral-700 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-medium text-neutral-300">Accent Color</div>
                    <div className="text-[11px] font-mono text-neutral-500">{accentColor}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Target Platforms */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-2">
                Target Platform(s)
              </label>
              <div className="flex flex-wrap gap-2">
                {PLATFORM_OPTIONS.map((plat) => {
                  const isSelected = selectedPlatforms.includes(plat);
                  return (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => handleTogglePlatform(plat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-lime-400 text-neutral-950 font-semibold'
                          : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-neutral-950" />}
                      <span>{plat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Image Upload */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Optional Product / Key Visual Upload
              </label>
              <div className="flex items-center gap-4">
                <label className="px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-300 flex items-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Select Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {uploadedImagePreview && (
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                    <img
                      src={uploadedImagePreview}
                      alt="Uploaded preview"
                      className="w-7 h-7 rounded object-cover border border-emerald-500/40"
                    />
                    <span>Image attached</span>
                    <button
                      type="button"
                      onClick={() => setUploadedImagePreview(null)}
                      className="text-neutral-500 hover:text-red-400 ml-1 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        {!isGenerating && (
          <div className="p-5 border-t border-neutral-800/80 bg-neutral-950/60 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleStartGeneration}
              className="px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold text-xs tracking-wide transition-all shadow-md shadow-lime-400/10 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
              <span>Generate Entire Campaign</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
