import React, { useState, useEffect } from 'react';
import { Settings, Cpu, HardDrive, ShieldCheck, RefreshCw, Check } from 'lucide-react';

interface SettingsViewProps {
  onResetDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetDemoData }) => {
  const [serverHealth, setServerHealth] = useState<any>(null);
  const [isResetDone, setIsResetDone] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setServerHealth(data))
      .catch(() => setServerHealth({ status: 'offline', hasGeminiKey: false }));
  }, []);

  const handleReset = () => {
    onResetDemoData();
    setIsResetDone(true);
    setTimeout(() => setIsResetDone(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-800">
        <div className="text-xs font-mono uppercase tracking-wider text-lime-400 mb-1">
          Configuration & Verification
        </div>
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">
          Studio Settings
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Manage AI engine status, local workspace persistence, store credentials, and creator verification.
        </p>
      </div>

      <div className="space-y-6">
        {/* Creator & Store License Attribution Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-lime-400/10 via-neutral-900/50 to-neutral-900/40 border border-lime-400/30 space-y-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-lime-400" />
            <h3 className="text-sm font-bold text-white">Verified Sole Ownership & Publishing Rights</h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            All intellectual property, code, trademarks, and store listings belong exclusively to <strong className="text-white">Aryan Sood</strong> (<a href="mailto:aryansood2704@gmail.com" className="text-lime-400 underline">aryansood2704@gmail.com</a>). Fully configured for Google Play Console and Apple App Store deployment.
          </p>
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800 text-lime-300">
              Publisher: Aryan Sood
            </span>
            <span className="px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800 text-neutral-400">
              Bundle ID: com.aryansood.creative27
            </span>
            <span className="px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800 text-neutral-400">
              License: Sole Proprietary
            </span>
          </div>
        </div>

        {/* Engine Status */}
        <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-4">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-lime-400" />
            <h3 className="text-sm font-bold text-white">AI Generation Architecture</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-neutral-400 font-medium">Model Engine</div>
              <div className="text-sm font-bold font-mono text-white mt-1">gemini-3.8-flash</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                Fast multi-turn campaign reasoning & copywriting
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-neutral-400 font-medium">Server Proxy Route</div>
              <div className="text-sm font-bold font-mono text-emerald-400 mt-1">
                {serverHealth?.status === 'ok' ? 'Connected (/api/campaign/*)' : 'Standby / Local Fallback'}
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                Full-stack Node/Express with Vite middlewares & Security Headers
              </div>
            </div>
          </div>
        </div>

        {/* Demo Data Management */}
        <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-4">
          <div className="flex items-center gap-2.5">
            <HardDrive className="w-4 h-4 text-lime-400" />
            <h3 className="text-sm font-bold text-white">Workspace Storage & Demo Data</h3>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">
            All your campaigns and brand kits are persisted locally in your browser’s storage. You can reload the sample “Moon Brew — Grand Opening” campaign anytime.
          </p>

          <div>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              {isResetDone ? <Check className="w-4 h-4 text-lime-400" /> : <RefreshCw className="w-4 h-4 text-lime-400" />}
              <span>{isResetDone ? 'Demo Campaign Restored!' : 'Restore Moon Brew Demo Campaign'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
