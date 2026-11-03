import React, { useState } from 'react';
import {
  Palette,
  Check,
  Type,
  Sparkles,
  Layers,
  Save,
  Plus,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { BrandKit } from '../types/campaign';

interface BrandKitViewProps {
  brandKit: BrandKit;
  onSaveBrandKit: (updated: BrandKit) => void;
}

export const BrandKitView: React.FC<BrandKitViewProps> = ({ brandKit, onSaveBrandKit }) => {
  const [brandName, setBrandName] = useState(brandKit.brandName);
  const [tagline, setTagline] = useState(brandKit.tagline);
  const [primaryColor, setPrimaryColor] = useState(brandKit.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(brandKit.secondaryColor);
  const [accentColor, setAccentColor] = useState(brandKit.accentColor);
  const [fontPairing, setFontPairing] = useState(brandKit.fontPairing);
  const [tone, setTone] = useState(brandKit.tone);
  const [logoText, setLogoText] = useState(brandKit.logoText || brandKit.brandName);
  const [valueProps, setValueProps] = useState<string[]>(brandKit.valueProps || []);
  const [newValueProp, setNewValueProp] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSaveBrandKit({
      brandName,
      tagline,
      primaryColor,
      secondaryColor,
      accentColor,
      fontPairing,
      tone,
      logoText,
      valueProps,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleAddValueProp = () => {
    if (!newValueProp.trim()) return;
    setValueProps([...valueProps, newValueProp.trim()]);
    setNewValueProp('');
  };

  const handleRemoveValueProp = (idx: number) => {
    setValueProps(valueProps.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-lime-400 mb-1">
            Global Identity
          </div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            Studio Brand Kit
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Define your core brand identity once. Every new campaign automatically inherits these styles, colors, and tone.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold text-xs tracking-wide transition-all shadow-md shadow-lime-400/10 flex items-center gap-2 cursor-pointer active:scale-95"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Saved to Studio' : 'Save Brand Kit'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual Preview Card */}
        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">
              Live Identity Card
            </div>

            <div
              style={{ backgroundColor: primaryColor }}
              className="p-6 rounded-xl border border-neutral-800 shadow-xl space-y-4 text-white relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span
                  style={{ backgroundColor: accentColor }}
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded text-neutral-950 uppercase"
                >
                  BRAND IDENTITY
                </span>
                <span className="font-mono text-xs font-bold tracking-widest uppercase">
                  {logoText}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-display font-black tracking-tight">{brandName}</h3>
                <p className="text-xs text-neutral-300 mt-1 italic">“{tagline}”</p>
              </div>

              <div className="pt-3 border-t border-white/10 text-xs space-y-1 text-neutral-300">
                <div className="text-[11px] font-mono text-lime-300">Tone Profile:</div>
                <div className="text-[11px] line-clamp-2">{tone}</div>
              </div>

              {/* Color swatches */}
              <div className="pt-2 flex items-center gap-2">
                <div
                  style={{ backgroundColor: primaryColor }}
                  className="w-6 h-6 rounded-full border border-white/30"
                  title="Primary"
                />
                <div
                  style={{ backgroundColor: secondaryColor }}
                  className="w-6 h-6 rounded-full border border-white/30"
                  title="Secondary"
                />
                <div
                  style={{ backgroundColor: accentColor }}
                  className="w-6 h-6 rounded-full border border-white/30"
                  title="Accent"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-800 text-xs text-neutral-400">
            Campaigns will maintain this color palette and typography across all multi-channel exports.
          </div>
        </div>

        {/* Right Columns: Editable Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Brand Name & Tagline */}
          <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-lime-400" />
              <span>Core Brand Name & Tagline</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Logo / Wordmark Text</label>
                <input
                  type="text"
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-neutral-300 font-medium mb-1">Tagline or Purpose</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
              />
            </div>
          </div>

          {/* Color System */}
          <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-lime-400" />
              <span>Color System</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded bg-transparent border border-neutral-700 cursor-pointer"
                />
                <div>
                  <div className="text-neutral-300 font-medium">Primary</div>
                  <div className="text-[11px] font-mono text-neutral-500">{primaryColor}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-8 h-8 rounded bg-transparent border border-neutral-700 cursor-pointer"
                />
                <div>
                  <div className="text-neutral-300 font-medium">Secondary</div>
                  <div className="text-[11px] font-mono text-neutral-500">{secondaryColor}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 rounded bg-transparent border border-neutral-700 cursor-pointer"
                />
                <div>
                  <div className="text-neutral-300 font-medium">Accent Highlight</div>
                  <div className="text-[11px] font-mono text-neutral-500">{accentColor}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Voice & Tone */}
          <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Type className="w-4 h-4 text-lime-400" />
              <span>Voice & Tone Blueprint</span>
            </h3>

            <div className="text-xs">
              <label className="block text-neutral-300 font-medium mb-1">
                Tone Guidelines for AI Copywriting
              </label>
              <textarea
                rows={2}
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                placeholder="e.g. Atmospheric, culturally savvy, warm, welcoming to late-night thinkers..."
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none resize-none font-sans"
              />
            </div>
          </div>

          {/* Value Propositions */}
          <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
            <h3 className="text-sm font-bold text-white">Core Value Propositions</h3>
            <div className="space-y-2">
              {valueProps.map((vp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-200"
                >
                  <span>{vp}</span>
                  <button
                    onClick={() => handleRemoveValueProp(idx)}
                    className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newValueProp}
                onChange={(e) => setNewValueProp(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddValueProp()}
                placeholder="Add a new value prop..."
                className="flex-1 px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
              />
              <button
                onClick={handleAddValueProp}
                className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
