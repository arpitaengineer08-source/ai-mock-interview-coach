import { BrainCircuit, FolderKanban, Sparkles, Trophy } from "lucide-react";
import type { Setup } from "../types";
import { SetupCard } from "./SetupCard";

type Props = {
  setup: Setup;
  setSetup: (next: Setup) => void;
  onStart: () => void;
  onProjects: () => void;
};

export function Dashboard({ setup, setSetup, onStart, onProjects }: Props) {
  return (
    <div>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300">
          <Sparkles className="h-3.5 w-3.5" /> LOCAL-FIRST AI COACH
        </div>
        <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-white md:text-5xl">
          Practice like you're already in the interview.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
          Get realistic engineering questions, structured feedback and practical mentor guidance.
          Ollama handles local inference when available; fallback mode keeps every session usable.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          [BrainCircuit, "Adaptive questions", "Role + focus aware"],
          [Trophy, "Structured feedback", "Scores + next steps"],
          [FolderKanban, "Project ideas", "Resume-worthy builds"]
        ].map(([Icon, title, text]) => {
          const C = Icon as typeof BrainCircuit;
          return (
            <div className="card p-5" key={title as string}>
              <C className="h-5 w-5 text-indigo-400" />
              <div className="mt-3 font-semibold text-white">{title as string}</div>
              <div className="mt-1 text-sm text-slate-500">{text as string}</div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <SetupCard setup={setup} setSetup={setSetup} onStart={onStart} />

        <div className="card flex flex-col justify-between p-6">
          <div>
            <p className="text-sm font-semibold text-cyan-400">BUILD SOMETHING REAL</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Turn preparation into a portfolio signal.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Generate ideas around AI agents, RAG, automation, developer tools and SaaS.
              Each idea is framed around a real problem, architecture and measurable engineering impact.
            </p>
          </div>
          <button className="btn-secondary mt-6 w-full" onClick={onProjects}>
            Generate project ideas
          </button>
        </div>
      </div>
    </div>
  );
}
