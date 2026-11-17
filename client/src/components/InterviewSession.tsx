import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Send, Sparkles } from "lucide-react";
import type { Evaluation, Question, Setup } from "../types";
import { api } from "../lib/api";
import { ScoreCard } from "./ScoreCard";

type Props = {
  setup: Setup;
  onExit: () => void;
};

export function InterviewSession({ setup, onExit }: Props) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadQuestion() {
    setLoading(true);
    setEvaluation(null);
    setAnswer("");
    setError("");
    try {
      const q = await api.nextQuestion(setup, previousQuestions);
      setQuestion(q);
      setPreviousQuestions((prev) => [...prev, q.question]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load question");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuestion();
    // Intentionally start once for this session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit() {
    if (!question || !answer.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      setEvaluation(await api.evaluate(setup, question.question, answer));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not evaluate answer");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <button className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white" onClick={onExit}>
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </button>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">{setup.role} · {setup.experience}</p>
          <h1 className="mt-1 text-2xl font-bold text-white">Mock interview session</h1>
        </div>
        {question?.mode && (
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-400">
            {question.mode === "ollama" ? `Local AI · ${question.model}` : "Fallback engine"}
          </span>
        )}
      </div>

      {error && <div className="mb-5 rounded-xl border border-red-900/60 bg-red-950/30 p-4 text-sm text-red-200">{error}</div>}

      {loading ? (
        <div className="card flex min-h-64 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-400" />
            <p className="mt-3 text-sm text-slate-400">Preparing your question...</p>
          </div>
        </div>
      ) : question ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="card p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">{question.category}</span>
              <span className="text-xs text-slate-500">{question.difficulty}</span>
            </div>

            <h2 className="mt-6 text-2xl font-bold leading-9 text-white">{question.question}</h2>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Why this matters</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{question.whyItMatters}</p>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">What a strong answer covers</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-300">
                {question.whatGoodLooksLike.map((x, i) => <li key={i}>• {x}</li>)}
              </ul>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <h3 className="font-semibold text-white">Your answer</h3>
            </div>

            <textarea
              className="mt-4 min-h-72 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-600 focus:border-indigo-500"
              placeholder="Think aloud. State assumptions, architecture, trade-offs, edge cases and testing..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <button className="btn-primary mt-4 w-full" onClick={submit} disabled={submitting || !answer.trim()}>
              {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Evaluating...</> : <><Send className="mr-2 h-4 w-4" /> Get structured feedback</>}
            </button>

            {evaluation && (
              <button className="btn-secondary mt-3 w-full" onClick={loadQuestion}>
                Next question
              </button>
            )}
          </div>
        </div>
      ) : null}

      {evaluation && (
        <div className="mt-6">
          <ScoreCard evaluation={evaluation} />
        </div>
      )}
    </div>
  );
}
