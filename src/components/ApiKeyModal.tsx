import React, { useState } from 'react';
import { Check, ExternalLink, X, Shield, Zap } from 'lucide-react';
import {
  AI_MODELS,
  getStoredApiKey,
  getStoredModel,
  saveStoredApiKey,
  saveStoredModel,
} from '../services/aiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [model, setModel] = useState(getStoredModel());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredApiKey(apiKey);
    saveStoredModel(model);
    setSavedSuccess(true);
    onSaved();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-white/15 rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 sm:gap-3 mb-4">
          <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white">Groq AI Engine Settings</h3>
            <p className="text-[11px] sm:text-xs text-slate-400">Ultra-fast real-time speech generation</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5 sm:space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Groq AI Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {AI_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Groq API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400 shrink-0" />
              Stored locally in your environment or browser.
            </p>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">Groq LPU Acceleration</span>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px]"
              >
                <span>Groq Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Groq runs open models on custom Language Processing Units (LPUs) at hundreds of tokens per second for real-time teleprompter streaming.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-1 sm:pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-xs font-semibold shadow-lg transition active:scale-95 ${
                savedSuccess
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-amber-500/30'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Settings</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
