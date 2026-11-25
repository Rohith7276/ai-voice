import type { PresetTheme, PrompterSettings } from '../types';

export const DEFAULT_SETTINGS: PrompterSettings = {
  lineHeight: 1.6,
  fontSize: 56, // Bold, high-visibility single-line font size
  backgroundColor: '#05070f',
  textColor: '#f8fafc',
  animationSpeed: 4.5,
  fontFamily: "'Inter', sans-serif",
  fontWeight: '700',
  scrollDirection: 'right-to-left', // Right-to-left single line
  letterSpacing: 1.0,
  mirrorMode: false,
  enableGlow: false,
  showCenterMarker: true,
};

export const PRESET_THEMES: PresetTheme[] = [
  {
    name: 'Times Square Marquee',
    description: 'Pitch black background with brilliant diamond white text',
    bg: '#000000',
    text: '#ffffff',
    fontSize: 64,
    lineHeight: 1.6,
    speed: 5,
    font: "'Oswald', sans-serif",
  },
  {
    name: 'Cyberpunk Neon',
    description: 'Deep violet darkness with electric mint neon glow',
    bg: '#080114',
    text: '#10b981',
    fontSize: 54,
    lineHeight: 1.7,
    speed: 4.5,
    font: "'JetBrains Mono', monospace",
  },
  {
    name: 'Breaking News Ticker',
    description: 'Midnight navy banner with sharp warning amber',
    bg: '#081226',
    text: '#fbbf24',
    fontSize: 58,
    lineHeight: 1.6,
    speed: 5.5,
    font: "'Oswald', sans-serif",
  },
  {
    name: 'Cinematic Blue',
    description: 'Deep slate backdrop with crisp cyan glow',
    bg: '#090d16',
    text: '#38bdf8',
    fontSize: 52,
    lineHeight: 1.6,
    speed: 4,
    font: "'Inter', sans-serif",
  },
  {
    name: 'Clean Whiteout',
    description: 'Paper white with obsidian high-contrast letters',
    bg: '#f8fafc',
    text: '#090d16',
    fontSize: 50,
    lineHeight: 1.5,
    speed: 4,
    font: "'Inter', sans-serif",
  },
];

export const COLOR_PALETTES = {
  backgrounds: [
    { label: 'OLED Black', value: '#000000' },
    { label: 'Obsidian Night', value: '#05070f' },
    { label: 'Deep Slate', value: '#0f172a' },
    { label: 'Midnight Navy', value: '#081226' },
    { label: 'Neon Cyber', value: '#0c021c' },
    { label: 'Charcoal', value: '#18181b' },
    { label: 'Studio Crimson', value: '#1a0505' },
    { label: 'Bright Paper', value: '#f8fafc' },
  ],
  texts: [
    { label: 'Pure White', value: '#ffffff' },
    { label: 'Ghost White', value: '#e2e8f0' },
    { label: 'Cyan Glow', value: '#38bdf8' },
    { label: 'Emerald Mint', value: '#34d399' },
    { label: 'Breaking Amber', value: '#fbbf24' },
    { label: 'Electric Rose', value: '#fb7185' },
    { label: 'Neon Purple', value: '#c084fc' },
    { label: 'Deep Charcoal', value: '#0f172a' },
  ],
};
