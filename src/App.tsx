/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardOverview } from './components/DashboardOverview';
import { CampaignView } from './components/CampaignView';
import { CreateCampaignModal } from './components/CreateCampaignModal';
import { VisualEditorModal } from './components/VisualEditorModal';
import { VideoStudioModal } from './components/VideoStudioModal';
import { AiEditPromptModal } from './components/AiEditPromptModal';
import { BrandKitView } from './components/BrandKitView';
import { CampaignsListView } from './components/CampaignsListView';
import { TemplatesView } from './components/TemplatesView';
import { SettingsView } from './components/SettingsView';
import { StorePublishPortal } from './components/StorePublishPortal';
import { Campaign, BrandKit } from './types/campaign';
import { CampaignTemplate } from './data/campaignTemplates';
import {
  getStoredCampaigns,
  saveCampaign,
  deleteCampaign,
  duplicateCampaign,
  getStoredBrandKit,
  saveStoredBrandKit,
} from './services/campaignStorage';
import { sampleMoonBrewCampaign } from './data/sampleCampaign';

export default function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [brandKit, setBrandKit] = useState<BrandKit>(getStoredBrandKit());
  const [activeView, setActiveView] = useState<string>('landing');
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createInitialPrompt, setCreateInitialPrompt] = useState('');

  // Visual Editor Modal
  const [visualEditorConfig, setVisualEditorConfig] = useState<{
    isOpen: boolean;
    assetType: 'poster' | 'social_post';
  }>({ isOpen: false, assetType: 'poster' });

  // Video Studio Modal
  const [videoStudioConfig, setVideoStudioConfig] = useState<{
    isOpen: boolean;
    videoType: 'reel' | 'youtubeShort';
  }>({ isOpen: false, videoType: 'reel' });

  // AI Edit Prompt Modal
  const [aiEditConfig, setAiEditConfig] = useState<{
    isOpen: boolean;
    assetKey: string;
    currentAsset: any;
  }>({ isOpen: false, assetKey: '', currentAsset: null });

  // Load initial data
  useEffect(() => {
    const loaded = getStoredCampaigns();
    setCampaigns(loaded);
    if (loaded.length > 0) {
      setCurrentCampaign(loaded[0]);
    }
  }, []);

  // Handlers
  const handleCampaignCreated = (newCampaign: Campaign) => {
    saveCampaign(newCampaign);
    const updated = getStoredCampaigns();
    setCampaigns(updated);
    setCurrentCampaign(newCampaign);
    setActiveView('campaign_detail');
  };

  const handleUpdateCampaign = (updated: Campaign) => {
    saveCampaign(updated);
    const all = getStoredCampaigns();
    setCampaigns(all);
    setCurrentCampaign(updated);
  };

  const handleDuplicateCampaign = (id: string) => {
    const duplicated = duplicateCampaign(id);
    if (duplicated) {
      const all = getStoredCampaigns();
      setCampaigns(all);
      setCurrentCampaign(duplicated);
      setActiveView('campaign_detail');
    }
  };

  const handleDeleteCampaign = (id: string) => {
    const updated = deleteCampaign(id);
    setCampaigns(updated);
    if (currentCampaign?.id === id) {
      setCurrentCampaign(updated[0] || null);
      if (!updated.length) {
        setActiveView('overview');
      }
    }
  };

  const handleSaveBrandKit = (updated: BrandKit) => {
    setBrandKit(updated);
    saveStoredBrandKit(updated);
  };

  const handleStartCampaignWithPrompt = (promptText: string) => {
    setCreateInitialPrompt(promptText);
    setIsCreateModalOpen(true);
  };

  const handleLoadTemplate = (tmpl: CampaignTemplate) => {
    setCreateInitialPrompt(tmpl.prompt);
    setIsCreateModalOpen(true);
  };

  const handleResetDemoData = () => {
    saveCampaign(sampleMoonBrewCampaign);
    const loaded = getStoredCampaigns();
    setCampaigns(loaded);
    setCurrentCampaign(sampleMoonBrewCampaign);
  };

  // Duplicate an asset inside current campaign
  const handleDuplicateAsset = (assetKey: string) => {
    if (!currentCampaign) return;
    const updated = { ...currentCampaign };
    // Create duplicate flag or copy
    saveCampaign(updated);
    setCurrentCampaign(updated);
  };

  return (
    <div className="flex h-screen bg-[#090a0f] text-neutral-100 overflow-hidden font-sans">
      {/* If Landing view is requested and user wants full page tour */}
      {activeView === 'landing' ? (
        <div className="w-full h-full overflow-y-auto">
          <LandingPage
            onStartCampaign={() => {
              setActiveView('overview');
              setIsCreateModalOpen(true);
            }}
            onExploreDemo={() => {
              setCurrentCampaign(sampleMoonBrewCampaign);
              setActiveView('campaign_detail');
            }}
            sampleCampaign={sampleMoonBrewCampaign}
          />
        </div>
      ) : (
        /* Workspace Layout with Left Sidebar */
        <div className="flex w-full h-full overflow-hidden">
          <Sidebar
            activeView={activeView}
            setActiveView={setActiveView}
            openCreateModal={() => {
              setCreateInitialPrompt('');
              setIsCreateModalOpen(true);
            }}
            currentCampaign={currentCampaign}
            onSelectCampaign={(c) => {
              setCurrentCampaign(c);
              setActiveView('campaign_detail');
            }}
            allCampaigns={campaigns}
          />

          {/* Main Content Viewport */}
          <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#090a0f]">
            {activeView === 'overview' && (
              <DashboardOverview
                onStartCampaignWithPrompt={handleStartCampaignWithPrompt}
                openCreateModal={() => {
                  setCreateInitialPrompt('');
                  setIsCreateModalOpen(true);
                }}
                campaigns={campaigns}
                onSelectCampaign={(c) => {
                  setCurrentCampaign(c);
                  setActiveView('campaign_detail');
                }}
                onDuplicateCampaign={handleDuplicateCampaign}
                onDeleteCampaign={handleDeleteCampaign}
                brandKit={brandKit}
                onLoadTemplate={handleLoadTemplate}
              />
            )}

            {activeView === 'campaign_detail' && currentCampaign && (
              <CampaignView
                campaign={currentCampaign}
                onUpdateCampaign={handleUpdateCampaign}
                onBackToOverview={() => setActiveView('overview')}
                onOpenVisualEditor={(assetType) =>
                  setVisualEditorConfig({ isOpen: true, assetType })
                }
                onOpenVideoStudio={(videoType) =>
                  setVideoStudioConfig({ isOpen: true, videoType })
                }
                onOpenAiEditModal={(assetKey, currentAsset) =>
                  setAiEditConfig({ isOpen: true, assetKey, currentAsset })
                }
                onDuplicateAsset={handleDuplicateAsset}
              />
            )}

            {activeView === 'campaigns' && (
              <CampaignsListView
                campaigns={campaigns}
                onSelectCampaign={(c) => {
                  setCurrentCampaign(c);
                  setActiveView('campaign_detail');
                }}
                onDuplicateCampaign={handleDuplicateCampaign}
                onDeleteCampaign={handleDeleteCampaign}
                openCreateModal={() => {
                  setCreateInitialPrompt('');
                  setIsCreateModalOpen(true);
                }}
              />
            )}

            {activeView === 'brandkit' && (
              <BrandKitView
                brandKit={brandKit}
                onSaveBrandKit={handleSaveBrandKit}
              />
            )}

            {activeView === 'templates' && (
              <TemplatesView onSelectTemplate={handleLoadTemplate} />
            )}

            {activeView === 'store_publish' && (
              <StorePublishPortal />
            )}

            {activeView === 'settings' && (
              <SettingsView onResetDemoData={handleResetDemoData} />
            )}
          </main>
        </div>
      )}

      {/* Create Campaign Guided / Natural Language Modal */}
      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        brandKit={brandKit}
        onCampaignCreated={handleCampaignCreated}
        initialPrompt={createInitialPrompt}
      />

      {/* Lightweight Visual Editor Modal */}
      {currentCampaign && visualEditorConfig.isOpen && (
        <VisualEditorModal
          isOpen={visualEditorConfig.isOpen}
          onClose={() => setVisualEditorConfig({ isOpen: false, assetType: 'poster' })}
          assetType={visualEditorConfig.assetType}
          asset={
            visualEditorConfig.assetType === 'poster'
              ? currentCampaign.assets.poster
              : currentCampaign.assets.socialPost
          }
          brandKit={currentCampaign.brandKit}
          onSave={(updatedAsset) => {
            if (visualEditorConfig.assetType === 'poster') {
              handleUpdateCampaign({
                ...currentCampaign,
                assets: {
                  ...currentCampaign.assets,
                  poster: updatedAsset,
                },
              });
            } else {
              handleUpdateCampaign({
                ...currentCampaign,
                assets: {
                  ...currentCampaign.assets,
                  socialPost: updatedAsset,
                },
              });
            }
          }}
        />
      )}

      {/* Video Studio & Storyboard Modal */}
      {currentCampaign && videoStudioConfig.isOpen && (
        <VideoStudioModal
          isOpen={videoStudioConfig.isOpen}
          onClose={() => setVideoStudioConfig({ isOpen: false, videoType: 'reel' })}
          videoType={videoStudioConfig.videoType}
          videoAsset={
            videoStudioConfig.videoType === 'reel'
              ? currentCampaign.assets.reel
              : currentCampaign.assets.youtubeShort
          }
          brandKit={currentCampaign.brandKit}
          onSave={(updated) => {
            if (videoStudioConfig.videoType === 'reel') {
              handleUpdateCampaign({
                ...currentCampaign,
                assets: {
                  ...currentCampaign.assets,
                  reel: updated,
                },
              });
            } else {
              handleUpdateCampaign({
                ...currentCampaign,
                assets: {
                  ...currentCampaign.assets,
                  youtubeShort: updated,
                },
              });
            }
          }}
        />
      )}

      {/* AI Edit Prompt Modal */}
      {currentCampaign && aiEditConfig.isOpen && (
        <AiEditPromptModal
          isOpen={aiEditConfig.isOpen}
          onClose={() => setAiEditConfig({ isOpen: false, assetKey: '', currentAsset: null })}
          assetKey={aiEditConfig.assetKey}
          currentAsset={aiEditConfig.currentAsset}
          brandKit={currentCampaign.brandKit}
          onAssetUpdated={(assetKey, updatedAsset) => {
            handleUpdateCampaign({
              ...currentCampaign,
              assets: {
                ...currentCampaign.assets,
                [assetKey]: updatedAsset,
              },
            });
          }}
        />
      )}
    </div>
  );
}
