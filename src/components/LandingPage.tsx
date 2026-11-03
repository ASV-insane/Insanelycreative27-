import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle2,
  Share2,
  Film,
  FileText,
  Mail,
  Zap,
  Play,
  RotateCcw,
  Sliders,
  ChevronRight,
  Target,
} from 'lucide-react';
import { Campaign } from '../types/campaign';
import { PWAInstallButton } from './PWAInstallButton';

interface LandingPageProps {
  onStartCampaign: () => void;
  onExploreDemo: () => void;
  sampleCampaign: Campaign;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartCampaign,
  onExploreDemo,
  sampleCampaign,
}) => {
  return (
    <div className="min-h-screen bg-[#090a0f] text-neutral-100 flex flex-col selection:bg-lime-400 selection:text-neutral-950">
      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <header className="flex items-center justify-between gap-8 px-8 py-5 border-b border-neutral-800/80 sticky top-0 bg-[#090a0f]/90 backdrop-blur-md z-40">
        {/* Zone 1: Brand Wordmark with new logo */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="/logo.png"
            alt="Insanely creative 27"
            className="w-9 h-9 rounded-xl object-contain shadow-md shadow-lime-400/20 border border-lime-400/20 bg-neutral-900"
          />
          <span className="font-display font-bold text-lg tracking-tight text-white whitespace-nowrap">
            Insanely creative <span className="text-lime-400 font-black">27</span>
          </span>
        </div>

        {/* Zone 2: 4 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-400">
          <a href="#how-it-works" className="hover:text-white transition-colors whitespace-nowrap">
            How It Works
          </a>
          <a href="#comparison" className="hover:text-white transition-colors whitespace-nowrap">
            Why It’s Different
          </a>
          <a href="#assets" className="hover:text-white transition-colors whitespace-nowrap">
            Generated Package
          </a>
          <a href="#sample" className="hover:text-white transition-colors whitespace-nowrap">
            Live Preview
          </a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <PWAInstallButton />
          <button
            onClick={onStartCampaign}
            className="px-4 py-2 text-xs font-bold text-neutral-950 bg-lime-400 hover:bg-lime-300 rounded-lg transition-all shadow-md shadow-lime-400/15 whitespace-nowrap cursor-pointer active:scale-95"
          >
            Create a Campaign
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 max-w-6xl mx-auto text-center">
        {/* Ambient background glow matching mint-to-lime logo */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/15 via-lime-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        {/* Quiet Kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 mb-8 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
          <span>AI-Powered Content Production Studio</span>
          <span className="text-neutral-600">·</span>
          <span className="text-lime-400 font-medium">Not a Canva clone</span>
        </div>

        {/* Core Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] text-balance">
          Turn one idea into an entire content campaign.
        </h1>

        {/* Supporting Text */}
        <p className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Tell AI what you're promoting. Get the posts, posters, videos, captions and copy to launch it.
        </p>

        {/* Primary and Secondary CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartCampaign}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold text-sm tracking-wide transition-all shadow-xl shadow-lime-400/20 flex items-center justify-center gap-2 cursor-pointer group active:scale-95"
          >
            <span>Create a Campaign</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          <a
            href="#comparison"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-lime-400 fill-lime-400" />
            <span>See How It Works</span>
          </a>
        </div>

        {/* Single Prompt Showcase Visual */}
        <div className="mt-14 max-w-3xl mx-auto p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 shadow-2xl backdrop-blur-sm text-left">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-3 pb-3 border-b border-neutral-800">
            <span className="font-mono text-lime-400 uppercase tracking-wider text-[11px] font-semibold">
              Single Natural Language Prompt
            </span>
            <span>Takes 5 seconds to type</span>
          </div>
          <p className="text-sm sm:text-base text-neutral-200 font-mono bg-neutral-950/80 p-4 rounded-xl border border-neutral-800/80 leading-relaxed">
            “I’m launching a new café called <span className="text-lime-300 font-bold">Moon Brew</span>. Grand opening this Saturday. Target audience is college students.”
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400 pt-2">
            <div className="flex items-center gap-2 text-neutral-300">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span>AI synthesizes 8 coordinated launch assets in seconds</span>
            </div>
            <button
              onClick={onExploreDemo}
              className="text-xs font-semibold text-lime-400 hover:text-lime-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Live Demo Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 13: Homepage Differentiation & Comparison */}
      <section id="comparison" className="py-20 px-6 border-t border-neutral-900 bg-neutral-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-mono uppercase tracking-wider text-lime-400 mb-2 font-semibold">
              Fundamental Paradigm Shift
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Why Insanely creative 27 is different
            </h2>
            <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
              Graphic editors force you to design 10 separate files from scratch. We build the entire synchronized campaign for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Traditional Tools Card */}
            <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-3">
                  Traditional Design Tools
                </div>
                <h3 className="text-xl font-bold text-neutral-300">
                  “Choose a template → design everything yourself.”
                </h3>
                <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                  You start with blank canvases or generic disconnected templates. You manually write every caption, drag every text box, re-format colors, and spend hours struggling to keep brand consistency across Instagram, posters, and video.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3 text-xs text-neutral-400">
                    <span className="text-red-400 font-bold">✕</span>
                    <span>No marketing strategy or target audience awareness</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-neutral-400">
                    <span className="text-red-400 font-bold">✕</span>
                    <span>Disconnected assets that don't match in tone or messaging</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-neutral-400">
                    <span className="text-red-400 font-bold">✕</span>
                    <span>Tedious manual layout work for every single social network</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800/60 text-xs text-neutral-500 font-mono">
                Average creation time: 6–8 hours per campaign
              </div>
            </div>

            {/* Insanely creative 27 Card */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-lime-500/10 via-emerald-500/5 to-transparent border border-lime-500/30 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-lime-400 mb-3 flex items-center gap-2 font-semibold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Insanely creative 27</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  “Describe your goal → AI builds the campaign.”
                </h3>
                <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                  Enter your launch objective once. The studio generates a coordinated marketing campaign across poster, feed post, multi-frame story, short video storyboard, captions, ad variants, and launch email.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3 text-xs text-neutral-200">
                    <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                    <span>Synchronized brand voice, colors, typography, and core hooks</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-neutral-200">
                    <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                    <span>Natural language editing: "Make it Gen Z", "Shorten headline"</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-neutral-200">
                    <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                    <span>Cross-asset Campaign Memory keeps everything cohesive</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-lime-500/20 flex items-center justify-between text-xs text-lime-300 font-mono">
                <span>Average creation time: 30 seconds</span>
                <button
                  onClick={onStartCampaign}
                  className="font-sans font-bold text-lime-400 hover:text-lime-300 underline underline-offset-4 cursor-pointer"
                >
                  Try It Free →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: The Coordinated Content Package */}
      <section id="assets" className="py-20 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <div className="text-xs font-mono uppercase tracking-wider text-lime-400 mb-2 font-semibold">
            Complete Launch Package
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            8 Coordinated Assets from a Single Prompt
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto">
            Every piece is designed to tell the same story across physical print, social feeds, short video algorithms, and customer inboxes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-lime-400 mb-4">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white">Promotional Poster</h4>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Printable high-impact layout with custom typography, date ribbons, and visual direction.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400 mb-4">
              <Share2 className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white">Social Feed Post</h4>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Square / portrait visual graphics with compelling hook, badge, and community caption.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-lime-400 mb-4">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white">Instagram Story Flow</h4>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Multi-frame sequence with polls, countdown timers, and swipe-up CTAs for high retention.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-lime-400 mb-4">
              <Film className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white">Short Video & Reel</h4>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Hook, scene-by-scene storyboard, voiceover script, and on-screen text with music guidance.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-lime-400 mb-4">
              <Play className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white">YouTube Short</h4>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Algorithm-optimized short concept with punchy opening, audio foley notes, and pinned comment.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-lime-400 mb-4">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white">Captions & Hashtags</h4>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Platform-tailored copy for Instagram, LinkedIn, TikTok & X, with primary and niche tags.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-lime-400 mb-4">
              <Target className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white">Ad Copy Variations</h4>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Problem-Agitate-Solve, Benefit-Driven, and FOMO variants ready for paid performance.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-lime-400 mb-4">
              <Mail className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white">Email Announcement</h4>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              High-converting launch newsletter with 3 subject lines, preview text, and RSVP actions.
            </p>
          </div>
        </div>
      </section>

      {/* Live Sample Showcase Section */}
      <section id="sample" className="py-20 px-6 bg-neutral-950/70 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-lime-400 mb-2">
                Real Campaign Output
              </div>
              <h2 className="text-3xl font-display font-bold text-white tracking-tight">
                Inspect: Moon Brew Grand Opening
              </h2>
              <p className="mt-2 text-neutral-400 text-sm max-w-lg">
                Created in 28 seconds from the prompt: “I’m launching a new café called Moon Brew this Saturday for college students.”
              </p>
            </div>
            <button
              onClick={onExploreDemo}
              className="px-5 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Open in Full Studio Workspace</span>
              <ArrowRight className="w-3.5 h-3.5 text-lime-400" />
            </button>
          </div>

          {/* Interactive Teaser Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Poster Card */}
            <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-4">
                <span className="font-semibold text-neutral-200">Promotional Poster</span>
                <span className="font-mono text-[11px] text-lime-400">3:4 Canvas</span>
              </div>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/80 flex flex-col justify-between p-6">
                <img
                  src={sampleCampaign.assets.poster.imageUrl}
                  alt="Moon Brew Poster Preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="relative z-10 flex justify-between items-start">
                  <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-amber-400 text-neutral-950 font-bold uppercase">
                    {sampleCampaign.assets.poster.badgeText}
                  </span>
                </div>
                <div className="relative z-10 text-white">
                  <div className="text-[11px] font-mono tracking-widest text-amber-300 uppercase">
                    {sampleCampaign.assets.poster.subheadline}
                  </div>
                  <h3 className="text-xl font-display font-black leading-tight mt-1 text-white">
                    {sampleCampaign.assets.poster.headline}
                  </h3>
                  <p className="text-[11px] text-neutral-300 mt-2 line-clamp-2">
                    {sampleCampaign.assets.poster.supportingText}
                  </p>
                </div>
              </div>
            </div>

            {/* Short Reel Storyboard Card */}
            <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-4">
                <span className="font-semibold text-neutral-200">Short Video / Reel Storyboard</span>
                <span className="font-mono text-[11px] text-lime-400">22s · 4 Scenes</span>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/80 mb-3">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">The Hook</div>
                <p className="text-xs font-medium text-amber-300 mt-1 italic">
                  "{sampleCampaign.assets.reel.hook}"
                </p>
              </div>
              <div className="space-y-2 flex-1">
                {sampleCampaign.assets.reel.scenes.slice(0, 3).map((scene) => (
                  <div
                    key={scene.id}
                    className="p-3 rounded-lg bg-neutral-950/50 border border-neutral-800/60 text-xs flex items-start gap-3"
                  >
                    <span className="font-mono text-lime-400 text-[11px] font-bold shrink-0">
                      0{scene.sceneNumber}
                    </span>
                    <div className="overflow-hidden">
                      <div className="font-semibold text-neutral-200 truncate">{scene.onScreenText}</div>
                      <div className="text-[11px] text-neutral-400 truncate mt-0.5">{scene.voiceover}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
                <span>Music: Lo-fi jazz beat</span>
                <span className="font-mono text-lime-400">9:16 Vertical</span>
              </div>
            </div>

            {/* Copy & Email Snapshot */}
            <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-4">
                  <span className="font-semibold text-neutral-200">Copy & Email Announcement</span>
                  <span className="font-mono text-[11px] text-lime-400">Synchronized</span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase">Ad Copy Headline</div>
                    <div className="text-xs font-semibold text-white mt-1">
                      {sampleCampaign.assets.adCopy.variants[0].headline}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1 line-clamp-2">
                      {sampleCampaign.assets.adCopy.variants[0].primaryText}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase">Announcement Email</div>
                    <div className="text-xs font-semibold text-amber-300 mt-1 truncate">
                      {sampleCampaign.assets.email.subjectLines[0]}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1 line-clamp-2">
                      {sampleCampaign.assets.email.bodyParagraphs[0]}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={onExploreDemo}
                className="mt-6 w-full py-2.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Open Full Campaign Matrix</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <footer className="mt-auto py-16 px-6 border-t border-neutral-900 bg-[#07080b] text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Ready to produce your next campaign?
          </h2>
          <p className="mt-3 text-neutral-400 text-sm">
            No design experience required. Tell the AI your idea and get the complete launch package.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={onStartCampaign}
              className="px-6 py-3 rounded-xl bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold text-xs tracking-wide transition-all shadow-lg shadow-lime-400/20 cursor-pointer"
            >
              Create a Campaign Now
            </button>
          </div>
          <div className="mt-12 text-xs text-neutral-400 space-y-1">
            <div className="font-semibold text-neutral-300">
              Designed & Engineered by Aryan Sood · All Rights Reserved
            </div>
            <div className="text-neutral-500 text-[11px]">
              Insanely creative 27 Content Production Studio · Google Play & Apple App Store Ready (TWA & Capacitor)
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
