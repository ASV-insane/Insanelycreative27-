import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  Palette,
  Sparkles,
  Settings,
  Rocket,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Campaign } from '../types/campaign';
import { PWAInstallButton } from './PWAInstallButton';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  openCreateModal: () => void;
  currentCampaign: Campaign | null;
  onSelectCampaign: (campaign: Campaign) => void;
  allCampaigns: Campaign[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  openCreateModal,
  currentCampaign,
  onSelectCampaign,
  allCampaigns,
}) => {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Campaigns', icon: FolderKanban, count: allCampaigns.length },
    { id: 'store_publish', label: 'Store Launch', icon: Rocket, highlight: true },
    { id: 'brandkit', label: 'Brand Kit', icon: Palette },
    { id: 'templates', label: 'Templates', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#0c0d12] border-r border-neutral-800/80 flex flex-col h-screen select-none">
      {/* Brand Zone */}
      <div className="p-5 border-b border-neutral-800/80">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Insanely creative 27"
            className="w-10 h-10 rounded-xl object-contain shadow-lg shadow-lime-400/10 border border-lime-400/20 bg-neutral-900"
          />
          <div>
            <div className="font-display font-black text-sm tracking-tight text-white flex items-center gap-1">
              <span>Insanely creative</span>
              <span className="text-lime-400">27</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase font-semibold">
              Production Studio
            </div>
          </div>
        </div>

        {/* Primary Action Button & PWA Install Button */}
        <div className="mt-4 space-y-2">
          <button
            onClick={openCreateModal}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 active:scale-[0.99] text-neutral-950 font-bold text-xs tracking-wide transition-all shadow-md shadow-lime-400/15 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-neutral-950" />
            <span>Create a Campaign</span>
          </button>

          <PWAInstallButton />
        </div>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Workspace
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-neutral-800/90 text-white shadow-xs'
                      : item.highlight
                      ? 'text-lime-400 hover:text-lime-300 hover:bg-lime-400/10 font-semibold'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-lime-400' : item.highlight ? 'text-lime-400' : 'text-neutral-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className="text-[11px] tabular-nums font-mono text-neutral-400">
                      {item.count}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-lime-400/20 text-lime-300">
                      Store
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Current Active Project Pin */}
        {currentCampaign && (
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
              <span>Active Campaign</span>
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
            </div>
            <button
              onClick={() => setActiveView('campaign_detail')}
              className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                activeView === 'campaign_detail'
                  ? 'bg-lime-400/10 border-lime-500/40 text-lime-300'
                  : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 text-neutral-200'
              }`}
            >
              <div className="font-semibold text-xs truncate">{currentCampaign.name}</div>
              <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                {currentCampaign.brandKit?.brandName} · 8 Assets
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-lime-400 font-medium">
                <span>Open Dashboard</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          </div>
        )}

        {/* Quick Recent Campaigns */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
            <span>Recent</span>
            <button
              onClick={() => setActiveView('campaigns')}
              className="text-[10px] text-neutral-400 hover:text-neutral-200 cursor-pointer"
            >
              All
            </button>
          </div>
          <div className="space-y-1">
            {allCampaigns.slice(0, 4).map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onSelectCampaign(c);
                  setActiveView('campaign_detail');
                }}
                className="w-full text-left px-3 py-1.5 rounded-md text-xs text-neutral-300 hover:text-white hover:bg-neutral-800/40 truncate flex items-center justify-between group cursor-pointer"
              >
                <span className="truncate">{c.name}</span>
                <span className="text-[10px] font-mono text-neutral-400 group-hover:text-neutral-300">
                  {new Date(c.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Profile & Sole Creator Ownership Attribution */}
      <div className="p-3.5 border-t border-neutral-800/80 bg-neutral-950/60">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-[10px] font-black text-neutral-950">
              AS
            </div>
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1">
                <span>Aryan Sood</span>
                <ShieldCheck className="w-3 h-3 text-amber-400" />
              </div>
              <div className="text-[10px] text-neutral-400">Creator & Sole Owner</div>
            </div>
          </div>
          <button
            onClick={() => setActiveView('landing')}
            title="View Product Tour & Landing"
            className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 text-[11px] cursor-pointer"
          >
            Tour
          </button>
        </div>
      </div>
    </aside>
  );
};
