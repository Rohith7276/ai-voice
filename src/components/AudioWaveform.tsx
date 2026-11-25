import React from 'react';

interface AudioWaveformProps {
  isListening: boolean;
  audioLevel: number; // 0 to 100
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ isListening, audioLevel }) => {
  // Generate 16 bars for the audio equalizer with deterministic wave harmonics
  const bars = Array.from({ length: 16 }, (_, i) => {
    if (!isListening) {
      return 15; // idle height %
    }
    const wave = Math.sin((i / 16) * Math.PI) * 0.6 + 0.4;
    const harmonic = Math.cos(((i * 2.5) / 16) * Math.PI) * 0.2 + 0.8;
    const height = Math.max(12, Math.min(100, Math.round(audioLevel * wave * harmonic)));
    return height;
  });

  return (
    <div className="flex items-center gap-1 h-8 px-3 py-1 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur">
      {bars.map((height, idx) => (
        <div
          key={idx}
          className={`w-1 rounded-full transition-all duration-75 ${
            isListening
              ? 'bg-gradient-to-t from-indigo-500 via-cyan-400 to-emerald-400'
              : 'bg-slate-700'
          }`}
          style={{
            height: `${height}%`,
          }}
        />
      ))}
      <span className="ml-2 font-mono text-[11px] text-slate-400 tracking-wider">
        {isListening ? `${audioLevel}%` : 'IDLE'}
      </span>
    </div>
  );
};
