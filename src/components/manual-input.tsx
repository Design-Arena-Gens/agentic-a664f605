'use client';

import { FormEvent, useState } from "react";

interface ManualInputProps {
  onSubmit: (command: string) => void;
  loading: boolean;
}

export const ManualInput = ({ onSubmit, loading }: ManualInputProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-3xl border border-slate-700/60 bg-slate-900/70 p-6 shadow-glass"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-200/80">Command Pad</p>
        <p className="text-2xl font-bold text-white">Type a Request</p>
      </div>
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          value={value}
          placeholder="e.g. Jarvis, schedule a call with Alex tomorrow at 9 AM."
          onChange={(event) => setValue(event.target.value)}
          className="flex-1 rounded-2xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-brand-400 focus:bg-slate-950"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-[3.25rem] rounded-2xl bg-brand-500 px-6 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-slate-600/80"
        >
          Deploy
        </button>
      </div>
      <p className="text-xs text-slate-500">
        Jarvis will infer intents, route to phone subsystems, and confirm the simulated outcome instantly.
      </p>
    </form>
  );
};
