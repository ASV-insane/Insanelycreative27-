import { Campaign, BrandKit, CampaignExtractResult } from '../types/campaign';

export async function extractCampaignDetails(prompt: string): Promise<CampaignExtractResult> {
  try {
    const res = await fetch('/api/campaign/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) throw new Error('Network error on extract');
    return await res.json();
  } catch (err) {
    console.warn('API extract call failed, fallback locally:', err);
    return {
      name: 'New Campaign',
      whatPromoting: prompt.slice(0, 100),
      brandName: prompt.split(' ')[0] || 'Brand',
      targetAudience: 'Modern digital audience',
      objective: 'Launch & Engagement',
      tone: 'Atmospheric, bold, and clear',
      suggestedPrimaryColor: '#0c1222',
      suggestedSecondaryColor: '#e0a96d',
      platforms: ['Instagram', 'Shorts / Reels', 'Posters', 'Email'],
    };
  }
}

export async function generateCampaignPackage(payload: {
  prompt: string;
  name: string;
  whatPromoting: string;
  brandName: string;
  targetAudience: string;
  objective: string;
  tone: string;
  brandKit: BrandKit;
  platforms: string[];
}): Promise<{ strategy: any; assets: any }> {
  try {
    const res = await fetch('/api/campaign/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Network error on campaign generate');
    return await res.json();
  } catch (err) {
    console.error('API generate error, using fallback:', err);
    throw err;
  }
}

export async function editAssetWithAi(payload: {
  assetType: string;
  currentAsset: any;
  instruction: string;
  brandKit?: BrandKit;
  campaignContext?: string;
}): Promise<any> {
  try {
    const res = await fetch('/api/campaign/edit-asset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Network error on asset edit');
    const data = await res.json();
    return data.updatedAsset;
  } catch (err) {
    console.warn('API asset edit error:', err);
    // Local fallback
    const asset = { ...payload.currentAsset };
    if (asset.headline) {
      asset.headline = `${asset.headline} (${payload.instruction})`;
    }
    return asset;
  }
}

export async function applyCampaignTone(payload: {
  campaign: Campaign;
  newTone: string;
  targetAssetKeys?: string[];
}): Promise<any> {
  try {
    const res = await fetch('/api/campaign/apply-tone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Network error on apply tone');
    return await res.json();
  } catch (err) {
    console.warn('API apply tone error:', err);
    return { success: false };
  }
}
