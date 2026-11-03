import React from 'react';
import { Sparkles, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { CAMPAIGN_TEMPLATES, CampaignTemplate } from '../data/campaignTemplates';

interface TemplatesViewProps {
  onSelectTemplate: (template: CampaignTemplate) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onSelectTemplate }) => {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-800">
        <div className="text-xs font-mono uppercase tracking-wider text-lime-400 mb-1">
          Preset Architecture
        </div>
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">
          Campaign Templates & Inspiration
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Explore proven campaign blueprints across retail, food & beverage, education, software, and fashion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CAMPAIGN_TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-neutral-400">{tmpl.category}</span>
                <span className="px-2 py-0.5 rounded bg-lime-400/10 text-lime-400 border border-lime-400/20">
                  {tmpl.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-lime-300 transition-colors">
                {tmpl.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                {tmpl.description}
              </p>

              <div className="mt-4 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 space-y-1.5 text-xs">
                <div className="text-[11px] font-mono text-neutral-400 uppercase">
                  Default Prompt Seed:
                </div>
                <div className="text-neutral-300 italic">“{tmpl.prompt}”</div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tmpl.primaryColor }} />
                  <span>Base</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tmpl.accentColor }} />
                  <span>Accent</span>
                </div>
                <span>· {tmpl.defaultAudience}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800/80">
              <button
                onClick={() => onSelectTemplate(tmpl)}
                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-lime-400 hover:text-neutral-950 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Campaign from Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
