import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Project, Setup } from "../types";
import { api } from "../lib/api";
import { ProjectCard } from "./ProjectCard";

export function ProjectsView({ setup, onExit }: { setup: Setup; onExit: () => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.projects(setup)
      .then((data) => setProjects(data.projects))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load projects"))
      .finally(() => setLoading(false));
  }, [setup]);

  return (
    <div>
      <button className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white" onClick={onExit}>
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </button>

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">PORTFOLIO LAB</p>
        <h1 className="mt-1 text-3xl font-bold text-white">Resume-worthy project concepts</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Ideas are tailored to your selected role and focus areas, with an emphasis on real engineering constraints.
        </p>
      </div>

      {loading && <div className="card flex min-h-48 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-indigo-400" /></div>}
      {error && <div className="rounded-xl border border-red-900/60 bg-red-950/30 p-4 text-sm text-red-200">{error}</div>}
      {!loading && !error && <div className="grid gap-5 lg:grid-cols-3">{projects.map((p) => <ProjectCard key={p.title} project={p} />)}</div>}
    </div>
  );
}
