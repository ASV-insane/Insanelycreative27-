import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Download,
  RotateCcw,
  RotateCw,
  Type,
  Image as ImageIcon,
  Palette,
  Maximize2,
  Sliders,
  Check,
  Wand2,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { PosterAsset, SocialPostAsset, BrandKit } from '../types/campaign';
import { editAssetWithAi } from '../services/apiClient';

interface VisualEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetType: 'poster' | 'social_post';
  asset: PosterAsset | SocialPostAsset;
  brandKit: BrandKit;
  onSave: (updatedAsset: any) => void;
}

export const VisualEditorModal: React.FC<VisualEditorModalProps> = ({
  isOpen,
  onClose,
  assetType,
  asset,
  brandKit,
  onSave,
}) => {
  if (!isOpen) return null;

  // Editable canvas fields
  const isPoster = assetType === 'poster';
  const posterAsset = asset as PosterAsset;
  const socialAsset = asset as SocialPostAsset;

  const [headline, setHeadline] = useState(
    isPoster ? posterAsset.headline : socialAsset.headline
  );
  const [subheadline, setSubheadline] = useState(
    isPoster ? posterAsset.subheadline || 'SPECIAL ANNOUNCEMENT' : socialAsset.title
  );
  const [supportingText, setSupportingText] = useState(
    isPoster ? posterAsset.supportingText : socialAsset.supportingCopy
  );
  const [dateOrDetails, setDateOrDetails] = useState(
    isPoster ? posterAsset.dateOrDetails : 'AVAILABLE NOW · LIMITED ACCESS'
  );
  const [ctaText, setCtaText] = useState(
    isPoster ? posterAsset.cta : socialAsset.cta
  );
  const [badgeText, setBadgeText] = useState(
    isPoster ? posterAsset.badgeText || 'GRAND LAUNCH' : socialAsset.badgeText || brandKit.brandName
  );
  const [aspectRatio, setAspectRatio] = useState<'3:4' | '1:1' | '9:16'>(
    isPoster ? '3:4' : '1:1'
  );
  const [fontFamily, setFontFamily] = useState<'Outfit' | 'Plus Jakarta Sans' | 'Georgia' | 'Courier New'>('Outfit');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [primaryBgColor, setPrimaryBgColor] = useState(brandKit.primaryColor || '#090a0f');
  const [accentColor, setAccentColor] = useState(brandKit.accentColor || '#bef264');
  const [bgStyle, setBgStyle] = useState<'image' | 'gradient' | 'minimal' | 'solid'>('image');
  const [currentImage, setCurrentImage] = useState<string>(
    asset.imageUrl || '/src/assets/images/moon_brew_poster_visual_1793543144586.jpg'
  );
  const [showLogo, setShowLogo] = useState(true);
  const [logoText, setLogoText] = useState(brandKit.logoText || brandKit.brandName || 'STUDIO 27');

  // Undo / Redo history
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // AI Polish prompt
  const [aiInstruction, setAiInstruction] = useState('');
  const [isAiPolishing, setIsAiPolishing] = useState(false);

  // Hidden canvas for download
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Record history snapshot
  const pushState = (snapshot: any) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(snapshot);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHeadline(prev.headline);
      setSubheadline(prev.subheadline);
      setCtaText(prev.ctaText);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHeadline(next.headline);
      setSubheadline(next.subheadline);
      setCtaText(next.ctaText);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleAiPolish = async (instruction: string) => {
    setIsAiPolishing(true);
    try {
      const updated = await editAssetWithAi({
        assetType,
        currentAsset: {
          ...asset,
          headline,
          subheadline,
          supportingText,
          cta: ctaText,
        },
        instruction,
        brandKit,
      });

      if (updated) {
        if (updated.headline) setHeadline(updated.headline);
        if (updated.subheadline) setSubheadline(updated.subheadline);
        if (updated.supportingText) setSupportingText(updated.supportingText);
        if (updated.cta) setCtaText(updated.cta);
        pushState({
          headline: updated.headline || headline,
          subheadline: updated.subheadline || subheadline,
          ctaText: updated.cta || ctaText,
        });
      }
    } finally {
      setIsAiPolishing(false);
      setAiInstruction('');
    }
  };

  // High-Res Canvas Exporter (Native HTML5 Canvas rendering)
  const handleDownloadPng = () => {
    const canvas = document.createElement('canvas');
    let width = 1200;
    let height = 1600; // 3:4 default
    if (aspectRatio === '1:1') {
      height = 1200;
    } else if (aspectRatio === '9:16') {
      height = 2133;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background
    const drawContent = () => {
      // Background gradient or color
      ctx.fillStyle = primaryBgColor;
      ctx.fillRect(0, 0, width, height);

      // Gradient overlay
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(0,0,0,0.4)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.6)');
      grad.addColorStop(1, 'rgba(0,0,0,0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Accent border
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 12;
      ctx.strokeRect(32, 32, width - 64, height - 64);

      // Top Badge
      ctx.fillStyle = accentColor;
      ctx.fillRect(64, 64, 280, 48);
      ctx.fillStyle = '#0a0a0f';
      ctx.font = 'bold 20px Outfit, sans-serif';
      ctx.fillText(badgeText.toUpperCase(), 84, 96);

      // Top Right Logo
      if (showLogo) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(logoText.toUpperCase(), width - 74, 96);
      }

      // Main Text Area
      ctx.textAlign = alignment;
      const xAnchor = alignment === 'left' ? 74 : alignment === 'center' ? width / 2 : width - 74;

      // Subheadline
      ctx.fillStyle = accentColor;
      ctx.font = '600 24px Outfit, sans-serif';
      ctx.fillText(subheadline.toUpperCase(), xAnchor, height - 420);

      // Headline
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 68px Outfit, sans-serif';
      // Simple word wrapping
      const words = headline.split(' ');
      let line = '';
      let y = height - 340;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > width - 160 && n > 0) {
          ctx.fillText(line, xAnchor, y);
          line = words[n] + ' ';
          y += 74;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, xAnchor, y);

      // Supporting Text
      ctx.fillStyle = '#d4d4d8';
      ctx.font = '400 28px Plus Jakarta Sans, sans-serif';
      ctx.fillText(supportingText.slice(0, 70), xAnchor, y + 60);

      // Date / Details Strip
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '500 22px Courier New, monospace';
      ctx.fillText(dateOrDetails, xAnchor, y + 110);

      // CTA Button Banner
      ctx.fillStyle = accentColor;
      ctx.fillRect(64, height - 120, width - 128, 64);
      ctx.fillStyle = '#0a0a0f';
      ctx.font = 'bold 24px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(ctaText.toUpperCase(), width / 2, height - 80);

      // Export file
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${isPoster ? 'poster' : 'social-post'}-${Date.now()}.png`;
      a.click();
    };

    if (bgStyle === 'image' && currentImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        drawContent();
      };
      img.onerror = () => {
        drawContent();
      };
      img.src = currentImage;
    } else {
      drawContent();
    }
  };

  const handleSaveAndClose = () => {
    if (isPoster) {
      onSave({
        ...posterAsset,
        headline,
        subheadline,
        supportingText,
        dateOrDetails,
        cta: ctaText,
        badgeText,
        accentColor,
        imageUrl: currentImage,
        aspectRatio,
      });
    } else {
      onSave({
        ...socialAsset,
        headline,
        supportingCopy: supportingText,
        cta: ctaText,
        badgeText,
        imageUrl: currentImage,
        aspectRatio,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-6xl h-[92vh] rounded-2xl bg-[#0e1017] border border-neutral-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-neutral-800/80 flex items-center justify-between shrink-0 bg-[#0c0d13]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-lime-400 text-neutral-950 font-bold uppercase">
              {isPoster ? 'Poster Studio' : 'Social Graphic Studio'}
            </span>
            <span className="text-sm font-semibold text-white">Lightweight Visual Canvas</span>
            <span className="text-xs text-neutral-500">· Simpler than Canva, AI-driven</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Undo"
              className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 disabled:opacity-30 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo"
              className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 disabled:opacity-30 cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownloadPng}
              className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-lime-400" />
              <span>Download PNG</span>
            </button>

            <button
              onClick={handleSaveAndClose}
              className="px-4 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-neutral-950 text-xs font-bold transition-all cursor-pointer shadow-md shadow-lime-400/10"
            >
              Done & Save
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Quick Polish Strip */}
        <div className="px-6 py-2.5 bg-neutral-950 border-b border-neutral-800/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 shrink-0">
            <Wand2 className="w-3.5 h-3.5 text-lime-400" />
            <span className="font-semibold text-neutral-300">AI Quick Edit:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 flex-1">
            {[
              'Make headline shorter',
              'Change tone to Gen Z',
              'Make it more premium',
              'Use a stronger CTA',
              'Make suitable for Instagram',
            ].map((chip) => (
              <button
                key={chip}
                disabled={isAiPolishing}
                onClick={() => handleAiPolish(chip)}
                className="px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-lime-400 hover:text-neutral-950 text-neutral-300 border border-neutral-800 text-[11px] whitespace-nowrap transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (aiInstruction.trim()) handleAiPolish(aiInstruction);
            }}
            className="flex items-center gap-1.5 shrink-0"
          >
            <input
              type="text"
              value={aiInstruction}
              onChange={(e) => setAiInstruction(e.target.value)}
              placeholder="Custom AI edit instruction..."
              className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-white placeholder-neutral-500 outline-none w-52 focus:border-lime-400"
            />
            <button
              type="submit"
              disabled={!aiInstruction.trim() || isAiPolishing}
              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-lime-400 font-semibold text-[11px] cursor-pointer"
            >
              Apply
            </button>
          </form>
        </div>

        {/* Studio Workspace Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Central Live Canvas Area */}
          <div className="flex-1 bg-[#090a0f] p-8 flex items-center justify-center overflow-auto relative">
            <div
              style={{
                aspectRatio: aspectRatio === '3:4' ? '3/4' : aspectRatio === '1:1' ? '1/1' : '9/16',
                borderColor: accentColor,
              }}
              className="h-full max-h-[580px] w-auto relative rounded-2xl overflow-hidden shadow-2xl border-2 flex flex-col justify-between p-6 select-none bg-neutral-950"
            >
              {/* Background Layer */}
              {bgStyle === 'image' && currentImage ? (
                <img
                  src={currentImage}
                  alt="Canvas background"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
              ) : null}

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 pointer-events-none" />

              {/* Top Row: Badge & Logo */}
              <div className="relative z-10 flex items-center justify-between">
                <span
                  style={{ backgroundColor: accentColor }}
                  className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded text-neutral-950 font-bold uppercase"
                >
                  {badgeText}
                </span>

                {showLogo && (
                  <span className="text-xs font-mono font-bold tracking-widest text-white/90 uppercase">
                    {logoText}
                  </span>
                )}
              </div>

              {/* Bottom Main Content Block */}
              <div
                style={{ textAlign: alignment }}
                className="relative z-10 text-white space-y-2 mt-auto"
              >
                <div
                  style={{ color: accentColor }}
                  className="text-[11px] font-mono tracking-widest uppercase font-semibold"
                >
                  {subheadline}
                </div>

                <h2
                  style={{ fontFamily }}
                  className="text-2xl sm:text-3xl font-extrabold leading-tight text-white tracking-tight"
                >
                  {headline}
                </h2>

                <p className="text-xs text-neutral-300 line-clamp-2">{supportingText}</p>

                {isPoster && (
                  <div className="text-[10px] font-mono text-neutral-400 pt-1 border-t border-neutral-700/60 truncate">
                    {dateOrDetails}
                  </div>
                )}

                <div
                  style={{ backgroundColor: accentColor }}
                  className="mt-3 py-2 px-4 rounded-lg text-neutral-950 font-bold text-xs text-center tracking-wide uppercase shadow-sm cursor-pointer"
                >
                  {ctaText}
                </div>
              </div>
            </div>
          </div>

          {/* Right Properties Panel */}
          <div className="w-80 border-l border-neutral-800 bg-[#0e1017] p-5 overflow-y-auto space-y-6 text-xs">
            {/* Aspect Ratio / Platform Selection */}
            <div>
              <div className="font-semibold text-neutral-200 mb-2 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-lime-400" />
                <span>Aspect Ratio & Format</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '3:4', label: '3:4 Poster' },
                  { id: '1:1', label: '1:1 Square' },
                  { id: '9:16', label: '9:16 Story' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAspectRatio(item.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-center font-mono text-[11px] border transition-colors cursor-pointer ${
                      aspectRatio === item.id
                        ? 'bg-lime-400 text-neutral-950 font-bold border-lime-400'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Controls */}
            <div className="space-y-3">
              <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-lime-400" />
                <span>Typography & Text</span>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Subheadline / Kicker</label>
                <input
                  type="text"
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Supporting Copy</label>
                <textarea
                  rows={2}
                  value={supportingText}
                  onChange={(e) => setSupportingText(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                />
              </div>

              {/* Font Family & Alignment */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Font Face</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white outline-none"
                  >
                    <option value="Outfit">Outfit (Display)</option>
                    <option value="Plus Jakarta Sans">Jakarta Sans</option>
                    <option value="Georgia">Editorial Serif</option>
                    <option value="Courier New">Monospace</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Alignment</label>
                  <div className="flex border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950">
                    <button
                      onClick={() => setAlignment('left')}
                      className={`flex-1 p-1.5 text-center ${alignment === 'left' ? 'bg-neutral-800 text-lime-400' : 'text-neutral-400'}`}
                    >
                      <AlignLeft className="w-3.5 h-3.5 mx-auto" />
                    </button>
                    <button
                      onClick={() => setAlignment('center')}
                      className={`flex-1 p-1.5 text-center ${alignment === 'center' ? 'bg-neutral-800 text-lime-400' : 'text-neutral-400'}`}
                    >
                      <AlignCenter className="w-3.5 h-3.5 mx-auto" />
                    </button>
                    <button
                      onClick={() => setAlignment('right')}
                      className={`flex-1 p-1.5 text-center ${alignment === 'right' ? 'bg-neutral-800 text-lime-400' : 'text-neutral-400'}`}
                    >
                      <AlignRight className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Colors & Palette */}
            <div className="space-y-3">
              <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-lime-400" />
                <span>Brand Colors</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-7 h-7 rounded bg-transparent border border-neutral-700 cursor-pointer"
                  />
                  <span className="text-[11px] text-neutral-300">Accent Tint</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryBgColor}
                    onChange={(e) => setPrimaryBgColor(e.target.value)}
                    className="w-7 h-7 rounded bg-transparent border border-neutral-700 cursor-pointer"
                  />
                  <span className="text-[11px] text-neutral-300">Canvas Base</span>
                </div>
              </div>
            </div>

            {/* Image / Background Replacement */}
            <div className="space-y-2">
              <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-lime-400" />
                <span>Background Visuals</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '/src/assets/images/moon_brew_poster_visual_1793543144586.jpg', label: 'Celestial' },
                  { id: '/src/assets/images/moon_brew_hero_coffee_1793543143910.jpg', label: 'Artisan' },
                  { id: '/src/assets/images/studio_creative_desk_1793543143344.jpg', label: 'Studio' },
                ].map((imgItem) => (
                  <button
                    key={imgItem.label}
                    onClick={() => {
                      setBgStyle('image');
                      setCurrentImage(imgItem.id);
                    }}
                    className={`p-1 rounded-lg border text-center transition-all cursor-pointer ${
                      currentImage === imgItem.id && bgStyle === 'image'
                        ? 'border-lime-400 bg-lime-400/10 text-lime-300'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <img
                      src={imgItem.id}
                      alt={imgItem.label}
                      className="w-full h-12 rounded object-cover mb-1"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[10px] font-mono">{imgItem.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
