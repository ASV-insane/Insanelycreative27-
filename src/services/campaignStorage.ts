import { Campaign, BrandKit } from '../types/campaign';
import { sampleMoonBrewCampaign, defaultBrandKit } from '../data/sampleCampaign';

const CAMPAIGNS_KEY = 'insanely_creative_27_campaigns';
const BRAND_KIT_KEY = 'insanely_creative_27_brandkit';

export function getStoredCampaigns(): Campaign[] {
  try {
    const raw = localStorage.getItem(CAMPAIGNS_KEY);
    if (!raw) {
      // Initialize with sample campaign
      localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify([sampleMoonBrewCampaign]));
      return [sampleMoonBrewCampaign];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [sampleMoonBrewCampaign];
    }
    return parsed;
  } catch (e) {
    console.error('Failed to parse campaigns from localStorage:', e);
    return [sampleMoonBrewCampaign];
  }
}

export function saveCampaign(campaign: Campaign): void {
  try {
    const campaigns = getStoredCampaigns();
    const index = campaigns.findIndex((c) => c.id === campaign.id);
    if (index >= 0) {
      campaigns[index] = { ...campaign, updatedAt: new Date().toISOString() };
    } else {
      campaigns.unshift({ ...campaign, updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
  } catch (e) {
    console.error('Failed to save campaign:', e);
  }
}

export function deleteCampaign(id: string): Campaign[] {
  try {
    const campaigns = getStoredCampaigns().filter((c) => c.id !== id);
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
    return campaigns;
  } catch (e) {
    console.error('Failed to delete campaign:', e);
    return [];
  }
}

export function duplicateCampaign(id: string): Campaign | null {
  try {
    const campaigns = getStoredCampaigns();
    const original = campaigns.find((c) => c.id === id);
    if (!original) return null;

    const duplicated: Campaign = {
      ...original,
      id: `campaign-${Date.now()}`,
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveCampaign(duplicated);
    return duplicated;
  } catch (e) {
    console.error('Failed to duplicate campaign:', e);
    return null;
  }
}

export function getStoredBrandKit(): BrandKit {
  try {
    const raw = localStorage.getItem(BRAND_KIT_KEY);
    if (!raw) {
      localStorage.setItem(BRAND_KIT_KEY, JSON.stringify(defaultBrandKit));
      return defaultBrandKit;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultBrandKit;
  }
}

export function saveStoredBrandKit(brandKit: BrandKit): void {
  try {
    localStorage.setItem(BRAND_KIT_KEY, JSON.stringify(brandKit));
  } catch (e) {
    console.error('Failed to save brand kit:', e);
  }
}
