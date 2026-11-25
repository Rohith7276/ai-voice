# VoicePrompt AI — Continuous Widescreen Teleprompter

A modern React application that listens to user voice, transcribes it in real-time, sends the transcription to **Groq Ultra-Low Latency LPU AI** (streaming GPT-OSS 120B / 20B / Qwen), and displays the response in a customizable, continuous scrolling widescreen teleprompter.

![VoicePrompt AI](https://img.shields.io/badge/React-19-blue)
![Groq](https://img.shields.io/badge/Groq-LPU_Inference-f59e0b)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8)
![Vite](https://img.shields.io/badge/Vite-8-purple)

---

## Features

### ⚡ 1. Groq Ultra-Fast AI Intelligence (Pre-Configured)
- **High-Speed Streaming**: Powered by Groq's Language Processing Units (LPUs), streaming responses at hundreds of tokens per second.
- **Pre-Integrated Models**:
  - `openai/gpt-oss-120b` (Default Flagship model — deep, eloquent oratorical speeches)
  - `openai/gpt-oss-20b` (Ultra-fast Turbo)
  - `qwen/qwen3.8-27b` (High-accuracy reasoning)
- **Pre-loaded API Key**: Your Groq API key is configured in `.env` and `.env.local` and can be adjusted anytime via the top right settings modal.

### 🎙️ 2. Real-time Voice Listening & Transcription
- **Web Speech API**: Continuous speech-to-text with live interim transcripts.
- **Audio Equalizer**: Dynamic frequency bars reacting to user speech.
- **Quick Voice Prompts**: 1-click test chips for keynotes, physics explanations, movie monologues, and news broadcasts.

### 📺 3. Widescreen Continuous Scrolling Teleprompter
- **Continuous Auto-Scroll**: Butter-smooth `requestAnimationFrame` continuous vertical teleprompter scroll or continuous horizontal marquee banner.
- **Direct Real-time Customization**:
  - **Line Height**: Configurable slider from `1.0` to `3.0` (with live decimal feedback).
  - **Text Size**: Configurable slider from `18px` to `110px` for optimal distance visibility.
  - **Background Color**: Color picker + 8 studio presets (OLED Black, Obsidian Night, Deep Slate, Midnight Navy, etc.).
  - **Text Color**: Color picker + 8 high-contrast studio presets (Pure White, Ghost White, Cyan Glow, Emerald Mint, Keynote Gold, etc.).
  - **Animation Speed**: Configurable slider from `0.5x` to `10.0x` (with on-the-fly acceleration & deceleration).
- **Teleprompter Eye-Line Guide**: Horizontal focus line indicator to help speakers maintain natural eye-contact with the camera.
- **Mirror Mode**: Horizontally flips the text display (`scaleX(-1)`) for use with beam-splitter teleprompter glass.
- **Live Script Editor**: Click to pause and tweak text directly inside the prompter.
- **Text-to-Speech (TTS)**: Audible rehearsal playback.
- **Fullscreen Widescreen Mode**: Toggle edge-to-edge cinematic view.

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Space` | Play / Pause auto-scrolling |
| `Arrow Up` | Increase scrolling animation speed (+0.5x) |
| `Arrow Down` | Decrease scrolling animation speed (-0.5x) |
| `R` | Reset / Rewind scroll to the top |
| `F` | Toggle edge-to-edge Fullscreen prompter |
| `M` | Toggle Mirror Mode (for glass teleprompter rigs) |

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

### 3. Build for production
```bash
npm run build
```
