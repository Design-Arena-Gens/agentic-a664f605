'use client';

import { useMemo } from "react";
import { ManualInput } from "@/components/manual-input";
import { CommandTimeline } from "@/components/command-timeline";
import { QuickActions } from "@/components/quick-actions";
import { StatusPanel } from "@/components/status-panel";
import { VoiceConsole } from "@/components/voice-console";
import { useJarvis } from "@/hooks/use-jarvis";
import { appShortcuts, contacts } from "@/lib/data";

export default function Page() {
  const { commands, submitCommand, resetTimeline, metrics, activeOutcome } = useJarvis();

  const busy = useMemo(() => commands.some((command) => command.status === "processing"), [commands]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center">
        <div className="flex-1 space-y-4">
          <p className="text-xs uppercase tracking-[0.6em] text-brand-200/80">Jarvis OS</p>
          <h1 className="text-5xl font-bold text-white md:text-6xl">
            Command your digital life with{" "}
            <span className="bg-gradient-to-r from-brand-200 via-brand-100 to-white bg-clip-text text-transparent">
              pure voice.
            </span>
          </h1>
          <p className="max-w-xl text-lg text-slate-300">
            Jarvis links voice recognition, intelligent intent routing, and multi-device automation to mirror a
            personal phone assistant—without lifting a finger.
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
            <span className="rounded-full border border-brand-500/40 px-3 py-2">Hands-free calling</span>
            <span className="rounded-full border border-brand-500/40 px-3 py-2">Smart messaging</span>
            <span className="rounded-full border border-brand-500/40 px-3 py-2">Automation scripts</span>
            <span className="rounded-full border border-brand-500/40 px-3 py-2">Contextual AI</span>
          </div>
        </div>
        <StatusPanel
          metrics={metrics}
          activeOutcomeTitle={activeOutcome?.title}
          activeOutcomeDetails={activeOutcome?.details}
          commands={commands}
        />
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 pb-12 lg:grid-cols-[2fr_1.2fr]">
        <div className="flex flex-col gap-6">
          <VoiceConsole onTranscriptSubmitted={submitCommand} busy={busy} />
          <ManualInput onSubmit={submitCommand} loading={busy} />
          <QuickActions onActionSelect={submitCommand} />
        </div>
        <CommandTimeline commands={commands} onReset={resetTimeline} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-16">
        <div className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-200/80">Device graph</p>
          <p className="text-2xl font-bold text-white">Known Contacts & App Surface</p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-950/70 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Priority Contacts</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                {contacts.map((contact) => (
                  <li
                    key={contact.phone}
                    className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-950/60 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-brand-100">{contact.name}</p>
                      <p className="text-xs text-brand-200/70">{contact.phone}</p>
                    </div>
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      {contact.tags?.join(" • ") ?? "contact"}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-950/70 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Integrated Apps</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {appShortcuts.map((app) => (
                  <div key={app.id} className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{app.icon}</span>
                      <p className="text-sm font-semibold text-brand-100">{app.name}</p>
                    </div>
                    <p className="mt-2 text-xs text-brand-200/80">{app.description}</p>
                    <p className="mt-3 text-[0.65rem] uppercase tracking-[0.3em] text-brand-200/60">
                      {app.keywords.join(" • ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
