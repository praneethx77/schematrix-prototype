import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseVoiceToTextOptions {
  language?: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (errorMessage: string) => void;
  continuous?: boolean;
}

const LANGUAGE_LOCALE_MAP: Record<string, string> = {
  English: 'en-IN',
  Hindi: 'hi-IN',
  Tamil: 'ta-IN',
  Telugu: 'te-IN',
  Bengali: 'bn-IN',
  Gujarati: 'gu-IN',
  Marathi: 'mr-IN'
};

export function useVoiceToText({
  language = 'English',
  onResult,
  onError,
  continuous = false
}: UseVoiceToTextOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore already stopped
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const startListening = useCallback(() => {
    setError(null);
    setInterimTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      const fallbackMsg = 'Voice recognition is not natively supported in this browser. Please use Chrome or Edge.';
      setError(fallbackMsg);
      onError?.(fallbackMsg);
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      const locale = LANGUAGE_LOCALE_MAP[language] || 'en-IN';
      recognition.lang = locale;
      recognition.continuous = continuous;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalChunk += item[0].transcript;
          } else {
            currentInterim += item[0].transcript;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
          onResult?.(currentInterim, false);
        }

        if (finalChunk) {
          setTranscript((prev) => {
            const next = prev ? `${prev} ${finalChunk}` : finalChunk;
            return next.trim();
          });
          setInterimTranscript('');
          onResult?.(finalChunk.trim(), true);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        let errorMsg = 'Could not capture speech.';
        if (event.error === 'not-allowed') {
          errorMsg = 'Microphone permission was denied. Please allow microphone access.';
        } else if (event.error === 'no-speech') {
          errorMsg = 'No speech detected. Please speak closer to your microphone.';
        } else if (event.error === 'network') {
          errorMsg = 'Network error while contacting speech recognition service.';
        }

        setError(errorMsg);
        onError?.(errorMsg);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.start();
    } catch (err: any) {
      console.warn('Failed to start speech recognition:', err);
      setIsListening(false);
      setError('Could not initialize microphone.');
      onError?.('Could not initialize microphone.');
    }
  }, [language, continuous, onResult, onError]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript
  };
}
