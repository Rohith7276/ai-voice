/**
 * AI Service for Candidate Speech & Teleprompter Generation
 * Configured with Resume Context for Candidate: Rohith HP
 * Powered by Groq Ultra-Low Latency LPU Inference
 */

import { RESUME_PROFILE } from '../constants/resumeData';

export const DEFAULT_GROQ_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) || '';

const STORAGE_KEY_GROQ_KEY = 'ai_voice_groq_api_key';
const STORAGE_KEY_MODEL = 'ai_voice_selected_model';

export const AI_MODELS = [
  { id: 'openai/gpt-oss-120b', name: 'Groq • GPT-OSS 120B (Flagship & Most Eloquent)' },
  { id: 'openai/gpt-oss-20b', name: 'Groq • GPT-OSS 20B (Ultra-fast Turbo)' },
  { id: 'qwen/qwen3.8-27b', name: 'Groq • Qwen 3.8 27B (High Accuracy)' },
  { id: 'mock', name: 'Built-in Offline Demo Engine (No key required)' },
];

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem(STORAGE_KEY_GROQ_KEY);
  if (stored) return stored;
  const envKey = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_GROQ_API_KEY : '';
  if (envKey) return envKey;
  return '';
}

export function saveStoredApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY_GROQ_KEY, key.trim());
}

export function getStoredModel(): string {
  if (typeof window === 'undefined') return 'openai/gpt-oss-120b';
  return localStorage.getItem(STORAGE_KEY_MODEL) || 'openai/gpt-oss-120b';
}

export function saveStoredModel(model: string): void {
  localStorage.setItem(STORAGE_KEY_MODEL, model);
}

/**
 * Transcribe recorded audio with Groq Whisper (whisper-large-v3-turbo)
 */
export async function transcribeAudioWithGroqWhisper(audioBlob: Blob): Promise<string> {
  const apiKey = getStoredApiKey();
  if (!apiKey || apiKey === 'mock') {
    return 'Voice sample recorded. Configure Groq API key for live Whisper transcription.';
  }

  let ext = 'webm';
  if (audioBlob.type.includes('wav')) ext = 'wav';
  else if (audioBlob.type.includes('mp4') || audioBlob.type.includes('m4a')) ext = 'mp4';
  else if (audioBlob.type.includes('ogg')) ext = 'ogg';

  const formData = new FormData();
  formData.append('file', audioBlob, `recording.${ext}`);
  formData.append('model', 'whisper-large-v3-turbo');
  formData.append('temperature', '0');

  const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => null);
    throw new Error(
      errorJson?.error?.message ||
        `Groq Whisper transcription failed (${response.status} ${response.statusText})`
    );
  }

  const data = await response.json();
  return (data.text || '').trim();
}

/**
 * Candidate Persona System Prompt
 * Calibrated to provide rich, comprehensive, and impressive interview responses.
 */
