'use client';

import { useCallback, useEffect, useRef, useState } from "react";

type RecognitionStatus = "idle" | "listening" | "processing" | "unsupported" | "error";

interface SpeechRecognitionTranscript {
  interim: string;
  final: string;
}

interface UseSpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string) => void;
}

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onstart: ((event: Event) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
};

type SpeechRecognitionResultListLike = {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
};

type SpeechRecognitionResultLike = {
  length: number;
  isFinal: boolean;
  [index: number]: {
    transcript: string;
  };
};

type SpeechRecognitionErrorEventLike = {
  error: string;
};

type RecognitionInstance = SpeechRecognitionLike | null;

const getRecognition = (): RecognitionInstance => {
  if (typeof window === "undefined") return null;
  const speechWindow = window as typeof window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  const SpeechRecognitionImpl = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

  if (!SpeechRecognitionImpl) return null;
  return new SpeechRecognitionImpl();
};

export const useSpeechRecognition = ({
  lang = "en-US",
  continuous = false,
  interimResults = true,
  onResult
}: UseSpeechRecognitionOptions = {}) => {
  const [status, setStatus] = useState<RecognitionStatus>("idle");
  const [transcript, setTranscript] = useState<SpeechRecognitionTranscript>({ interim: "", final: "" });
  const recognitionRef = useRef<RecognitionInstance>(null);

  useEffect(() => {
    recognitionRef.current = getRecognition();
    if (!recognitionRef.current) {
      setStatus("unsupported");
      return;
    }

    const recognition = recognitionRef.current;
    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onstart = () => setStatus("listening");
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setStatus("error");
    };
    recognition.onend = () => {
      setStatus((prev) => (prev === "processing" ? "idle" : prev === "listening" ? "idle" : prev));
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += chunk;
        } else {
          interim += chunk;
        }
      }

      setTranscript({ interim, final });
      if (final && onResult) {
        onResult(final.trim());
      }
    };

    return () => {
      recognition.onstart = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.onresult = null;
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [continuous, interimResults, lang, onResult]);

  const start = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setStatus("unsupported");
      return;
    }
    try {
      recognition.start();
      setStatus("listening");
      setTranscript({ interim: "", final: "" });
    } catch (error) {
      console.error("Failed to start recognition", error);
      setStatus("error");
    }
  }, []);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    recognition.stop();
    setStatus("processing");
  }, []);

  return {
    status,
    transcript,
    start,
    stop,
    supported: status !== "unsupported"
  };
};
