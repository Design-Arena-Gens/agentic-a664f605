'use client';

import { useCallback, useMemo, useReducer } from "react";
import { emulateExecution, intentFromCommand } from "../lib/command-processor";
import type { JarvisCommand, JarvisOutcome } from "../lib/types";

type JarvisState = {
  commands: JarvisCommand[];
  activeOutcome?: JarvisOutcome;
};

type JarvisAction =
  | { type: "enqueue"; command: JarvisCommand }
  | { type: "intent"; id: string; intentSummary: string; confidence: number }
  | { type: "complete"; id: string; outcome: JarvisOutcome }
  | { type: "fail"; id: string; error: string }
  | { type: "clear" };

const jarvisReducer = (state: JarvisState, action: JarvisAction): JarvisState => {
  switch (action.type) {
    case "enqueue":
      return {
        ...state,
        commands: [action.command, ...state.commands].slice(0, 24)
      };
    case "intent":
      return {
        ...state,
        commands: state.commands.map((cmd) =>
          cmd.id === action.id && cmd.parsedIntent
            ? {
                ...cmd,
                parsedIntent: {
                  ...cmd.parsedIntent,
                  summary: action.intentSummary,
                  confidence: action.confidence
                }
              }
            : cmd
        )
      };
    case "complete":
      return {
        ...state,
        activeOutcome: action.outcome,
        commands: state.commands.map((cmd) =>
          cmd.id === action.id
            ? {
                ...cmd,
                status: "completed",
                outcome: action.outcome
              }
            : cmd
        )
      };
    case "fail":
      return {
        ...state,
        commands: state.commands.map((cmd) =>
          cmd.id === action.id
            ? {
                ...cmd,
                status: "failed",
                outcome: {
                  title: "Failed",
                  timestamp: Date.now(),
                  details: action.error
                }
              }
            : cmd
        )
      };
    case "clear":
      return { commands: [], activeOutcome: undefined };
    default:
      return state;
  }
};

let counter = 0;
const nextId = () => `cmd-${Date.now()}-${counter++}`;

export const useJarvis = () => {
  const [state, dispatch] = useReducer(jarvisReducer, { commands: [] });

  const submitCommand = useCallback((input: string) => {
    const id = nextId();
    const intent = intentFromCommand(input);

    const command: JarvisCommand = {
      id,
      input,
      parsedIntent: intent,
      status: "processing",
      createdAt: Date.now(),
      outcome: undefined,
      type: intent.action
    };

    dispatch({ type: "enqueue", command });

    try {
      const outcome = emulateExecution(intent);
      dispatch({ type: "complete", id, outcome });
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(outcome.details);
        utterance.rate = 1.02;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error("Jarvis execution failed", error);
      dispatch({ type: "fail", id, error: error instanceof Error ? error.message : "Unknown error" });
    }
  }, []);

  const resetTimeline = useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

  const metrics = useMemo(() => {
    const completed = state.commands.filter((cmd) => cmd.status === "completed");
    const successRate =
      state.commands.length > 0 ? Math.round((completed.length / state.commands.length) * 100) : 100;
    const averageConfidence =
      completed.reduce((acc, cmd) => acc + (cmd.parsedIntent?.confidence ?? 0), 0) /
      (completed.length || 1);

    return {
      total: state.commands.length,
      successRate,
      averageConfidence: Math.round(averageConfidence * 100)
    };
  }, [state.commands]);

  return {
    commands: state.commands,
    activeOutcome: state.activeOutcome,
    submitCommand,
    resetTimeline,
    metrics
  };
};