function buildCandidateSystemPrompt(): string {
  return `You are ${RESUME_PROFILE.name}, a ${RESUME_PROFILE.title} based in ${RESUME_PROFILE.location}.
You are speaking in a live interview / presentation displayed on a continuous single-line widescreen marquee ticker.

Your Complete Verified Background:
- Candidate Name: ${RESUME_PROFILE.name}
- Location: ${RESUME_PROFILE.location} | Phone: ${RESUME_PROFILE.phone}
- Professional Profile: ${RESUME_PROFILE.summary}

- Technical Skills Portfolio:
  * Programming Languages: ${RESUME_PROFILE.skills.languages}
  * Frontend Engineering: ${RESUME_PROFILE.skills.frontend}
  * Backend & Real-Time: ${RESUME_PROFILE.skills.backend}
  * Cloud, DevOps & Tools: ${RESUME_PROFILE.skills.tools}

- Work Experience:
  1. ${RESUME_PROFILE.experience[0].role} at ${RESUME_PROFILE.experience[0].company} (${RESUME_PROFILE.experience[0].period}):
     ${RESUME_PROFILE.experience[0].highlights.join(' ')}
  2. ${RESUME_PROFILE.experience[1].role} at ${RESUME_PROFILE.experience[1].company} (${RESUME_PROFILE.experience[1].period}):
     ${RESUME_PROFILE.experience[1].highlights.join(' ')}

- Major Projects:
  * ${RESUME_PROFILE.projects[0].name} (Tech Stack: ${RESUME_PROFILE.projects[0].stack}):
     ${RESUME_PROFILE.projects[0].highlights.join(' ')}

- Competitive Coding & Hackathons:
  ${RESUME_PROFILE.achievements.join(' ')}

- Education:
  * ${RESUME_PROFILE.education[0].degree} from ${RESUME_PROFILE.education[0].institution} (${RESUME_PROFILE.education[0].period})
  * ${RESUME_PROFILE.education[1].degree} from ${RESUME_PROFILE.education[1].institution} (${RESUME_PROFILE.education[1].year})
  * ${RESUME_PROFILE.education[2].degree} from ${RESUME_PROFILE.education[2].institution} (${RESUME_PROFILE.education[2].year})

Response Guidelines for Interviewers:
1. Persona: Speak strictly in the FIRST PERSON ("I", "my experience", "I architected", "I engineered"). You ARE Rohith HP.
2. Depth & Elaboration:
   - For open-ended or high-level questions like "Tell me about yourself", "Tell me about your projects", "What did you build at Zyvora?", or "What are your skills?", DO NOT give brief one-liners. Provide a THOROUGH, DETAILED, and IMPRESSIVE answer that covers your engineering journey, key architectural patterns (RAG, MVC, Redis cache-aside, BullMQ queues, Socket.io/WebRTC), and concrete business/technical metrics (e.g. 45% latency reduction, 20+ concurrent users, 30+ RESTful APIs).
   - For skills questions: give a PROPER, well-structured response covering languages, frontend frameworks, backend microservices, real-time protocols, databases, and DevOps tools.
   - For specific narrow questions: provide direct, accurate answers with relevant technical context.
3. Tone: Confident, articulate, professional, and engineering-focused. Avoid conversational fluff or meta-announcements (never say "Sure thing!", "Here is my answer", or "As seen on my resume").
4. Marquee Formatting: Keep the text continuous and flowing without markdown tables, bullet points, or line breaks so it scrolls naturally across the widescreen ticker.`;
}

/**
 * Rich simulated candidate responses for offline fallback
 */
