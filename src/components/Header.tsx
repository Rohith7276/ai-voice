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
    <header className="w-full border-b border-white/10 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 shadow-lg shadow-orange-500/20 text-white shrink-0">
            <Tv className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-white m-0 truncate">
                VoicePrompt <span className="text-amber-400">AI</span>
              </h1>
              <span className="px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-semibold bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-1 shrink-0">
                <UserCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="hidden xs:inline">ROHITH HP</span>
                <span className="xs:hidden">CANDIDATE</span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 hidden md:block m-0 truncate">
              Interactive Candidate Teleprompter • Groq Whisper & LPU Inference
            </p>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* History Button */}
          <button
            onClick={onToggleHistory}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition"
            title="Open Prompt History"
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
            className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-medium transition ${
              hasApiKey
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
            }`}
            title="Configure Groq API Key & Model"
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
