import React, { useState } from 'react';
import {
  FolderKanban,
  Search,
  PlusCircle,
  Eye,
  Copy,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Campaign } from '../types/campaign';

interface CampaignsListViewProps {
  campaigns: Campaign[];
  onSelectCampaign: (campaign: Campaign) => void;
  onDuplicateCampaign: (id: string) => void;
  onDeleteCampaign: (id: string) => void;
  openCreateModal: () => void;
}

export const CampaignsListView: React.FC<CampaignsListViewProps> = ({
  campaigns,
  onSelectCampaign,
  onDuplicateCampaign,
  onDeleteCampaign,
  openCreateModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brandKit?.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 max-w-6xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-lime-400 mb-1">
            Project Archives
          </div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            Campaign History
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Access, duplicate, or continue refining any past coordinated marketing campaign.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold text-xs tracking-wide transition-all shadow-md shadow-lime-400/10 flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-neutral-950" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns by name, prompt or brand..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-lime-400 outline-none"
          />
        </div>
        <span className="text-xs font-mono text-neutral-400">
          Showing {filteredCampaigns.length} of {campaigns.length}
        </span>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCampaigns.map((camp) => (
          <div
            key={camp.id}
            className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Thumbnail / Header */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/80 mb-4">
                {camp.thumbnailUrl ? (
                  <img
                    src={camp.thumbnailUrl}
                    alt={camp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lime-400 font-bold font-mono text-base">
                    27
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-emerald-400 border border-neutral-700/60 font-semibold">
                    READY · 8 ASSETS
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-lime-400 mb-1">
                {camp.brandKit?.brandName}
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-lime-300 transition-colors line-clamp-1">
                {camp.name}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                {camp.prompt}
              </p>

              <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(camp.updatedAt).toLocaleDateString()}</span>
                </span>
                <span className="text-neutral-400">8 Connected</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-neutral-800/60 flex items-center justify-between gap-2">
              <button
                onClick={() => onSelectCampaign(camp)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-lime-400" />
                <span>Open Dashboard</span>
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
  );
};
