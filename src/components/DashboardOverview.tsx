import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  PlusCircle,
  FolderKanban,
  Clock,
  Layers,
  ChevronRight,
  Wand2,
  Copy,
  Trash2,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { Campaign, BrandKit } from '../types/campaign';
import { CAMPAIGN_TEMPLATES, CampaignTemplate } from '../data/campaignTemplates';

interface DashboardOverviewProps {
  onStartCampaignWithPrompt: (promptText: string) => void;
  openCreateModal: () => void;
  campaigns: Campaign[];
  onSelectCampaign: (campaign: Campaign) => void;
  onDuplicateCampaign: (id: string) => void;
  onDeleteCampaign: (id: string) => void;
  brandKit: BrandKit;
  onLoadTemplate: (template: CampaignTemplate) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onStartCampaignWithPrompt,
  openCreateModal,
  campaigns,
  onSelectCampaign,
  onDuplicateCampaign,
  onDeleteCampaign,
  brandKit,
  onLoadTemplate,
}) => {
  const [quickInput, setQuickInput] = useState('');

  const samplePrompts = [
    {
      title: 'Moon Brew Grand Opening',
      text: 'I’m launching a new café called Moon Brew. Grand opening this Saturday. Target audience is college students.',
    },
    {
      title: 'Class 10 Tutoring Crash Course',
      text: 'I want to promote my new tutoring centre called Apex Scholars for Class 10 students before upcoming board exams.',
    },
    {
      title: 'AI Code Review Tool Beta',
      text: 'Launching SyntaxPulse: an AI developer tool that cuts PR review times in half for engineering teams.',
    },
    {
      title: 'Streetwear Limited Drop',
      text: 'Announcing our autumn capsule drop "Monochrome Drift" by Nocturne Atelier. 300 pieces only.',
    },
  ];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onStartCampaignWithPrompt(quickInput.trim());
  };

  const totalAssetsCount = campaigns.reduce((acc, c) => {
    // each campaign has 8 core connected assets
    return acc + 8;
  }, 0);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-lime-400 mb-1 font-semibold">
            Studio Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Create something new
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Transform a single marketing idea into an entire synchronized multi-channel content campaign.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime-400" />
            <span>Brand Kit: <strong className="text-neutral-200">{brandKit.brandName}</strong></span>
          </div>
        </div>
      </div>

      {/* Prominent "Create Something New" Large Natural Language Box */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-neutral-900/90 to-neutral-900/40 border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleQuickSubmit}>
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <label htmlFor="campaign-quick-input" className="font-semibold text-neutral-200 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-lime-400" />
              <span>Describe your idea in your own words...</span>
            </label>
            <span className="text-[11px] font-mono text-neutral-400">
              AI automatically extracts audience, tone & strategy
            </span>
          </div>

          <div className="relative mt-2">
            <textarea
              id="campaign-quick-input"
              rows={3}
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="e.g. I’m launching a new café called Moon Brew. Grand opening this Saturday. Target audience is college students."
              className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm text-white placeholder-neutral-500 outline-none transition-all resize-none font-sans"
            />

            <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-400">
                <span className="text-[11px] text-neutral-400">Try an example:</span>
                {samplePrompts.slice(0, 3).map((sp) => (
                  <button
                    key={sp.title}
                    type="button"
                    onClick={() => setQuickInput(sp.text)}
                    className="px-2.5 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-800 hover:text-neutral-200 text-neutral-400 text-[11px] transition-colors cursor-pointer"
                  >
                    {sp.title}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Guided Mode
                </button>
                <button
                  type="submit"
                  disabled={!quickInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-950 text-xs font-bold transition-all shadow-md shadow-lime-400/15 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
                  <span>Generate Campaign</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Metrics Row (Claim-to-Proof & Overview) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
          <div className="text-xs text-neutral-400 font-medium">Stored Campaigns</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {campaigns.length}
            </span>
            <span className="text-xs text-neutral-400">projects active</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
          <div className="text-xs text-neutral-400 font-medium">Generated Assets</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {totalAssetsCount}
            </span>
            <span className="text-xs text-neutral-400">coordinated pieces</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
          <div className="text-xs text-neutral-400 font-medium">Active Brand Identity</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-semibold text-amber-300 truncate">
              {brandKit.brandName}
            </span>
            <span className="text-xs text-neutral-400 truncate">· {brandKit.tone.slice(0, 24)}...</span>
          </div>
        </div>
      </div>

      {/* Recent Campaigns Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Your Campaigns</h2>
            <p className="text-xs text-neutral-400">Click any campaign to inspect or edit its connected assets.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
          >
            <span>+ New Campaign</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden shrink-0">
                    {camp.thumbnailUrl ? (
                      <img
                        src={camp.thumbnailUrl}
                        alt={camp.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-amber-400 font-bold font-mono text-sm">
                        27
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      Ready
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {camp.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {camp.prompt}
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                  <span>8 connected assets</span>
                  <span>{new Date(camp.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-800/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectCampaign(camp)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open Studio</span>
                </button>
                <button
                  onClick={() => onDuplicateCampaign(camp.id)}
                  title="Duplicate Campaign"
                  className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {campaigns.length > 1 && (
                  <button
                    onClick={() => onDeleteCampaign(camp.id)}
                    title="Delete Campaign"
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Templates Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Quick Launch Inspiration</h2>
            <p className="text-xs text-neutral-400">Pre-tuned campaign setups across different domains.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CAMPAIGN_TEMPLATES.slice(0, 3).map((tmpl) => (
            <div
              key={tmpl.id}
              className="p-5 rounded-xl bg-neutral-900/30 border border-neutral-800/80 hover:border-neutral-700 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-2">
                  <span>{tmpl.category}</span>
                  <span className="text-amber-400">{tmpl.badge}</span>
                </div>
                <h4 className="font-bold text-sm text-white">{tmpl.title}</h4>
                <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <button
                onClick={() => onLoadTemplate(tmpl)}
                className="mt-4 w-full py-2 rounded-lg bg-neutral-800/80 hover:bg-amber-400 hover:text-neutral-950 text-neutral-200 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Use Template</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
