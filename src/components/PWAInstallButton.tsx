import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Apple } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA on the home screen, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs tracking-wide transition-all shadow-md shadow-amber-400/10 cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
      >
        <Smartphone className="w-3.5 h-3.5 text-neutral-950" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Apple className="w-3.5 h-3.5 text-neutral-300" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#0e1017] border border-neutral-800 p-6 shadow-2xl text-left space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Apple className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 space-y-2">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-neutral-950 font-bold text-[11px] flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>Tap the <strong>Share</strong> button at the bottom of Safari.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-neutral-950 font-bold text-[11px] flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-neutral-950 font-bold text-[11px] flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>Confirm and open Insanely creative 27 like a native app.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop / standard ambient install button
  return (
    <button
      onClick={() => {
        // Trigger browser native install hint
        alert("To install on desktop or Android: tap your browser menu (⋮ or Share) and select 'Install app' or 'Add to Home screen'.");
      }}
      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
    >
      <Smartphone className="w-3.5 h-3.5 text-amber-400" />
      <span>Install App</span>
    </button>
  );
};
