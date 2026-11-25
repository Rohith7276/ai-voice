import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Trash2,
  Sparkles,
  Keyboard,
  Info,
  Loader2,
  Zap,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';

interface VoiceControllerProps {
  isListening: boolean;
  isTranscribing?: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  audioLevel: number;
  isLoadingAi: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onResetTranscript: () => void;
  onSetTranscript: (text: string) => void;
  onSubmitToAi: (promptText: string) => void;
}

const SAMPLE_PROMPTS = [
  'Tell me about yourself',
  'What are your core technical skills?',
  'What did you build at Zyvora Innovations?',
  'Explain the Rapid Chat RAG architecture',
  'What are your hackathons and achievements?',
];

export const VoiceController: React.FC<VoiceControllerProps> = ({
  isListening,
  isTranscribing = false,
  transcript,
  interimTranscript,
  error,
  audioLevel,
  isLoadingAi,
  onStartListening,
  onStopListening,
  onResetTranscript,
  onSetTranscript,
  onSubmitToAi,
}) => {
  const [manualMode, setManualMode] = useState(false);
  const fullTranscript = transcript + (interimTranscript ? ` ${interimTranscript}` : '');

  const handleSend = () => {
    const textToSend = fullTranscript.trim();
    if (textToSend) {
      if (isListening) {
        onStopListening();
      }
      onSubmitToAi(textToSend);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full bg-slate-900/70 border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      {/* Header bar of Voice Controller */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={isListening ? onStopListening : onStartListening}
              disabled={isTranscribing}
              className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 active:scale-95 shadow-lg ${
                isTranscribing
                  ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/30 cursor-wait'
                  : isListening
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30 ring-4 ring-rose-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
              title={
                isTranscribing
                  ? 'Transcribing audio with Groq Whisper...'
                  : isListening
                  ? 'Click to STOP and immediately get answer from Rohith HP'
                  : 'Click to start voice recording'
              }
            >
              {isTranscribing ? (
                <Loader2 className="w-6 h-6 animate-spin text-slate-950" />
              ) : isListening ? (
                <MicOff className="w-6 h-6 animate-pulse" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>
            {isListening && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                <span>{isTranscribing ? 'Transcribing & Answering...' : isListening ? 'Listening...' : 'Interview Candidate: Rohith HP'}</span>
              </h3>
              {isTranscribing ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase animate-pulse flex items-center gap-1">
                  <Zap className="w-3 h-3" /> WHISPER
                </span>
              ) : isListening ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase animate-pulse">
                  REC
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> RESUME ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {isTranscribing
                ? 'Transcribing via Whisper and generating direct candidate answer...'
                : isListening
                ? 'Ask your question. Press the red stop button to immediately get Rohith\'s answer!'
                : 'Click mic to ask Rohith HP an interview question or pick a topic below.'}
            </p>
          </div>
        </div>

        {/* Audio Waveform Meter */}
        <div className="flex items-center gap-2">
          <AudioWaveform isListening={isListening} audioLevel={audioLevel} />
          <button
            onClick={() => setManualMode(!manualMode)}
            title={manualMode ? 'Switch to speech voice mode' : 'Switch to keyboard typing mode'}
            className={`p-2 rounded-xl border transition ${
              manualMode
                ? 'bg-indigo-600/30 border-indigo-500/40 text-indigo-300'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-400'
            }`}
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 flex items-center justify-between gap-2.5 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{error}</span>
          </div>
          <button
            onClick={onStartListening}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 font-semibold text-[11px] text-amber-300 transition"
          >
            Retry Mic
          </button>
        </div>
      )}

      {/* Transcript Input / Display Box */}
      <div className="relative mb-3">
        <textarea
          value={fullTranscript}
          onChange={(e) => onSetTranscript(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isTranscribing
              ? 'Transcribing your question with Groq Whisper...'
              : isListening
              ? 'Listening... Speak your interview question, then click STOP to immediately hear from Rohith!'
              : 'Ask a question about Rohith HP\'s resume, experience, skills, or projects...'
          }
          rows={2}
          className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3.5 pr-32 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none font-sans"
        />

        {/* Action Buttons inside Textarea */}
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          {fullTranscript.length > 0 && (
            <button
              onClick={onResetTranscript}
              title="Clear text"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-rose-300 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {isListening ? (
            <button
              onClick={onStopListening}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold text-xs shadow-md bg-rose-500 hover:bg-rose-600 text-white transition-all active:scale-95 animate-pulse"
            >
              <MicOff className="w-3.5 h-3.5" />
              <span>Stop & Answer</span>
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!fullTranscript.trim() || isLoadingAi || isTranscribing}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-medium text-xs shadow-md transition-all active:scale-95 ${
                !fullTranscript.trim() || isLoadingAi || isTranscribing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isLoadingAi ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-300" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask Rohith</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Preset Interview Question Suggestions */}
      <div>
        <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-slate-400">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Resume interview questions (1-click direct response):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PROMPTS.map((prompt, index) => (
            <button
              key={index}
              onClick={() => {
                onSetTranscript(prompt);
                onSubmitToAi(prompt);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/30 text-slate-300 hover:text-amber-200 transition flex items-center gap-1.5"
            >
              <span>{prompt}</span>
              <ArrowRight className="w-3 h-3 opacity-50" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
