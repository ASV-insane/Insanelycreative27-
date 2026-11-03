import React, { useState } from 'react';
import { X, Wand2, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { BrandKit } from '../types/campaign';
import { editAssetWithAi } from '../services/apiClient';

interface AiEditPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetKey: string;
  currentAsset: any;
  brandKit: BrandKit;
  onAssetUpdated: (assetKey: string, updatedAsset: any) => void;
}

export const AiEditPromptModal: React.FC<AiEditPromptModalProps> = ({
  isOpen,
  onClose,
  assetKey,
  currentAsset,
  brandKit,
  onAssetUpdated,
}) => {
  if (!isOpen) return null;

  const [instruction, setInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPillOptions = [
    'Make this more professional',
    'Make the headline shorter',
    'Change the tone to Gen Z',
    'Make it more premium and minimal',
    'Use a stronger, high-urgency CTA',
    'Make this suitable for Instagram',
    'Give me three punchy alternatives',
    'Highlight the free student offer more',
  ];

  const handleApplyInstruction = async (textToUse?: string) => {
    const inst = textToUse || instruction;
    if (!inst.trim()) return;

    setIsLoading(true);
    try {
      const updated = await editAssetWithAi({
        assetType: assetKey,
        currentAsset,
        instruction: inst,
        brandKit,
      });

      if (updated) {
        onAssetUpdated(assetKey, updated);
        onClose();
      }
    } catch (err) {
      console.error('Failed to edit asset with AI:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-[#0e1017] border border-neutral-800 p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-lime-400">
                AI Natural Language Editing
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Regenerate & Refine Asset
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Asset Context Snippet */}
        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
            Current Target Asset ({assetKey})
          </span>
          <p className="text-neutral-300 font-medium truncate">
            {currentAsset?.headline || currentAsset?.hook || currentAsset?.title || currentAsset?.subjectLines?.[0] || 'Asset Content'}
          </p>
        </div>

        {/* Natural Language Prompt Input */}
        <div>
          <label className="block text-xs font-semibold text-neutral-200 mb-1.5">
            What would you like the AI to change?
          </label>
          <textarea
            rows={3}
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g. Make the headline punchier, shift to Gen Z slang, emphasize the grand opening date, or write 3 stronger variants..."
            className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-lime-400 outline-none resize-none font-sans"
          />
        </div>

        {/* Quick Suggestion Pills */}
        <div>
          <span className="text-[11px] text-neutral-400 block mb-2 font-medium">
            Quick one-click instructions:
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
            {quickPillOptions.map((pill) => (
              <button
                key={pill}
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setInstruction(pill);
                  handleApplyInstruction(pill);
                }}
                className="px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-lime-400 hover:text-neutral-950 text-neutral-300 border border-neutral-800 text-[11px] transition-colors cursor-pointer"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!instruction.trim() || isLoading}
            onClick={() => handleApplyInstruction()}
            className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-lime-400/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Refining with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply Instruction</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
