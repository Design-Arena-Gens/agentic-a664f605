'use client';

import { AnimatePresence, motion } from "framer-motion";
import type { JarvisCommand } from "../lib/types";

interface CommandTimelineProps {
  commands: JarvisCommand[];
  onReset: () => void;
}

export const CommandTimeline = ({ commands, onReset }: CommandTimelineProps) => {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-slate-700/60 bg-slate-900/70 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-200/80">Timeline</p>
          <p className="text-2xl font-bold text-white">Command Ledger</p>
        </div>
        <button
          onClick={onReset}
          className="rounded-full border border-brand-400/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-100 transition hover:border-brand-300/70 hover:text-brand-50"
        >
          Clear
        </button>
      </div>

      <div className="relative mt-2 max-h-[26rem] space-y-6 overflow-y-auto pr-2">
        <AnimatePresence initial={false}>
          {commands.length === 0 ? (
            <motion.div
              key="empty-timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-dashed border-slate-700/70 bg-slate-950/40 p-8 text-center"
            >
              <p className="text-sm text-slate-400">
                Jarvis will chronicle each operation here — from calls to automations and system changes.
              </p>
            </motion.div>
          ) : (
            commands.map((command) => (
              <motion.article
                key={command.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative flex flex-col gap-2 rounded-2xl border border-slate-700/60 bg-slate-950/70 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                      {new Date(command.createdAt).toLocaleTimeString()}
                    </p>
                    <p className="mt-1 text-base font-semibold text-brand-100">"{command.input}"</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] ${
                      command.status === "completed"
                        ? "bg-emerald-500/20 text-emerald-200"
                        : command.status === "processing"
                          ? "bg-brand-500/30 text-brand-100"
                          : "bg-rose-500/30 text-rose-100"
                    }`}
                  >
                    {command.status}
                  </span>
                </div>

                {command.parsedIntent && (
                  <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Intent</p>
                    <p className="mt-1 text-sm text-brand-100">{command.parsedIntent.summary}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                      Confidence • {Math.round((command.parsedIntent.confidence ?? 0) * 100)}%
                    </p>
                  </div>
                )}

                {command.outcome && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                      {command.outcome.title}
                    </p>
                    <p className="mt-1 text-sm text-emerald-100">{command.outcome.details}</p>
                  </div>
                )}
              </motion.article>
            ))
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
