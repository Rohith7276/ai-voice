export type ScrollDirection = 'right-to-left' | 'left-to-right' | 'vertical-up';

export type FontFamily = 
  | 'system-ui'
  | "'Inter', sans-serif"
  | "'JetBrains Mono', monospace"
  | "'Playfair Display', serif"
  | "'Oswald', sans-serif"
  | "'Cinzel', serif";

export interface PrompterSettings {
  // Required customizations
  lineHeight: number;        // e.g. 1.2 to 3.0
  fontSize: number;          // e.g. 18 to 140 (px)
  backgroundColor: string;   // hex or css color
  textColor: string;         // hex or css color
  animationSpeed: number;    // 1 to 10 (mapped to pixels/second)
  
  // Single-line and widescreen enhancements
  fontFamily: FontFamily;
  fontWeight: string;        // '400' | '600' | '700'
  scrollDirection: ScrollDirection; // Default: 'right-to-left'
  letterSpacing: number;     // -2 to 10 px
  mirrorMode: boolean;       // mirror flip for teleprompter glass
  enableGlow: boolean;       // subtle neon text glow
  showCenterMarker: boolean; // vertical center cue marker
}

export interface VoiceState {
  isListening: boolean;
  isTranscribing: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  audioLevel: number;
}

export interface AiMessage {
  id: string;
  timestamp: number;
  prompt: string;
  response: string;
  isStreaming?: boolean;
}

export interface PresetTheme {
  name: string;
  description: string;
  bg: string;
  text: string;
  fontSize: number;
  lineHeight: number;
  speed: number;
  font: FontFamily;
}
