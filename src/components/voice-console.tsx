'use client';

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useSpeechRecognition } from "../hooks/use-speech-recognition";

interface VoiceConsoleProps {
  onTranscriptSubmitted: (transcript: string) => void;
  busy: boolean;
}

export const VoiceConsole = ({ onTranscriptSubmitted, busy }: VoiceConsoleProps) => {
  const { status, transcript, start, stop, supported } = useSpeechRecognition({
    interimResults: true,
    continuous: false,
    onResult: onTranscriptSubmitted
  });

  useEffect(() => {
    if (!supported && typeof window !== "undefined" && "speechSynthesis" in window) {
      const message =
        "Speech recognition is not supported in this browser yet. Try Chrome or Edge for the full experience.";
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(message));
    }
  }, [supported]);

  const toggle = () => {
    if (status === "listening") {
      stop();
    } else if (status !== "unsupported") {
      start();
    }
  };

  return (
    <div className="relative flex flex-col gap-4 rounded-3xl border border-slate-700/60 bg-slate-900/60 p-6 shadow-glass">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-200/80">Voice Link</p>
          <p className="text-2xl font-bold text-white">Speak to Jarvis</p>
        </div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-400">
          <span
            className={`size-2 rounded-full ${
              status === "listening"
                ? "animate-pulse bg-emerald-400"
                : status === "unsupported"
                  ? "bg-rose-500"
                  : "bg-slate-500"
            }`}
          />
          {status.toUpperCase()}
        </div>
      </div>

      <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-3xl border border-slate-600/50 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <AnimatePresence initial={false}>
          <motion.div
            key={status}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.24 }}
            className="text-center"
          >
            <p className="text-sm uppercase tracking-[0.45em] text-brand-200/60">Jarvis Assistant</p>
            <p className="mt-2 text-3xl font-semibold text-brand-100">
              {status === "listening"
                ? "Listening..."
                : status === "processing"
                  ? "Processing"
                  : supported
                    ? "Tap to begin"
                    : "Voice unavailable"}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {supported
                ? "Hold a natural conversation. Jarvis orchestrates voice, messaging, automations and more."
                : "Your browser does not support the SpeechRecognition API."}
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggle}
          disabled={!supported || busy}
          className="absolute bottom-6 inline-flex items-center gap-3 rounded-full bg-brand-500 px-6 py-3 font-semibold uppercase tracking-[0.3em] text-white shadow-glass transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-slate-600/80"
        >
          <span>{status === "listening" ? "Stop" : "Talk"}</span>
          <span className="text-base">{status === "listening" ? "⏹️" : "🎙️"}</span>
        </motion.button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Live Transcript</p>
        <p className="mt-2 min-h-[2.5rem] text-sm text-brand-100">
          {transcript.interim || transcript.final || "Waiting for your command."}
        </p>
      </div>
    </div>
  );
};
