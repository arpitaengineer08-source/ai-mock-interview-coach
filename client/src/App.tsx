import { useState } from "react";
import { BrainCircuit, Github, Menu, X } from "lucide-react";
import { ConnectionBanner } from "./components/ConnectionBanner";
import { Dashboard } from "./components/Dashboard";
import { InterviewSession } from "./components/InterviewSession";
import { ProjectsView } from "./components/ProjectsView";
import type { Setup } from "./types";

type View = "dashboard" | "interview" | "projects";

const initialSetup: Setup = {
  role: "Software Engineer",
  experience: "Fresher",
  focus: ["DSA", "Backend"],
  difficulty: "Medium"
};

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [setup, setSetup] = useState<Setup>(initialSetup);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <button className="flex items-center gap-3" onClick={() => setView("dashboard")}>
            <div className="rounded-xl bg-indigo-500/15 p-2"><BrainCircuit className="h-5 w-5 text-indigo-400" /></div>
            <div className="text-left">
              <div className="font-bold text-white">InterviewOS</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">AI Mock Coach</div>
            </div>
          </button>

          <nav className="hidden items-center gap-2 md:flex">
            <button className={`btn-secondary py-2 text-sm ${view === "dashboard" ? "border-indigo-500/50 text-white" : ""}`} onClick={() => setView("dashboard")}>Dashboard</button>
            <button className={`btn-secondary py-2 text-sm ${view === "projects" ? "border-indigo-500/50 text-white" : ""}`} onClick={() => setView("projects")}>Project Lab</button>
            <a className="btn-secondary py-2 text-sm" href="https://github.com" target="_blank" rel="noreferrer"><Github className="mr-2 h-4 w-4" /> Code</a>
          </nav>

          <button className="rounded-xl border border-slate-700 p-2 md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-800 px-4 py-3 md:hidden">
            <div className="grid gap-2">
              <button className="btn-secondary" onClick={() => { setView("dashboard"); setMobileOpen(false); }}>Dashboard</button>
              <button className="btn-secondary" onClick={() => { setView("projects"); setMobileOpen(false); }}>Project Lab</button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-7 md:px-6 md:py-10">
        <ConnectionBanner />

        {view === "dashboard" && (
          <Dashboard
            setup={setup}
            setSetup={setSetup}
            onStart={() => setView("interview")}
            onProjects={() => setView("projects")}
          />
        )}

        {view === "interview" && <InterviewSession setup={setup} onExit={() => setView("dashboard")} />}

        {view === "projects" && <ProjectsView setup={setup} onExit={() => setView("dashboard")} />}
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-8 text-xs text-slate-600 md:px-6">
        Local-first inference · structured JSON · automatic fallback
      </footer>
    </div>
  );
}
