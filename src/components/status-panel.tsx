'use client';

import type { JarvisCommand } from "../lib/types";

interface StatusPanelProps {
  metrics: {
    total: number;
    successRate: number;
    averageConfidence: number;
  };
  activeOutcomeTitle?: string;
  activeOutcomeDetails?: string;
  commands: JarvisCommand[];
}

const formatConfidence = (value: number) => `${value}%`;

export const StatusPanel = ({ metrics, activeOutcomeTitle, activeOutcomeDetails, commands }: StatusPanelProps) => {
  return (
    <aside className="flex flex-col gap-4 rounded-3xl border border-slate-700/60 bg-gradient-to-br from-slate-900/80 via-slate-950/90 to-slate-950/80 p-6 shadow-glass">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-200/80">Jarvis Ops</p>
        <p className="text-2xl font-bold text-white">Mission Feed</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-700/60 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Total Actions</p>
          <p className="mt-2 text-3xl font-semibold text-brand-100">{metrics.total}</p>
        </div>
        <div className="rounded-2xl border border-slate-700/60 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Success Rate</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-200">{metrics.successRate}%</p>
        </div>
        <div className="rounded-2xl border border-slate-700/60 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Avg Confidence</p>
          <p className="mt-2 text-3xl font-semibold text-brand-200">{formatConfidence(metrics.averageConfidence)}</p>
        </div>
        <div className="rounded-2xl border border-slate-700/60 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Live Status</p>
          <p className="mt-2 text-slate-300">{activeOutcomeTitle ?? "Awaiting command"}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-400/40 bg-brand-400/10 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">Now Executing</p>
        <p className="mt-2 text-sm text-brand-100">{activeOutcomeDetails ?? "No active pipeline."}</p>
      </div>

      <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Recent Modes</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {commands.slice(0, 4).map((command) => (
            <li key={command.id} className="flex items-center justify-between rounded-xl bg-slate-950/60 px-3 py-2">
              <span className="text-slate-200">{command.parsedIntent?.action ?? "system"}</span>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {Math.round((command.parsedIntent?.confidence ?? 0) * 100)}%
              </span>
            </li>
          ))}
          {commands.length === 0 && <li className="text-slate-500">Speak a command to populate the log.</li>}
        </ul>
      </div>
    </aside>
  );
};
