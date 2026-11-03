import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Download,
  Film,
  Music,
  Clock,
  Sparkles,
  Maximize2,
  Check,
  Wand2,
} from 'lucide-react';
import { ShortVideoAsset, YouTubeShortAsset, VideoScene, BrandKit } from '../types/campaign';
import { editAssetWithAi } from '../services/apiClient';

interface VideoStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoType: 'reel' | 'youtubeShort';
  videoAsset: ShortVideoAsset | YouTubeShortAsset;
  brandKit: BrandKit;
  onSave: (updated: any) => void;
}

export const VideoStudioModal: React.FC<VideoStudioModalProps> = ({
  isOpen,
  onClose,
  videoType,
  videoAsset,
  brandKit,
  onSave,
}) => {
  if (!isOpen) return null;

  const isReel = videoType === 'reel';
  const [hook, setHook] = useState(videoAsset.hook);
  const [scenes, setScenes] = useState<VideoScene[]>(videoAsset.scenes || []);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [musicSuggestion, setMusicSuggestion] = useState(
    isReel ? (videoAsset as ShortVideoAsset).musicSuggestion : 'Punchy dynamic beat'
  );

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Web Audio ambient synthesizer
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Calculate total duration
  const totalDuration = scenes.reduce((sum, s) => sum + (s.durationSeconds || 4), 0);

  // Animation player loop
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 0.1;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }

          // Compute which scene is active based on accumulated durations
          let accumulated = 0;
          for (let i = 0; i < scenes.length; i++) {
            accumulated += scenes[i].durationSeconds || 4;
            if (next <= accumulated) {
              setCurrentSceneIndex(i);
              break;
            }
          }

          return next;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isPlaying, scenes, totalDuration]);

  // Handle Play toggle
  const togglePlay = () => {
    if (!isPlaying && elapsedSeconds >= totalDuration) {
      setElapsedSeconds(0);
      setCurrentSceneIndex(0);
    }

    // Play subtle audio vibe when playing
    if (!isPlaying && !isAudioMuted) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(220, ctx.currentTime);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          setTimeout(() => {
            try {
              osc.stop();
            } catch (e) {}
          }, 300);
        }
      } catch (e) {}
    }

    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setElapsedSeconds(0);
    setCurrentSceneIndex(0);
  };

  const handleUpdateScene = (idx: number, field: keyof VideoScene, value: any) => {
    const updated = [...scenes];
    updated[idx] = { ...updated[idx], [field]: value };
    setScenes(updated);
  };

  const handleAddScene = () => {
    const newScene: VideoScene = {
      id: `scene-${Date.now()}`,
      sceneNumber: scenes.length + 1,
      visualDescription: 'Kinetic product highlight or call to action clip',
      onScreenText: 'Claim your launch pass today.',
      voiceover: 'Link is in the bio. Grab yours before opening day.',
      durationSeconds: 4,
      cameraOrTransition: 'Quick snap zoom',
    };
    setScenes([...scenes, newScene]);
  };

  const handleDeleteScene = (idx: number) => {
    if (scenes.length <= 1) return;
    const filtered = scenes
      .filter((_, i) => i !== idx)
      .map((s, i) => ({ ...s, sceneNumber: i + 1 }));
    setScenes(filtered);
    if (currentSceneIndex >= filtered.length) {
      setCurrentSceneIndex(Math.max(0, filtered.length - 1));
    }
  };

  const handleSaveAndClose = () => {
    onSave({
      ...videoAsset,
      hook,
      scenes,
      totalDurationSeconds: Math.round(totalDuration),
      musicSuggestion,
      aspectRatio,
    });
    onClose();
  };

  const handleExportStoryboard = () => {
    const content = `# Storyboard: ${isReel ? 'Instagram Reel' : 'YouTube Short'}
**Brand**: ${brandKit.brandName}
**Hook**: "${hook}"
**Aspect Ratio**: ${aspectRatio}
**Total Duration**: ${Math.round(totalDuration)}s
**Music / Mood**: ${musicSuggestion}

---

${scenes
  .map(
    (s) => `### Scene ${s.sceneNumber} (${s.durationSeconds}s)
- **Visual Description**: ${s.visualDescription}
- **Camera / Transition**: ${s.cameraOrTransition}
- **On-Screen Text**: "${s.onScreenText}"
- **Voiceover**: "${s.voiceover}"`
  )
  .join('\n\n')}

---
Ready for direct production or camera capture.
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `storyboard-${isReel ? 'reel' : 'short'}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeScene = scenes[currentSceneIndex] || scenes[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-6xl h-[92vh] rounded-2xl bg-[#0e1017] border border-neutral-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-neutral-800/80 flex items-center justify-between shrink-0 bg-[#0c0d13]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-lime-400 text-neutral-950 font-bold uppercase">
              {isReel ? 'Instagram Reel & TikTok' : 'YouTube Short'}
            </span>
            <span className="text-sm font-semibold text-white">Storyboard & Video Studio</span>
            <span className="text-xs text-neutral-500 font-mono">
              · Total: {Math.round(totalDuration)}s
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportStoryboard}
              className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-lime-400" />
              <span>Export Script</span>
            </button>

            <button
              onClick={handleSaveAndClose}
              className="px-4 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-neutral-950 text-xs font-bold transition-all cursor-pointer shadow-md shadow-lime-400/10"
            >
              Done & Save
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Workspace Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Video Player Simulation */}
          <div className="w-[420px] bg-[#090a0f] border-r border-neutral-800 p-6 flex flex-col justify-between shrink-0">
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-3">
                <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-lime-400" />
                  <span>Interactive Preview</span>
                </span>
                <span className="font-mono text-[11px] text-lime-400">
                  {elapsedSeconds.toFixed(1)}s / {totalDuration.toFixed(1)}s
                </span>
              </div>

              {/* Player Viewport */}
              <div
                style={{
                  aspectRatio: aspectRatio === '9:16' ? '9/16' : aspectRatio === '1:1' ? '1/1' : '16/9',
                }}
                className="w-full max-h-[460px] mx-auto rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 relative flex flex-col justify-between p-5 shadow-2xl"
              >
                {/* Background Visual representation */}
                {activeScene?.imageUrl ? (
                  <img
                    src={activeScene.imageUrl}
                    alt={activeScene.onScreenText}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black" />
                )}

                {/* Dark Vignette Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 pointer-events-none" />

                {/* Top Scene Marker */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-lime-400 border border-neutral-700/60 uppercase">
                    SCENE 0{currentSceneIndex + 1} / 0{scenes.length}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-300">
                    {activeScene?.durationSeconds}s
                  </span>
                </div>

                {/* Center Dynamic On-Screen Captions */}
                <div className="relative z-10 text-center px-2 my-auto">
                  <div className="inline-block p-3 rounded-xl bg-black/70 backdrop-blur-md border border-neutral-800/80 shadow-lg animate-in zoom-in-95 duration-200">
                    <h3 className="text-base sm:text-lg font-display font-black text-white tracking-tight leading-snug">
                      {activeScene?.onScreenText}
                    </h3>
                  </div>
                </div>

                {/* Bottom Voiceover Subtitle Strip */}
                <div className="relative z-10 text-left bg-black/75 backdrop-blur-md p-3 rounded-xl border border-neutral-800/80 space-y-1">
                  <div className="text-[10px] font-mono text-lime-400 uppercase tracking-wider flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    <span>Voiceover Audio Track</span>
                  </div>
                  <p className="text-xs text-neutral-200 line-clamp-2 leading-relaxed">
                    "{activeScene?.voiceover}"
                  </p>
                </div>
              </div>
            </div>

            {/* Playback Controls Strip */}
            <div className="mt-4 pt-3 border-t border-neutral-800/80 space-y-3">
              {/* Progress Bar */}
              <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${(elapsedSeconds / totalDuration) * 100}%` }}
                  className="bg-lime-400 h-full transition-all duration-100"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold transition-all cursor-pointer shadow-md shadow-lime-400/10"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-neutral-950" /> : <Play className="w-4 h-4 fill-neutral-950" />}
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAudioMuted(!isAudioMuted)}
                    className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title={isAudioMuted ? 'Unmute' : 'Mute'}
                  >
                    {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-lime-400" />}
                  </button>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {Math.round(elapsedSeconds)}s / {Math.round(totalDuration)}s
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Scene-by-Scene Storyboard Editor */}
          <div className="flex-1 bg-[#0e1017] p-6 overflow-y-auto space-y-6">
            {/* Video Hook & Sound Direction */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-200">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                  <span>Opening Hook (First 3 Seconds)</span>
                </span>
                <span className="text-[11px] font-mono text-neutral-400">Critical for Retention</span>
              </div>
              <input
                type="text"
                value={hook}
                onChange={(e) => setHook(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none font-medium"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1 flex items-center gap-1">
                    <Music className="w-3 h-3 text-lime-400" />
                    <span>Music & Vibe</span>
                  </label>
                  <input
                    type="text"
                    value={musicSuggestion}
                    onChange={(e) => setMusicSuggestion(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1 flex items-center gap-1">
                    <Maximize2 className="w-3 h-3 text-lime-400" />
                    <span>Aspect Ratio</span>
                  </label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white outline-none"
                  >
                    <option value="9:16">9:16 Vertical (Reel / Shorts)</option>
                    <option value="1:1">1:1 Square</option>
                    <option value="16:9">16:9 Landscape</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Scenes List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Storyboard Scenes</h3>
                  <p className="text-xs text-neutral-400">
                    Edit visual cues, durations, and on-screen typography.
                  </p>
                </div>
                <button
                  onClick={handleAddScene}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-lime-400" />
                  <span>Add Scene</span>
                </button>
              </div>

              <div className="space-y-4">
                {scenes.map((scene, idx) => (
                  <div
                    key={scene.id}
                    className={`p-4 rounded-xl border transition-all ${
                      currentSceneIndex === idx
                        ? 'bg-neutral-900/90 border-lime-400/50 shadow-md'
                        : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-800">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-neutral-800 text-lime-400">
                          SCENE 0{scene.sceneNumber}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {scene.cameraOrTransition || 'Cut'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                          <Clock className="w-3 h-3" />
                          <input
                            type="number"
                            min="1"
                            max="15"
                            value={scene.durationSeconds}
                            onChange={(e) =>
                              handleUpdateScene(idx, 'durationSeconds', Number(e.target.value) || 3)
                            }
                            className="w-10 px-1 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-center text-white text-xs font-mono"
                          />
                          <span>s</span>
                        </div>

                        {scenes.length > 1 && (
                          <button
                            onClick={() => handleDeleteScene(idx)}
                            className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
                            title="Delete scene"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">
                          On-Screen Kinetic Text
                        </label>
                        <input
                          type="text"
                          value={scene.onScreenText}
                          onChange={(e) => handleUpdateScene(idx, 'onScreenText', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">
                          Visual Camera Action
                        </label>
                        <input
                          type="text"
                          value={scene.visualDescription}
                          onChange={(e) => handleUpdateScene(idx, 'visualDescription', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-3 text-xs">
                      <label className="block text-[11px] text-neutral-400 mb-1">
                        Voiceover Audio Script
                      </label>
                      <textarea
                        rows={2}
                        value={scene.voiceover}
                        onChange={(e) => handleUpdateScene(idx, 'voiceover', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-lime-400 outline-none resize-none font-sans"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
