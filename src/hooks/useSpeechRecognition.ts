import { useState, useRef, useCallback, useEffect } from 'react';
import { transcribeAudioWithGroqWhisper } from '../services/aiService';

interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
  webkitAudioContext?: typeof AudioContext;
}

interface UseSpeechRecognitionOptions {
  onAutoSubmit?: (transcriptText: string) => void;
  onStartRecording?: () => void;
}

export function useSpeechRecognition({
  onAutoSubmit,
  onStartRecording,
}: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  const onAutoSubmitRef = useRef(onAutoSubmit);
  const onStartRecordingRef = useRef(onStartRecording);

  useEffect(() => {
    onAutoSubmitRef.current = onAutoSubmit;
    onStartRecordingRef.current = onStartRecording;
  }, [onAutoSubmit, onStartRecording]);

  const cleanupAudio = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const startListening = useCallback(async () => {
    // Clear previous session prompt and transcript
    setError(null);
    setTranscript('');
    setInterimTranscript('');
    audioChunksRef.current = [];

    // Notify parent to clear previous response text
    if (onStartRecordingRef.current) {
      onStartRecordingRef.current();
    }

    // Check mediaDevices support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Microphone access is not supported in this browser. Please try Chrome, Edge, or Firefox.');
      return;
    }

    try {
      // 1. Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // 2. Setup Web Audio API Analyzer for live waveform meter
      try {
        const win = window as unknown as IWindow;
        const AudioCtx = window.AudioContext || win.webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          analyserRef.current = analyser;

          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const updateMeter = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);

            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));

            animationFrameRef.current = requestAnimationFrame(updateMeter);
          };
          updateMeter();
        }
      } catch (audioCtxErr) {
        console.warn('AudioContext analyzer could not start:', audioCtxErr);
      }

      // 3. Setup MediaRecorder for recording audio to send to Groq Whisper
      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        }
      }

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.start(100);
      setIsListening(true);

      // 4. In parallel, run Web Speech API for instant interim feedback if supported
      try {
        const win = window as unknown as IWindow;
        const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (e: any) => {
            let interim = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
              const res = e.results[i];
              if (res.isFinal) {
                setTranscript((prev) => (prev ? `${prev} ${res[0].transcript}` : res[0].transcript));
              } else {
                interim += res[0].transcript;
              }
            }
            setInterimTranscript(interim);
          };

          recognition.onerror = (e: any) => {
            console.warn('Web Speech API interim notice:', e.error);
          };

          recognition.start();
          recognitionRef.current = recognition;
        }
      } catch {
        // Fallback silently to Groq Whisper
      }
    } catch (err: any) {
      console.error('Microphone error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone permission was denied. Please allow microphone access in your browser.');
      } else {
        setError(`Microphone error: ${err.message || 'Could not access audio device.'}`);
      }
      cleanupAudio();
      setIsListening(false);
    }
  }, [cleanupAudio]);

  const stopListening = useCallback(() => {
    if (!mediaRecorderRef.current || !isListening) {
      cleanupAudio();
      setIsListening(false);
      return;
    }

    setIsListening(false);
    const recorder = mediaRecorderRef.current;

    recorder.onstop = async () => {
      const chunks = audioChunksRef.current;
      cleanupAudio();

      if (chunks.length === 0) return;

      const audioBlob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });

      // Transcribe recorded audio with Groq Whisper
      setIsTranscribing(true);
      setError(null);

      try {
        const whisperResult = await transcribeAudioWithGroqWhisper(audioBlob);
        if (whisperResult) {
          setTranscript(whisperResult);
          setInterimTranscript('');

          // Immediately send the transcribed text to AI automatically!
          if (onAutoSubmitRef.current) {
            onAutoSubmitRef.current(whisperResult);
          }
        }
      } catch (whisperErr: any) {
        console.error('Groq Whisper error:', whisperErr);
        if (!transcript) {
          setError(`Whisper transcription error: ${whisperErr.message}`);
        }
      } finally {
        setIsTranscribing(false);
      }
    };

    try {
      recorder.stop();
    } catch {
      cleanupAudio();
    }
  }, [isListening, transcript, cleanupAudio]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  const setManualTranscript = useCallback((text: string) => {
    setTranscript(text);
  }, []);

  return {
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
  };
}
