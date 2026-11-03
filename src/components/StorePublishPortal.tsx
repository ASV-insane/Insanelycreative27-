import React, { useState } from 'react';
import {
  Smartphone,
  Apple,
  ShieldCheck,
  Check,
  Copy,
  Download,
  ExternalLink,
  Sparkles,
  FileText,
  Layers,
  ArrowRight,
  Terminal,
  Globe,
  Award,
} from 'lucide-react';

export const StorePublishPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'playstore' | 'appstore' | 'metadata' | 'legal'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const creatorName = "Aryan Sood";
  const creatorEmail = "aryansood2704@gmail.com";
  const appName = "Insanely creative 27";
  const appId = "com.aryansood.insanelycreative27";
  const appUrl = window.location.origin;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Download twa-manifest.json for Google Play
  const downloadTwaManifest = () => {
    const twaConfig = {
      packageId: appId,
      host: window.location.host,
      name: appName,
      launcherName: "Creative 27",
      themeColor: "#090a0f",
      navigationColor: "#090a0f",
      backgroundColor: "#090a0f",
      startUrl: "/",
      iconUrl: `${appUrl}/pwa-512x512.png`,
      maskableIconUrl: `${appUrl}/pwa-maskable-512x512.png`,
      appVersionName: "1.0.0",
      appVersionCode: 1,
      enableNotifications: true,
      author: {
        name: creatorName,
        email: creatorEmail,
      },
      generator: "Insanely creative 27 Store Builder",
    };
    const blob = new Blob([JSON.stringify(twaConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'twa-manifest.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download capacitor.config.json for Apple App Store
  const downloadCapacitorConfig = () => {
    const capConfig = {
      appId: appId,
      appName: appName,
      webDir: "dist",
      bundledWebRuntime: false,
      server: {
        url: appUrl,
        cleartext: false,
      },
      ios: {
        scheme: "App",
        contentInset: "always",
      },
      plugins: {
        SplashScreen: {
          launchShowDuration: 1500,
          backgroundColor: "#090a0f",
        },
      },
      author: {
        name: creatorName,
        email: creatorEmail,
      },
    };
    const blob = new Blob([JSON.stringify(capConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'capacitor.config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 max-w-6xl mx-auto w-full text-neutral-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-2">
            <Award className="w-3.5 h-3.5" />
            <span>Store Publishing & Creator Attribution</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            Launch on Google Play & Apple App Store
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Complete store packaging, publisher credentials, asset links, and zero-compromise creator credit for <strong className="text-neutral-200">{creatorName}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Owned by {creatorName}</span>
          </div>
        </div>
      </div>

      {/* Sole Ownership & Credit Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">
            Verified Creator Attribution
          </div>
          <h3 className="text-base font-bold text-white">
            Developer & Intellectual Property: {creatorName}
          </h3>
          <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
            All code, brand identity, copyright, and store publisher accounts belong exclusively to <strong>{creatorName}</strong> ({creatorEmail}). No external platform, agency, or third party has rights or branding claims over this application.
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0 text-xs font-mono text-neutral-400">
          <div>Package ID: <span className="text-amber-300 font-semibold">{appId}</span></div>
          <div>Version: <span className="text-neutral-200">1.0.0 (Build 1)</span></div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: '1. Launch Strategy' },
          { id: 'playstore', label: '2. Google Play Store (TWA)' },
          { id: 'appstore', label: '3. Apple App Store (iOS)' },
          { id: 'metadata', label: '4. ASO & Store Listing' },
          { id: 'legal', label: '5. Privacy & Legal' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Google Play Box */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-amber-400 mb-4">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Google Play Store</h3>
                <div className="text-xs font-mono text-amber-400 mt-0.5">Trusted Web Activity (TWA)</div>
                <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                  Google’s official recommended framework for web apps. Uses Chromium runtime with zero URL bars, full device hardware acceleration, and seamless app updates without re-submitting builds for minor changes.
                </p>
                <div className="mt-4 space-y-2 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>Instant .AAB Android App Bundle generation via Bubblewrap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>Published under Aryan Sood’s Google Play Developer account</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('playstore')}
                className="mt-6 w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Open Google Play Instructions</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

            {/* Apple App Store Box */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-amber-400 mb-4">
                  <Apple className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Apple App Store</h3>
                <div className="text-xs font-mono text-amber-400 mt-0.5">Capacitor iOS Container</div>
                <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                  The industry-standard open-source wrapper created by Ionic. Runs your application inside native WebKit on iOS with zero overhead, compliant with Apple’s App Store Review Guidelines (§4.2 minimum functionality).
                </p>
                <div className="mt-4 space-y-2 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>Direct Xcode project generation with 1 terminal command</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>Published under Aryan Sood’s Apple Developer account</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('appstore')}
                className="mt-6 w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Open Apple Store Instructions</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Publisher Identity Details */}
          <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800">
            <h3 className="text-sm font-bold text-white mb-3">Publisher Registration Checklist</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2">
                <div className="font-semibold text-amber-400">Google Play Developer Console</div>
                <div className="text-neutral-400">One-time $25 registration fee at play.google.com/console</div>
                <div className="text-neutral-300">Account Type: Personal / Organization</div>
                <div className="text-neutral-300">Developer Name: <strong>{creatorName}</strong></div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2">
                <div className="font-semibold text-amber-400">Apple Developer Program</div>
                <div className="text-neutral-400">$99/year enrollment at developer.apple.com</div>
                <div className="text-neutral-300">Individual Enrollment (Seller: <strong>{creatorName}</strong>)</div>
                <div className="text-neutral-300">Apple ID: {creatorEmail}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GOOGLE PLAY STORE */}
      {activeTab === 'playstore' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Google Play TWA Packaging</h3>
                <p className="text-xs text-neutral-400">Build your signed .AAB package using Google’s CLI tool (Bubblewrap).</p>
              </div>
              <button
                onClick={downloadTwaManifest}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download twa-manifest.json</span>
              </button>
            </div>

            {/* Terminal Commands */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>Run these commands on your computer to generate the Android Bundle (.aab):</span>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-amber-300 space-y-2 relative">
                <div># 1. Install Google's official Bubblewrap CLI</div>
                <div className="text-white">npm install -g @bubblewrap/cli</div>
                <div className="mt-2 text-neutral-500"># 2. Initialize project with Aryan Sood's package details</div>
                <div className="text-white">bubblewrap init --manifest="{appUrl}/manifest.webmanifest"</div>
                <div className="mt-2 text-neutral-500"># 3. Build signed production Android App Bundle (.aab)</div>
                <div className="text-white">bubblewrap build</div>
                <button
                  onClick={() =>
                    copyText(
                      `npm install -g @bubblewrap/cli\nbubblewrap init --manifest="${appUrl}/manifest.webmanifest"\nbubblewrap build`,
                      'bw-cmd'
                    )
                  }
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                  title="Copy commands"
                >
                  {copiedKey === 'bw-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Google Play Console Step by Step */}
            <div className="pt-4 border-t border-neutral-800 space-y-3">
              <h4 className="text-sm font-semibold text-white">Google Play Console Upload Steps:</h4>
              <ol className="space-y-2.5 text-xs text-neutral-300 list-decimal list-inside leading-relaxed">
                <li>Log in to <a href="https://play.google.com/console" target="_blank" rel="noreferrer" className="text-amber-400 underline">play.google.com/console</a> with your Google Account.</li>
                <li>Click <strong>Create App</strong> → Title: <strong>Insanely creative 27 — AI Content Studio</strong>.</li>
                <li>Set default language to English, App Type to <strong>App</strong>, and Free/Paid to <strong>Free</strong>.</li>
                <li>Go to <strong>Release &gt; Production</strong> and upload the <code>app-release-bundle.aab</code> file created by Bubblewrap.</li>
                <li>Fill in the <strong>Store Listing</strong> using the pre-written copy in Tab 4 of this portal.</li>
                <li>Add the Privacy Policy URL (found in Tab 5).</li>
                <li>Submit for review. Approval takes 24–48 hours!</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APPLE APP STORE */}
      {activeTab === 'appstore' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Apple App Store (iOS Capacitor)</h3>
                <p className="text-xs text-neutral-400">Package into native Xcode project under Aryan Sood's Apple Developer ID.</p>
              </div>
              <button
                onClick={downloadCapacitorConfig}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download capacitor.config.json</span>
              </button>
            </div>

            {/* Terminal Commands */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>Run these commands on a Mac to generate and open in Xcode:</span>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-amber-300 space-y-2 relative">
                <div># 1. Install Capacitor packages</div>
                <div className="text-white">npm install @capacitor/core @capacitor/ios</div>
                <div className="mt-2 text-neutral-500"># 2. Initialize with Aryan Sood's Bundle Identifier</div>
                <div className="text-white">npx cap init "{appName}" "{appId}"</div>
                <div className="mt-2 text-neutral-500"># 3. Add iOS platform and launch Xcode</div>
                <div className="text-white">npx cap add ios && npx cap open ios</div>
                <button
                  onClick={() =>
                    copyText(
                      `npm install @capacitor/core @capacitor/ios\nnpx cap init "${appName}" "${appId}"\nnpx cap add ios && npx cap open ios`,
                      'cap-cmd'
                    )
                  }
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                  title="Copy commands"
                >
                  {copiedKey === 'cap-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* App Store Connect Step by Step */}
            <div className="pt-4 border-t border-neutral-800 space-y-3">
              <h4 className="text-sm font-semibold text-white">App Store Connect Upload Steps:</h4>
              <ol className="space-y-2.5 text-xs text-neutral-300 list-decimal list-inside leading-relaxed">
                <li>Log in to <a href="https://appstoreconnect.apple.com" target="_blank" rel="noreferrer" className="text-amber-400 underline">appstoreconnect.apple.com</a> with your Apple ID ({creatorEmail}).</li>
                <li>Go to <strong>My Apps</strong> → Click <strong>+ New App</strong>.</li>
                <li>Select <strong>iOS</strong>, Name: <strong>Insanely creative 27</strong>, Bundle ID: <code>{appId}</code>.</li>
                <li>In Xcode on your Mac, select <strong>Product &gt; Archive</strong>, then click <strong>Distribute App</strong> to upload directly to App Store Connect.</li>
                <li>In App Store Connect, select the uploaded build.</li>
                <li>Paste the descriptions and keywords from Tab 4, attach the Privacy Policy from Tab 5, and click <strong>Submit for Review</strong>.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ASO & METADATA */}
      {activeTab === 'metadata' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-4">
            <h3 className="text-base font-bold text-white">App Store Optimization (ASO) & Store Copy</h3>
            <p className="text-xs text-neutral-400">Pre-formatted text compliant with character limits on Google Play and Apple App Store.</p>

            <div className="space-y-4 text-xs">
              {/* App Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-neutral-300">App Name / Title (Max 30 chars)</span>
                  <button
                    onClick={() => copyText("Insanely creative 27", "aso-name")}
                    className="text-amber-400 hover:underline cursor-pointer"
                  >
                    {copiedKey === "aso-name" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white font-mono">
                  Insanely creative 27
                </div>
              </div>

              {/* Subtitle / Short Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-neutral-300">Subtitle / Short Description (Max 80 chars)</span>
                  <button
                    onClick={() => copyText("Turn one idea into an entire content campaign. Posts, reels, posters & copy.", "aso-sub")}
                    className="text-amber-400 hover:underline cursor-pointer"
                  >
                    {copiedKey === "aso-sub" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white font-mono">
                  Turn one idea into an entire content campaign. Posts, reels, posters & copy.
                </div>
              </div>

              {/* Keywords */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-neutral-300">Apple ASO Keywords (Max 100 chars)</span>
                  <button
                    onClick={() => copyText("marketing,ai studio,reels,posters,captions,campaign,content creator,social media,video", "aso-keys")}
                    className="text-amber-400 hover:underline cursor-pointer"
                  >
                    {copiedKey === "aso-keys" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-amber-300 font-mono">
                  marketing,ai studio,reels,posters,captions,campaign,content creator,social media,video
                </div>
              </div>

              {/* Long Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-neutral-300">Full Store Description</span>
                  <button
                    onClick={() =>
                      copyText(
                        `Insanely creative 27 is the AI-powered Content Production Studio created by Aryan Sood.\n\nTransform a single marketing idea into a complete, coordinated multi-channel campaign:\n• Promotional Posters & Print Graphics\n• Instagram Posts & Threads Announcements\n• Multi-Frame Instagram Stories with Interactive Stickers\n• Short Video & Reel Storyboards with On-Screen Captions & Voiceover\n• YouTube Short Packages with Audio Direction\n• Platform Captions & Hashtags for Instagram, LinkedIn, TikTok & X\n• High-Converting Ad Copy Variations (PAS, Benefit, FOMO)\n• Launch Announcement Email Newsletters\n\nUnlike traditional graphic design tools where you have to manually design each canvas from scratch, Insanely creative 27 builds the entire synchronized campaign for you.\n\nCreated and engineered by Aryan Sood. All rights reserved.`,
                        "aso-desc"
                      )
                    }
                    className="text-amber-400 hover:underline cursor-pointer"
                  >
                    {copiedKey === "aso-desc" ? "Copied!" : "Copy Description"}
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto font-sans">
                  {`Insanely creative 27 is the AI-powered Content Production Studio created by Aryan Sood.

Transform a single marketing idea into a complete, coordinated multi-channel campaign:
• Promotional Posters & Print Graphics
• Instagram Posts & Threads Announcements
• Multi-Frame Instagram Stories with Interactive Stickers
• Short Video & Reel Storyboards with On-Screen Captions & Voiceover
• YouTube Short Packages with Audio Direction
• Platform Captions & Hashtags for Instagram, LinkedIn, TikTok & X
• High-Converting Ad Copy Variations (PAS, Benefit, FOMO)
• Launch Announcement Email Newsletters

Unlike traditional graphic design tools where you have to manually design each canvas from scratch, Insanely creative 27 builds the entire synchronized campaign for you.

Created and engineered by Aryan Sood. All rights reserved.`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LEGAL & PRIVACY */}
      {activeTab === 'legal' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-4">
            <h3 className="text-base font-bold text-white">Compliant Privacy Policy & Terms</h3>
            <p className="text-xs text-neutral-400">
              Both Google Play and Apple require a public URL for your Privacy Policy. Use the links below or paste this content on your domain.
            </p>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs">
              <div className="flex items-center justify-between text-neutral-300">
                <span>Privacy Policy URL:</span>
                <span className="font-mono text-amber-400">{appUrl}/privacy</span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span>Terms of Service URL:</span>
                <span className="font-mono text-amber-400">{appUrl}/terms</span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span>Data Controller / Owner:</span>
                <span className="font-medium text-white">{creatorName} ({creatorEmail})</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-neutral-300 space-y-2 leading-relaxed">
              <div className="font-semibold text-white">Summary of Privacy Disclosures:</div>
              <ul className="list-disc list-inside space-y-1 text-neutral-400">
                <li>Campaign text, prompts, and brand kit preferences are stored locally on the user's device.</li>
                <li>Generative requests pass securely through the application server to the Gemini API with no third-party ad tracking.</li>
                <li>No personal data is sold, rented, or shared with data brokers.</li>
                <li>Full intellectual property and copyright of all generated marketing content remains 100% with Aryan Sood and the user.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
