import React from 'react';
import {
  Tv,
  History,
  Zap,
  UserCheck,
} from 'lucide-react';
import { getStoredApiKey, getStoredModel } from '../services/aiService';

interface HeaderProps {
  onOpenApiModal: () => void;
  onToggleHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenApiModal,
  onToggleHistory,
  historyCount,
}) => {
  const hasApiKey = Boolean(getStoredApiKey());
  const selectedModel = getStoredModel();
  const is120b = selectedModel.includes('120b');

  return (
    <header className="w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 shadow-lg shadow-orange-500/20 text-white">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white m-0">
                VoicePrompt <span className="text-amber-400">AI</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> ROHITH HP
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block m-0">
              Interactive Candidate Teleprompter • Groq Whisper & LPU Inference
            </p>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* History Button */}
          <button
            onClick={onToggleHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-[10px] font-bold text-slate-950">
                {historyCount}
              </span>
            )}
          </button>

          {/* API Key Status / Configuration */}
          <button
            onClick={onOpenApiModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
              hasApiKey
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="hidden sm:inline">
              {hasApiKey ? `Groq (${is120b ? '120B' : 'Active'})` : 'Configure Key'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
