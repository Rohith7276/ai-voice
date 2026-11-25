import React from 'react';
import {
  Sliders,
  Type,
  Palette,
  Gauge,
  MoveVertical,
  Sparkles,
  ArrowRightLeft,
  Crosshair,
  Zap,
} from 'lucide-react';
import type { FontFamily, PrompterSettings, ScrollDirection } from '../types';
import { COLOR_PALETTES, PRESET_THEMES } from '../constants/presets';

interface StylingControlsProps {
  settings: PrompterSettings;
  onChange: (updater: (prev: PrompterSettings) => PrompterSettings) => void;
}

export const StylingControls: React.FC<StylingControlsProps> = ({ settings, onChange }) => {
  return (
    <div className="w-full bg-slate-900/70 border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Single-Line Marquee & Typography Controls
          </h3>
        </div>
        <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          Right-to-Left Ticker
        </span>
      </div>

      {/* 1-Click Preset Themes */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Marquee Presets</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {PRESET_THEMES.map((theme) => {
            const isSelected =
              settings.backgroundColor === theme.bg &&
              settings.textColor === theme.text &&
              settings.fontSize === theme.fontSize;
            return (
              <button
                key={theme.name}
                onClick={() =>
                  onChange((prev) => ({
                    ...prev,
                    backgroundColor: theme.bg,
                    textColor: theme.text,
                    fontSize: theme.fontSize,
                    lineHeight: theme.lineHeight,
                    animationSpeed: theme.speed,
                    fontFamily: theme.font,
                  }))
                }
                className={`p-2.5 rounded-xl border text-left transition relative overflow-hidden ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
                    : 'border-white/10 hover:border-white/20 bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white/20"
                    style={{ backgroundColor: theme.bg }}
                  />
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white/20"
                    style={{ backgroundColor: theme.text }}
                  />
                </div>
                <div className="text-xs font-medium text-slate-200 truncate">{theme.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{theme.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders Grid: Line Height, Text Size, Animation Speed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Line Height Control */}
        <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-white/5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <MoveVertical className="w-3.5 h-3.5 text-indigo-400" />
              Line Height
            </span>
            <span className="font-mono text-indigo-300 font-bold">
              {settings.lineHeight.toFixed(2)}x
            </span>
          </div>
          <input
            type="range"
            min="1.0"
            max="3.0"
            step="0.05"
            value={settings.lineHeight}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onChange((prev) => ({ ...prev, lineHeight: val }));
            }}
            className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Compact (1.0)</span>
            <span>Standard (1.6)</span>
            <span>Spacious (3.0)</span>
          </div>
        </div>

        {/* Text Size Control */}
        <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-white/5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-cyan-400" />
              Text Size
            </span>
            <span className="font-mono text-cyan-300 font-bold">{settings.fontSize}px</span>
          </div>
          <input
            type="range"
            min="24"
            max="140"
            step="2"
            value={settings.fontSize}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              onChange((prev) => ({ ...prev, fontSize: val }));
            }}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>24px</span>
            <span>56px (Standard)</span>
            <span>140px (Stadium)</span>
          </div>
        </div>

        {/* Animation Speed Control */}
        <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-white/5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              Animation Speed
            </span>
            <span className="font-mono text-emerald-300 font-bold">
              {settings.animationSpeed.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.25"
            value={settings.animationSpeed}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onChange((prev) => ({ ...prev, animationSpeed: val }));
            }}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Slow (0.5x)</span>
            <span>Paced (4.5x)</span>
            <span>Sprint (10x)</span>
          </div>
        </div>
      </div>

      {/* Colors Grid: Background Color & Text Color */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Background Color */}
        <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-white/5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              Background Color
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange((prev) => ({ ...prev, backgroundColor: val }));
                }}
                className="w-6 h-6 rounded cursor-pointer border border-white/20 bg-transparent"
              />
              <span className="font-mono text-slate-400 text-xs uppercase">
                {settings.backgroundColor}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {COLOR_PALETTES.backgrounds.map((c) => (
              <button
                key={c.value}
                onClick={() => onChange((prev) => ({ ...prev, backgroundColor: c.value }))}
                title={c.label}
                className={`w-7 h-7 rounded-lg border transition-all ${
                  settings.backgroundColor.toLowerCase() === c.value.toLowerCase()
                    ? 'border-amber-400 ring-2 ring-amber-400/50 scale-110'
                    : 'border-white/20 hover:scale-105'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        </div>

        {/* Text Color */}
        <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-white/5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-rose-400" />
              Text Color
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.textColor}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange((prev) => ({ ...prev, textColor: val }));
                }}
                className="w-6 h-6 rounded cursor-pointer border border-white/20 bg-transparent"
              />
              <span className="font-mono text-slate-400 text-xs uppercase">
                {settings.textColor}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {COLOR_PALETTES.texts.map((c) => (
              <button
                key={c.value}
                onClick={() => onChange((prev) => ({ ...prev, textColor: c.value }))}
                title={c.label}
                className={`w-7 h-7 rounded-lg border transition-all ${
                  settings.textColor.toLowerCase() === c.value.toLowerCase()
                    ? 'border-amber-400 ring-2 ring-amber-400/50 scale-110'
                    : 'border-white/20 hover:scale-105'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Typography & Animation Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {/* Font Family */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400">Font Family</label>
          <select
            value={settings.fontFamily}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, fontFamily: e.target.value as FontFamily }))
            }
            className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="'Inter', sans-serif">Modern Sans (Inter)</option>
            <option value="'Oswald', sans-serif">Bold Broadcast (Oswald)</option>
            <option value="'Playfair Display', serif">Keynote Serif (Playfair)</option>
            <option value="'JetBrains Mono', monospace">Monospace (JetBrains)</option>
            <option value="'Cinzel', serif">Cinematic Classical (Cinzel)</option>
          </select>
        </div>

        {/* Scroll Direction */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <ArrowRightLeft className="w-3 h-3 text-amber-400" />
            <span>Scroll Direction</span>
          </label>
          <select
            value={settings.scrollDirection}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                scrollDirection: e.target.value as ScrollDirection,
              }))
            }
            className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="right-to-left">Right to Left (Continuous Single Line)</option>
            <option value="left-to-right">Left to Right (Continuous Single Line)</option>
          </select>
        </div>

        {/* Center Marker Toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Crosshair className="w-3 h-3 text-indigo-400" />
            <span>Center Focus Cue</span>
          </label>
          <button
            onClick={() =>
              onChange((prev) => ({ ...prev, showCenterMarker: !prev.showCenterMarker }))
            }
            className={`w-full py-2 px-3 rounded-xl border text-xs font-medium transition flex items-center justify-between ${
              settings.showCenterMarker
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <span>Vertical Center Marker</span>
            <span className="font-mono text-[10px] font-bold">
              {settings.showCenterMarker ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {/* Text Glow Toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Text Neon Glow</span>
          </label>
          <button
            onClick={() =>
              onChange((prev) => ({ ...prev, enableGlow: !prev.enableGlow }))
            }
            className={`w-full py-2 px-3 rounded-xl border text-xs font-medium transition flex items-center justify-between ${
              settings.enableGlow
                ? 'bg-cyan-600/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <span>Neon Bloom</span>
            <span className="font-mono text-[10px] font-bold">
              {settings.enableGlow ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
