'use client';

import { motion } from "framer-motion";
import { quickActions } from "../lib/data";

interface QuickActionsProps {
  onActionSelect: (prompt: string) => void;
}

export const QuickActions = ({ onActionSelect }: QuickActionsProps) => {
  return (
    <section className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-200/80">Playbooks</p>
          <p className="text-2xl font-bold text-white">Instant Routines</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {quickActions.map((collection) => (
          <div key={collection.category} className="rounded-2xl border border-slate-700/60 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{collection.category}</p>
            <div className="mt-4 space-y-3">
              {collection.items.map((item) => (
                <motion.button
                  key={item.title}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onActionSelect(item.prompt)}
                  className="block w-full rounded-2xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-left transition hover:border-brand-300/70 hover:bg-brand-500/20"
                >
                  <p className="text-sm font-semibold text-brand-100">{item.title}</p>
                  <p className="mt-2 text-xs text-brand-200/80">{item.prompt}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.3em] text-brand-200/60">{item.hint}</p>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
