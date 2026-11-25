/**
 * Resume Profile Data for Candidate Rohith HP
 * Extracted from c:\Users\Rohith\resume (3).pdf
 */

export const RESUME_PROFILE = {
  name: 'Rohith HP',
  location: 'Bangalore, Karnataka',
  phone: '+91 99029 67276',
  title: 'Software Developer & AI/Full-Stack Engineer',
  summary:
    'Software Developer experienced in building AI-powered and full-stack applications using React, Node.js, and REST APIs. Developed LLM-integrated solutions with Retrieval-Augmented Generation (RAG), semantic retrieval, and intelligent document processing while building scalable backend systems with Redis, Docker, and Socket.io.',
  
  skills: {
    languages: 'JavaScript, C++, SQL',
    frontend: 'React.js, Next.js, HTML, CSS, Tailwind CSS, GSAP',
    backend: 'Node.js, Express.js, MongoDB, REST APIs, Socket.io, WebRTC, JWT, PostgreSQL, MySQL',
    tools: 'Redis, Docker, Git, AWS (S3 Presigned URLs, SES), Firebase, Swagger, Postman, MVC Pattern, Cache-Aside Strategy, BullMQ',
  },

  experience: [
    {
      company: 'Zyvora Innovations',
      role: 'Full Stack Developer Intern',
      period: 'Jul 2026 – Present',
      location: 'Bengaluru, Karnataka',
      highlights: [
        'Architected an asynchronous campaign dispatch pipeline using Node.js, BullMQ, and Redis for automated audience segmentation and batch messaging across WhatsApp and Instagram.',
        'Engineered real-time omnichannel messaging infrastructure integrating Meta Graph APIs (WhatsApp Business, Instagram DM, Facebook Messenger) and Socket.io.',
        'Hardened platform security and scalability with Redis-backed distributed rate limiting, RBAC, AWS S3/SES across 30+ RESTful APIs in PostgreSQL.',
      ],
    },
    {
      company: 'Specular Graphics Private Limited',
      role: 'Full Stack Developer Intern',
      period: 'Dec 2025 – Jan 2026',
      location: 'Bengaluru, Karnataka',
      highlights: [
        'Optimized backend API performance by reducing average response time by 35% and resolved 12+ production issues in Node.js/Express.',
        'Developed production-ready responsive frontend using React, GSAP, and Tailwind CSS, achieving 40% faster load times and 25% user engagement boost.',
      ],
    },
  ],

  projects: [
    {
      name: 'Rapid Chat',
      stack: 'React.js, Node.js, Express.js, MongoDB, Redis, Docker, Socket.IO, WebRTC',
      highlights: [
        'Real-time collaboration platform integrating RAG, LLMs, vector embeddings, semantic chunking, and contextual retrieval for documents, video calls, and group chat.',
        'Supported 20+ concurrent users in WebRTC video calls and synchronized streaming.',
        'Hybrid RAG pipeline with timestamp-aware retrieval and Redis cache-aside caching (45% API response time reduction).',
      ],
    },
  ],

  achievements: [
    '1st Place – Problem Solving Competition, REVA University (2024, top among 100+ participants).',
    '2nd Place – VibeX Hackathon, NMIT (2025, 24-hour full-stack application).',
    '2nd Place – Coding Competition, REVA University (2025).',
    '2nd Place – Algo Rhythm, GCEM (2026, top among 50+ participants).',
  ],

  education: [
    {
      institution: 'REVA University',
      degree: 'B.Tech in Computer Science and Engineering',
      period: '2023 – 2027 (Expected)',
      location: 'Bengaluru, Karnataka',
    },
    {
      institution: 'Vidya Soudha PU College',
      degree: 'Higher Secondary (12th) – 80.16%',
      year: 'March 2023',
    },
    {
      institution: 'Apollo High School',
      degree: 'Secondary (10th) – 89.28%',
      year: 'July 2021',
    },
  ],
};
