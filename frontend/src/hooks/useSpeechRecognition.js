import { useState, useRef, useEffect, useCallback } from 'react';

const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally', 'so', 'right'];

export const useSpeechRecognition = (lang = 'en-IN') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState(null);

  // Fluency analytics state
  const [wordsPerMin, setWordsPerMin] = useState(0);
  const [fillerCount, setFillerCount] = useState(0);
  const [fillerBreakdown, setFillerBreakdown] = useState({});
  const [pauseCount, setPauseCount] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [wordPauses, setWordPauses] = useState([]); // [{ word, pauseSeconds }]

  const recognitionRef = useRef(null);
  const startTimeRef = useRef(null);
  const lastWordTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const recordedWordsRef = useRef([]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      startTimeRef.current = Date.now();
      lastWordTimeRef.current = Date.now();

      timerIntervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setDurationSec(elapsed);
        }
      }, 500);
    };

    recognition.onresult = (event) => {
      let currentFinal = '';
      let currentInterim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const item = event.results[i];
        if (item.isFinal) {
          currentFinal += item[0].transcript + ' ';
        } else {
          currentInterim += item[0].transcript;
        }
      }

      if (currentFinal) {
        const now = Date.now();
        const newWords = currentFinal.trim().split(/\s+/).filter(Boolean);

        newWords.forEach((word) => {
          const pauseSec = lastWordTimeRef.current
            ? Math.max(0, (now - lastWordTimeRef.current) / 1000)
            : 0;

          recordedWordsRef.current.push({
            word,
            pauseSeconds: Math.round(pauseSec * 10) / 10,
          });

          lastWordTimeRef.current = now;
        });

        setTranscript((prev) => (prev ? prev + ' ' + currentFinal.trim() : currentFinal.trim()));
        setWordPauses([...recordedWordsRef.current]);
      }

      setInterimTranscript(currentInterim);
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition status:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please grant permission in browser settings.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [lang]);

  // Compute live fluency metrics whenever transcript changes
  useEffect(() => {
    const text = transcript.toLowerCase();
    if (!text.trim()) {
      setWordsPerMin(0);
      setFillerCount(0);
      setFillerBreakdown({});
      setPauseCount(0);
      return;
    }

    const words = text.trim().split(/\s+/);
    const wordCount = words.length;

    // Speaking pace WPM
    const elapsedMinutes = Math.max(durationSec / 60, 0.1);
    const wpm = Math.round(wordCount / elapsedMinutes);
    setWordsPerMin(Math.min(wpm, 300));

    // Filler words detection & breakdown
    let totalFillers = 0;
    const breakdown = {};

    FILLER_WORDS.forEach((fw) => {
      const regex = new RegExp(`\\b${fw}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        breakdown[fw] = matches.length;
        totalFillers += matches.length;
      }
    });

    setFillerCount(totalFillers);
    setFillerBreakdown(breakdown);

    // Pause count (pauses > 1.2s)
    const longPauses = recordedWordsRef.current.filter((w) => w.pauseSeconds >= 1.2).length;
    setPauseCount(longPauses);
  }, [transcript, durationSec]);

  const startListening = useCallback(() => {
    setError(null);
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.log('Recognition already active or restart:', e);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {
      console.log('Recognition stop error:', e);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setWordsPerMin(0);
    setFillerCount(0);
    setFillerBreakdown({});
    setPauseCount(0);
    setDurationSec(0);
    setWordPauses([]);
    recordedWordsRef.current = [];
    startTimeRef.current = null;
    lastWordTimeRef.current = null;
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    supported,
    error,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
    metrics: {
      wordsPerMin,
      fillerCount,
      fillerBreakdown,
      pauseCount,
      durationSec,
      wordPauses,
    },
  };
};
