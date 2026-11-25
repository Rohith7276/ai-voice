import React from 'react';
import { History, X, Clock, ArrowRight, Trash2 } from 'lucide-react';
import type { AiMessage } from '../types';

interface PromptHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: AiMessage[];
  onSelectMessage: (msg: AiMessage) => void;
  onClearHistory: () => void;
}

export const PromptHistory: React.FC<PromptHistoryProps> = ({
  isOpen,
  onClose,
  history,
  onSelectMessage,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900/95 border-l border-white/15 shadow-2xl backdrop-blur-xl p-6 flex flex-col text-slate-100 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-semibold text-white">Speech & Prompt History</h3>
        </div>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              title="Clear all history"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
          <Clock className="w-10 h-10 mb-2 opacity-40" />
          <p className="text-sm font-medium">No previous speech queries yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Speak into the microphone or send a query to save it to your session history.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectMessage(item);
                onClose();
              }}
              className="p-4 rounded-xl bg-slate-950/60 border border-white/10 hover:border-indigo-500/40 hover:bg-white/5 cursor-pointer transition group"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <span className="font-mono">
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="text-indigo-400 group-hover:translate-x-1 transition flex items-center gap-1 font-semibold">
                  Load to prompter <ArrowRight className="w-3 h-3" />
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1">
                "{item.prompt}"
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2">{item.response}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
