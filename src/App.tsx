import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { VoiceController } from './components/VoiceController';
import { WidescreenPrompter } from './components/WidescreenPrompter';
import { StylingControls } from './components/StylingControls';
import { ApiKeyModal } from './components/ApiKeyModal';
import { PromptHistory } from './components/PromptHistory';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { generateAiResponse } from './services/aiService';
import type { AiMessage, PrompterSettings } from './types';
import { DEFAULT_SETTINGS } from './constants/presets';
import {
  Command,
  Tv,
  UserCheck,
} from 'lucide-react';

const INITIAL_WELCOME_TEXT = `Rohith HP — Software Developer & AI / Full-Stack Engineer  ✦  Ask me about my experience at Zyvora Innovations, Rapid Chat RAG architecture, tech stack, or hackathons  ✦  Press Record to speak!`;

export function App() {
  // Prompter custom styling settings
  const [settings, setSettings] = useState<PrompterSettings>(() => {
    const saved = localStorage.getItem('ai_voice_prompter_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Save settings automatically
  useEffect(() => {
    localStorage.setItem('ai_voice_prompter_settings', JSON.stringify(settings));
  }, [settings]);

  // Teleprompter text & state
  const [prompterText, setPrompterText] = useState<string>(INITIAL_WELCOME_TEXT);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // History
  const [history, setHistory] = useState<AiMessage[]>(() => {
    const saved = localStorage.getItem('ai_voice_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('ai_voice_history', JSON.stringify(history));
  }, [history]);

  // Modal / drawer state
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [, setApiKeyVersion] = useState(0);

  // Submit voice/text to AI
  const handleQueryAi = useCallback(
    async (promptText: string) => {
      if (!promptText.trim()) return;

      setIsLoadingAi(true);
      setIsStreaming(true);
      setCurrentPrompt(promptText);
      setPrompterText('Rohith HP is answering...');

      try {
        const fullResponse = await generateAiResponse(promptText, (chunk) => {
          setPrompterText(chunk);
        });

        // Add to history
        const newMsg: AiMessage = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          prompt: promptText,
          response: fullResponse,
        };
        setHistory((prev) => [newMsg, ...prev.slice(0, 24)]);
      } catch (err: any) {
        console.error('Failed to generate response:', err);
        setPrompterText(
          `Unable to complete AI generation: ${err.message}. Please check your connection or Groq API key.`
        );
      } finally {
        setIsLoadingAi(false);
        setIsStreaming(false);
      }
    },
    []
  );

  // Speech Recognition hook: Clears previous text on start, automatically sends on stop
  const {
    isListening,
    isTranscribing,
    transcript,
    interimTranscript,
    error,
    audioLevel,
    startListening,
    stopListening,
    resetTranscript,
    setManualTranscript,
  } = useSpeechRecognition({
    onStartRecording: () => {
      setPrompterText('Listening... (Press stop to immediately hear from Rohith HP)');
      setCurrentPrompt('');
    },
    onAutoSubmit: (transcribedText) => {
      if (transcribedText.trim()) {
        handleQueryAi(transcribedText.trim());
      }
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Header */}
      <Header
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-8 space-y-4 sm:space-y-6">
        {/* Single-Line Continuous Right-to-Left Marquee Display */}
        <section className="space-y-2 sm:space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2 min-w-0">
              <Tv className="w-4 h-4 text-amber-400 shrink-0" />
              <h2 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-slate-300 m-0 truncate">
                Single-Line Continuous Marquee Feed
              </h2>
              {currentPrompt && (
                <span className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-md hidden sm:inline">
                  — Question: <span className="text-slate-200 font-medium">"{currentPrompt}"</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md font-mono text-[11px]">
                <Command className="w-3 h-3" /> Space to Pause • Up/Down for Speed • F for Fullscreen
              </span>
            </div>
          </div>

          {/* Prompter Component */}
          <WidescreenPrompter
            text={prompterText}
            settings={settings}
            onUpdateSettings={setSettings}
            onEditText={(newText) => setPrompterText(newText)}
            isStreaming={isStreaming}
          />
        </section>

        {/* Lower Grid: Voice Input & Live Styling Controls */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Voice Input Section (40% width on large screens) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <VoiceController
              isListening={isListening}
              isTranscribing={isTranscribing}
              transcript={transcript}
              interimTranscript={interimTranscript}
              error={error}
              audioLevel={audioLevel}
              isLoadingAi={isLoadingAi}
              onStartListening={startListening}
              onStopListening={stopListening}
              onResetTranscript={resetTranscript}
              onSetTranscript={setManualTranscript}
              onSubmitToAi={handleQueryAi}
            />

            {/* Candidate & Resume Profile Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/40 border border-white/5 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Candidate Representation Active</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed text-slate-400">
                <li><strong className="text-slate-300">Profile:</strong> Rohith HP • Software Developer & AI/Full-Stack Engineer.</li>
                <li><strong className="text-slate-300">Experience:</strong> Zyvora Innovations, Specular Graphics, Rapid Chat RAG platform.</li>
                <li><strong className="text-slate-300">Detailed Representation:</strong> Comprehensive first-person answers covering technical depth, metrics, and architecture.</li>
                <li><strong className="text-slate-300">Instant Flow:</strong> Stop recording to immediately stream the answer from right to left.</li>
              </ul>
            </div>
          </div>

          {/* Styling & Typography Controls (60% width on large screens) */}
          <div className="lg:col-span-7">
            <StylingControls settings={settings} onChange={setSettings} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-3 sm:py-4 px-4 text-center text-[11px] sm:text-xs text-slate-500">
        VoicePrompt AI • Candidate Interview Mode (Rohith HP) • Responsive Marquee • Powered by Groq
      </footer>

      {/* Modals & Drawers */}
      <ApiKeyModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onSaved={() => setApiKeyVersion((v) => v + 1)}
      />

      <PromptHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectMessage={(msg) => {
          setCurrentPrompt(msg.prompt);
          setPrompterText(msg.response);
        }}
        onClearHistory={() => setHistory([])}
      />
    </div>
  );
}

export default App;
