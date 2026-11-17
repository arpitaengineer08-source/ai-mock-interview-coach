import { CheckCircle2, Target, TrendingUp } from "lucide-react";
import type { Evaluation } from "../types";

export function ScoreCard({ evaluation }: { evaluation: Evaluation }) {
  const metrics = [
    ["Overall", evaluation.overallScore],
    ["Technical", evaluation.technicalScore],
    ["Problem solving", evaluation.problemSolvingScore],
    ["Communication", evaluation.communicationScore]
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">AI EVALUATION</p>
          <h3 className="mt-1 text-xl font-bold text-white">Your performance</h3>
        </div>
        <div className="rounded-2xl bg-indigo-500/15 px-4 py-3 text-center">
          <div className="text-3xl font-black text-indigo-300">{evaluation.overallScore}/10</div>
          <div className="text-[11px] text-indigo-200/70">overall</div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <div className="text-xs text-slate-500">{label}</div>
            <div className="mt-1 text-xl font-bold text-slate-100">{value}/10</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <section>
          <h4 className="flex items-center gap-2 font-semibold text-emerald-300"><CheckCircle2 className="h-4 w-4" /> Strengths</h4>
          <ul className="mt-2 space-y-2 text-sm text-slate-300">
            {evaluation.strengths.map((x, i) => <li key={i}>• {x}</li>)}
          </ul>
        </section>

        <section>
          <h4 className="flex items-center gap-2 font-semibold text-amber-300"><TrendingUp className="h-4 w-4" /> Improvements</h4>
          <ul className="mt-2 space-y-2 text-sm text-slate-300">
            {evaluation.improvements.map((x, i) => <li key={i}>• {x}</li>)}
          </ul>
        </section>

        <section>
          <h4 className="flex items-center gap-2 font-semibold text-slate-200"><Target className="h-4 w-4" /> Missed points</h4>
          <ul className="mt-2 space-y-2 text-sm text-slate-300">
            {evaluation.missedPoints.map((x, i) => <li key={i}>• {x}</li>)}
          </ul>
        </section>

        <section>
          <h4 className="font-semibold text-slate-200">Better answer structure</h4>
          <ol className="mt-2 space-y-2 text-sm text-slate-300">
            {evaluation.betterAnswerOutline.map((x, i) => <li key={i}>{i + 1}. {x}</li>)}
          </ol>
        </section>
      </div>

      <div className="mt-5 rounded-xl border border-indigo-900/60 bg-indigo-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Mentor note</p>
        <p className="mt-2 text-sm text-slate-300">{evaluation.mentorNote}</p>
      </div>

      <div className="mt-4 text-sm text-slate-400">
        Follow-up: <span className="text-slate-200">{evaluation.followUpQuestion}</span>
      </div>
    </div>
  );
}
