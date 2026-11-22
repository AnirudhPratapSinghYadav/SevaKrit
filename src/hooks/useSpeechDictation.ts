import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
};

type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

/**
 * Browser Web Speech dictation for intake (adapted from Nagarakshak StepDescription).
 * Appends transcripts only — never decides eligibility. Unsupported browsers get a clear message.
 */
export function useSpeechDictation(options: {
  lang: string;
  onTranscript: (chunk: string) => void;
}) {
  const { lang, onTranscript } = options;
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;

  useEffect(() => {
    const speechWindow = window as SpeechWindow;
    const Ctor = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    setSupported(true);
    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";
    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result?.isFinal) finalTranscript += result[0]?.transcript ?? "";
      }
      if (finalTranscript.trim() !== "") onTranscriptRef.current(finalTranscript.trim());
    };
    recognition.onerror = (event) => {
      setListening(false);
      setError(
        event.error === "not-allowed"
          ? "Microphone permission was denied."
          : `Dictation stopped (${event.error}).`,
      );
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.stop();
      } catch {
        /* already stopped */
      }
      recognitionRef.current = null;
    };
  }, [lang]);

  const toggle = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setError("Speech-to-text is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    setError(null);
    if (listening) {
      recognition.stop();
      setListening(false);
      return;
    }
    try {
      recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";
      recognition.start();
      setListening(true);
    } catch {
      setError("Could not start the microphone. Try again.");
      setListening(false);
    }
  }, [lang, listening]);

  return { supported, listening, error, toggle };
}
