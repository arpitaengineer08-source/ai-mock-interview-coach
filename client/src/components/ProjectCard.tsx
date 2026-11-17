import { Boxes, Code2, Rocket } from "lucide-react";
import type { Project } from "../types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white">{project.title}</h3>
          <p className="mt-1 text-sm text-indigo-300">{project.oneLiner}</p>
        </div>
        <Rocket className="h-5 w-5 shrink-0 text-indigo-400" />
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-400">{project.problem}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500"><Boxes className="h-4 w-4" /> Architecture</h4>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.architecture.map((x) => <span key={x} className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">{x}</span>)}
          </div>
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500"><Code2 className="h-4 w-4" /> Stack</h4>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.techStack.map((x) => <span key={x} className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">{x}</span>)}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Core features</h4>
        <ul className="mt-2 space-y-1 text-sm text-slate-300">
          {project.coreFeatures.map((x) => <li key={x}>• {x}</li>)}
        </ul>
      </div>

      <div className="mt-4 border-t border-slate-800 pt-4 text-sm text-slate-300">
        <span className="font-semibold text-white">Resume story:</span> {project.resumeImpact}
      </div>
    </div>
  );
}
