import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  FastForward,
  Rewind,
  Edit3,
  Check,
  Volume2,
  VolumeX,
  ArrowLeftRight,
  Crosshair,
} from 'lucide-react';
import type { PrompterSettings } from '../types';

interface WidescreenPrompterProps {
  text: string;
  settings: PrompterSettings;
  onUpdateSettings: (updater: (prev: PrompterSettings) => PrompterSettings) => void;
  onEditText?: (newText: string) => void;
  isStreaming?: boolean;
}

export const WidescreenPrompter: React.FC<WidescreenPrompterProps> = ({
  text,
  settings,
  onUpdateSettings,
  onEditText,
  isStreaming = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const segment1Ref = useRef<HTMLSpanElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableDraft, setEditableDraft] = useState('');
  const [showControls, setShowControls] = useState(true);
  const [isTtsActive, setIsTtsActive] = useState(false);

  // Flatten active text into strictly a single uninterrupted line
  const activeRawText = isEditing ? editableDraft : text;
  const singleLineText = (activeRawText || 'Waiting for voice prompt or AI response...')
    .replace(/\r?\n+/g, '    ✦    ')
    .trim();

  // Scroll offset with sub-pixel float precision
  const scrollPosRef = useRef<number>(0);
  const lastTimeRef = useRef<number | null>(null);
  const animFrameId = useRef<number | null>(null);
  const hideControlsTimerRef = useRef<any>(null);

  // Reset scroll to start
  const handleResetScroll = useCallback(() => {
    scrollPosRef.current = 0;
    lastTimeRef.current = null;
    if (trackRef.current) {
      trackRef.current.style.transform = 'translateX(0px)';
    }
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    const elem = containerRef.current?.parentElement || document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        onUpdateSettings((prev) => ({
          ...prev,
          animationSpeed: Math.min(10, Math.round((prev.animationSpeed + 0.5) * 10) / 10),
        }));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        onUpdateSettings((prev) => ({
          ...prev,
          animationSpeed: Math.max(0.5, Math.round((prev.animationSpeed - 0.5) * 10) / 10),
        }));
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleResetScroll();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUpdateSettings, handleResetScroll, toggleFullscreen]);

  // Auto-hide controls in fullscreen after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
    hideControlsTimerRef.current = setTimeout(() => {
      if (isFullscreen) {
        setShowControls(false);
      }
    }, 3500);
  };

  // Continuous Right-to-Left Marquee Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      return;
    }

    const track = trackRef.current;
    if (!track) return;

    // Convert animationSpeed (0.5 to 10) to pixels per second
    const pixelsPerSec = Math.pow(settings.animationSpeed, 1.35) * 25;

    const tick = (now: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = now;
      }
      const deltaTime = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const segWidth = segment1Ref.current ? segment1Ref.current.offsetWidth : 0;

      if (settings.scrollDirection === 'left-to-right') {
        scrollPosRef.current -= pixelsPerSec * deltaTime;
        if (segWidth > 0 && scrollPosRef.current <= 0) {
          scrollPosRef.current = segWidth;
        }
      } else {
        scrollPosRef.current += pixelsPerSec * deltaTime;
        if (segWidth > 0 && scrollPosRef.current >= segWidth) {
          scrollPosRef.current = scrollPosRef.current % segWidth;
        }
      }

      track.style.transform = `translateX(-${scrollPosRef.current}px)`;
      animFrameId.current = requestAnimationFrame(tick);
    };

    animFrameId.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isPlaying, settings.animationSpeed, settings.scrollDirection, singleLineText]);

  // Fullscreen change listener
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Text-to-Speech preview
  const toggleTts = () => {
    if (!('speechSynthesis' in window)) return;

    if (isTtsActive) {
      window.speechSynthesis.cancel();
      setIsTtsActive(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setIsTtsActive(false);
      utterance.onerror = () => setIsTtsActive(false);
      window.speechSynthesis.speak(utterance);
      setIsTtsActive(true);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full overflow-hidden transition-colors duration-300 rounded-2xl shadow-2xl border border-white/10 flex flex-col justify-center select-none ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none border-none h-screen'
          : 'h-[150px] sm:h-[320px] md:h-[390px]'
      }`}
      style={{
        backgroundColor: settings.backgroundColor,
      }}
    >
      {/* Edge Vignette / Soft Fades for Left and Right Screen Edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 md:w-36 z-20"
        style={{
          background: `linear-gradient(to right, ${settings.backgroundColor} 15%, transparent 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 md:w-36 z-20"
        style={{
          background: `linear-gradient(to left, ${settings.backgroundColor} 15%, transparent 100%)`,
        }}
      />

      {/* Focus Center Marker (Vertical Reading Cue for Single Line Ticker) */}
      {settings.showCenterMarker && (
        <div className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-between py-4 sm:py-6">
          <div
            className="w-1.5 h-1.5 rounded-full animate-ping"
            style={{ backgroundColor: settings.textColor }}
          />
          <div
            className="w-[1.5px] h-full opacity-20 my-1"
            style={{
              background: `linear-gradient(to bottom, transparent, ${settings.textColor}, transparent)`,
            }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: settings.textColor }}
          />
        </div>
      )}

      {/* Single-Line Marquee Track */}
      <div className="relative w-full overflow-hidden py-3 sm:py-4 flex items-center">
        {isEditing ? (
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 z-30">
            <input
              type="text"
              value={editableDraft}
              onChange={(e) => setEditableDraft(e.target.value)}
              placeholder="Edit single line response..."
              className="w-full bg-black/60 text-inherit border-2 border-indigo-500 rounded-xl px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-xl md:text-2xl font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
              style={{
                color: settings.textColor,
                fontFamily: settings.fontFamily,
              }}
            />
          </div>
        ) : (
          <div
            ref={trackRef}
            className="flex whitespace-nowrap will-change-transform items-center"
            style={{
              fontFamily: settings.fontFamily,
              fontSize: `clamp(20px, ${settings.fontSize}px, 14vw)`,
              lineHeight: settings.lineHeight,
              color: settings.textColor,
              letterSpacing: `${settings.letterSpacing}px`,
              fontWeight: settings.fontWeight || '700',
              transform: settings.mirrorMode ? 'scaleX(-1)' : 'none',
              textShadow: settings.enableGlow
                ? `0 0 20px ${settings.textColor}80`
                : 'none',
            }}
          >
            {/* Primary Segment */}
            <span ref={segment1Ref} className="inline-flex items-center gap-8 sm:gap-12 pr-8 sm:pr-12">
              <span>{singleLineText}</span>
              <span className="opacity-30">✦ ✦ ✦</span>
            </span>

            {/* Continuous Seamless Loop Segment 2 */}
            <span className="inline-flex items-center gap-8 sm:gap-12 pr-8 sm:pr-12" aria-hidden="true">
              <span>{singleLineText}</span>
              <span className="opacity-30">✦ ✦ ✦</span>
            </span>

            {/* Continuous Seamless Loop Segment 3 */}
            <span className="inline-flex items-center gap-8 sm:gap-12 pr-8 sm:pr-12" aria-hidden="true">
              <span>{singleLineText}</span>
              <span className="opacity-30">✦ ✦ ✦</span>
            </span>
          </div>
        )}
      </div>

      {/* Top Banner Details & Streaming Indicator */}
      <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-6 z-20 flex items-center justify-between pointer-events-none gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden">
          <span
            className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase bg-black/60 backdrop-blur border border-white/15 flex items-center gap-1.5 shrink-0"
            style={{ color: settings.textColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden xs:inline">MARQUEE •</span> R-TO-L
          </span>
          {isStreaming && (
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 backdrop-blur animate-pulse truncate">
              STREAMING...
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {settings.mirrorMode && (
            <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              MIRROR
            </span>
          )}
          <span
            className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase bg-black/60 backdrop-blur border border-white/15"
            style={{ color: settings.textColor }}
          >
            {settings.fontSize}PX • {settings.animationSpeed.toFixed(1)}X
          </span>
        </div>
      </div>

      {/* Responsive Floating HUD Controls Overlay */}
      <div
        className={`absolute bottom-3 sm:bottom-6 inset-x-0 z-30 flex justify-center px-2 sm:px-4 transition-all duration-300 pointer-events-none ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="pointer-events-auto max-w-[calc(100vw-20px)] sm:max-w-none overflow-x-auto no-scrollbar flex items-center gap-1.5 sm:gap-2 md:gap-3 bg-slate-900/95 backdrop-blur-xl border border-white/15 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-2xl text-slate-100">
          {/* Rewind Button */}
          <button
            onClick={handleResetScroll}
            title="Rewind to start (R)"
            className="p-2 sm:p-2.5 rounded-xl hover:bg-white/10 active:scale-95 transition text-slate-300 hover:text-white shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Slower Speed */}
          <button
            onClick={() =>
              onUpdateSettings((prev) => ({
                ...prev,
                animationSpeed: Math.max(0.5, Math.round((prev.animationSpeed - 0.5) * 10) / 10),
              }))
            }
            title="Slower speed (Down Arrow)"
            className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 active:scale-95 transition text-slate-300 hover:text-white shrink-0"
          >
            <Rewind className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Primary Play / Pause Button */}
          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            title={isPlaying ? 'Pause scroll (Space)' : 'Play scroll (Space)'}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl font-semibold shadow-lg transition-all active:scale-95 shrink-0 ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                <span className="text-[11px] sm:text-xs uppercase tracking-wider font-bold">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                <span className="text-[11px] sm:text-xs uppercase tracking-wider font-bold">Scroll</span>
              </>
            )}
          </button>

          {/* Faster Speed */}
          <button
            onClick={() =>
              onUpdateSettings((prev) => ({
                ...prev,
                animationSpeed: Math.min(10, Math.round((prev.animationSpeed + 0.5) * 10) / 10),
              }))
            }
            title="Faster speed (Up Arrow)"
            className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 active:scale-95 transition text-slate-300 hover:text-white shrink-0"
          >
            <FastForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Current Speed Badge */}
          <div className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white/5 border border-white/10 font-mono text-[10px] sm:text-xs text-slate-300 shrink-0">
            <span className="font-bold text-white">{settings.animationSpeed.toFixed(1)}x</span>
          </div>

          <div className="h-4 sm:h-5 w-[1px] bg-white/10 mx-0.5 sm:mx-1 shrink-0" />

          {/* Direction Toggle */}
          <button
            onClick={() =>
              onUpdateSettings((prev) => ({
                ...prev,
                scrollDirection:
                  prev.scrollDirection === 'right-to-left'
                    ? 'left-to-right'
                    : 'right-to-left',
              }))
            }
            title={`Scroll Direction: ${
              settings.scrollDirection === 'right-to-left'
                ? 'Right to Left'
                : 'Left to Right'
            }`}
            className="p-2 sm:p-2.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition shrink-0"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Center Marker Toggle */}
          <button
            onClick={() =>
              onUpdateSettings((prev) => ({
                ...prev,
                showCenterMarker: !prev.showCenterMarker,
              }))
            }
            title="Toggle Center Focus Marker"
            className={`p-2 sm:p-2.5 rounded-xl transition shrink-0 ${
              settings.showCenterMarker
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'hover:bg-white/10 text-slate-400'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Edit Text Toggle */}
          <button
            onClick={() => {
              if (isEditing) {
                if (onEditText) {
                  onEditText(editableDraft);
                }
                setIsEditing(false);
              } else {
                setEditableDraft(singleLineText);
                setIsEditing(true);
              }
            }}
            title={isEditing ? 'Save and Resume' : 'Edit Marquee Text'}
            className={`p-2 sm:p-2.5 rounded-xl transition shrink-0 ${
              isEditing
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'hover:bg-white/10 text-slate-400'
            }`}
          >
            {isEditing ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Voice Speech (TTS) */}
          <button
            onClick={toggleTts}
            title={isTtsActive ? 'Stop Voice Speech' : 'Listen via Voice Speech (TTS)'}
            className={`p-2 sm:p-2.5 rounded-xl transition shrink-0 ${
              isTtsActive
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                : 'hover:bg-white/10 text-slate-400'
            }`}
          >
            {isTtsActive ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Widescreen Fullscreen (F)"
            className="p-2 sm:p-2.5 rounded-xl hover:bg-white/10 active:scale-95 transition text-slate-300 hover:text-white shrink-0"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