function getSimulatedResponse(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('about yourself') || p.includes('who are you') || p.includes('introduce')) {
    return `I am Rohith HP, a Software Developer based in Bangalore specializing in building AI-powered and full-stack distributed applications. I am currently pursuing my B.Tech in Computer Science and Engineering at REVA University while working as a Full Stack Developer Intern at Zyvora Innovations. In my role, I architected an asynchronous campaign dispatch pipeline using Node.js, BullMQ, and Redis to automate audience segmentation and batch messaging across WhatsApp and Instagram, alongside real-time omnichannel messaging infrastructure with Meta Graph APIs and Socket.io. On the AI front, I engineered Rapid Chat, a scalable collaboration platform featuring a hybrid RAG pipeline with timestamp-aware retrieval, WebRTC video calling, and Redis cache-aside caching that reduced API latency by 45%. I'm passionate about solving complex engineering challenges, competitive coding, and building scalable production systems.`;
  }

  if (p.includes('skill') || p.includes('tech stack') || p.includes('technologies')) {
    return `My technical skill set spans full-stack engineering, real-time distributed systems, and AI integration. For programming languages, I work with JavaScript, C++, and SQL. On the frontend, I develop responsive, production-grade applications using React.js, Next.js, HTML5, CSS3, Tailwind CSS, and GSAP. On the backend, I architect scalable microservices using Node.js, Express.js, Socket.io, and WebRTC for live peer-to-peer streaming. My database expertise includes PostgreSQL, MongoDB, and MySQL, complemented by Redis for distributed rate-limiting and cache-aside caching strategies. Furthermore, my DevOps and developer workflow includes Docker, Git, AWS services like S3 presigned URLs and SES, BullMQ for distributed job queues, and vector embeddings for Retrieval-Augmented Generation.`;
  }

  if (p.includes('rapid chat') || p.includes('project') || p.includes('rag')) {
    return `My flagship project is Rapid Chat, a scalable real-time collaboration platform engineered with React, Node.js, Express, MongoDB, Redis, Docker, Socket.io, and WebRTC. The cornerstone of the platform is an advanced hybrid Retrieval-Augmented Generation (RAG) pipeline that incorporates vector embeddings, semantic chunking, and timestamp-aware contextual retrieval, enabling users to perform natural language queries over live transcripts, shared PDFs, and video stream records. To support high-concurrency collaboration, I deployed WebRTC and Socket.io to facilitate multi-user video calls for 20+ concurrent participants, and architected the backend using the MVC pattern with Redis cache-aside caching and TTL-based invalidation, reducing API response times by 45% and drastically cutting redundant LLM compute costs.`;
  }

  if (p.includes('zyvora') || p.includes('experience') || p.includes('work')) {
    return `At Zyvora Innovations, I serve as a Full Stack Developer Intern where I architected an asynchronous campaign dispatch pipeline using Node.js, BullMQ, and Redis, enabling automated audience segmentation, job scheduling, and high-throughput batch messaging across WhatsApp and Instagram with fault-tolerant retry handling. Additionally, I built an omnichannel messaging infrastructure integrating Meta Graph APIs and Socket.io, and hardened platform security and multi-tenancy by implementing Redis-backed distributed rate limiting, Role-Based Access Control, and AWS Cloud services across more than 30 RESTful API modules in PostgreSQL.`;
  }

  if (p.includes('achievement') || p.includes('hackathon') || p.includes('competition')) {
    return `I have a strong track record in competitive programming and hackathons: I secured 1st Place in the Problem Solving Competition at REVA University among 100+ competitors, won 2nd Place in the 24-hour VibeX Hackathon at NMIT, took 2nd Place in the REVA University Coding Competition, and claimed 2nd Place in the Algo Rhythm algorithmic challenge at GCEM.`;
  }

  if (p.includes('education') || p.includes('college') || p.includes('degree')) {
    return `I am pursuing my Bachelor of Technology in Computer Science and Engineering at REVA University in Bengaluru, graduating in 2027, with a strong academic foundation in algorithms, system design, and distributed architectures.`;
  }

  return `As Rohith HP, I specialize in full-stack and AI development with React, Node.js, Redis, and RAG architectures, focusing on building resilient, high-throughput software systems that solve real-world problems.`;
}

/**
 * Stream comprehensive response representing candidate Rohith HP
 */
export async function generateAiResponse(
  prompt: string,
  onChunk: (currentText: string) => void
): Promise<string> {
  const apiKey = getStoredApiKey();
  const selectedModel = getStoredModel();

  if (!apiKey || selectedModel === 'mock') {
    const fullText = getSimulatedResponse(prompt);
    const words = fullText.split(' ');
    let accumulated = '';

    for (let i = 0; i < words.length; i++) {
      accumulated += (i > 0 ? ' ' : '') + words[i];
      onChunk(accumulated);
      await new Promise((resolve) => setTimeout(resolve, 20 + Math.random() * 15));
    }

    return accumulated;
  }

  try {
    const systemPrompt = buildCandidateSystemPrompt();
    const modelName = selectedModel || 'openai/gpt-oss-120b';
    const endpoint = 'https://api.groq.com/openai/v1/chat/completions';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        stream: true,
        temperature: 0.5,
        max_tokens: 1500, // Generous token ceiling for comprehensive, rich interview responses
      }),
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => null);
      throw new Error(
        errorJson?.error?.message ||
          `Groq API responded with status ${response.status} (${response.statusText})`
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to read streaming response from Groq API.');
    }

    const decoder = new TextDecoder();
    let accumulatedText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.replace('data: ', '').trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta;
            if (delta?.content) {
              accumulatedText += delta.content;
              onChunk(accumulatedText);
            }
          } catch {
            // chunk json parse ignored
          }
        }
      }
    }

    if (!accumulatedText.trim()) {
      accumulatedText = getSimulatedResponse(prompt);
      onChunk(accumulatedText);
    }

    return accumulatedText;
  } catch (err: any) {
    console.error('Groq API Error, falling back to candidate offline generator:', err);
    const simulated = getSimulatedResponse(prompt);
    const fallbackMessage = `[Notice: Groq API Error: ${err.message}] — ${simulated}`;
    onChunk(fallbackMessage);
    return fallbackMessage;
  }
}
