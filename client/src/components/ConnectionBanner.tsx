import { useEffect, useState } from "react";
import { CheckCircle2, Cpu, Download, RefreshCw, WifiOff } from "lucide-react";
import { api } from "../lib/api";

export function ConnectionBanner() {
  const [status, setStatus] = useState<{
    online: boolean;
    selectedModel: string | null;
    models: string[];
    error?: string;
  } | null>(null);
  const [checking, setChecking] = useState(false);

  async function check() {
    setChecking(true);
    try {
      setStatus(await api.ollamaStatus());
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    check();
  }, []);

  if (!status) {
    return (
      <div className="card mb-6 flex items-center gap-3 px-4 py-3 text-sm text-slate-300">
        <Cpu className="h-4 w-4 animate-pulse" /> Checking local AI connection...
      </div>
    );
  }

  if (status.online && status.selectedModel) {
    return (
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-900/60 bg-emerald-950/30 px-4 py-3 text-sm">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <span className="text-emerald-200">
            Ollama connected · using <strong>{status.selectedModel}</strong>
          </span>
        </div>
        <button className="btn-secondary py-2 text-xs" onClick={check} disabled={checking}>
          <RefreshCw className={`mr-2 h-3.5 w-3.5 ${checking ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>
    );
  }

  return null;
  return (
    <div className="mb-6 rounded-2xl border border-amber-900/60 bg-amber-950/30 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-3">
          <WifiOff className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="font-semibold text-amber-100">Ollama isn't available — fallback mode is active.</p>
            <p className="mt-1 text-sm text-amber-200/75">
              You can keep practicing normally. To enable local AI, install Ollama and run one supported model.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <code className="rounded-lg bg-black/30 px-2 py-1">ollama pull qwen3:8b</code>
              <code className="rounded-lg bg-black/30 px-2 py-1">ollama pull llama3.1:8b</code>
              <code className="rounded-lg bg-black/30 px-2 py-1">ollama pull mistral:7b</code>
            </div>
          </div>
        </div>
        <a
          className="btn-secondary py-2 text-xs"
          href="https://ollama.com"
          target="_blank"
          rel="noreferrer"
        >
          <Download className="mr-2 h-3.5 w-3.5" /> Install Ollama
        </a>
      </div>
      <button className="mt-3 text-xs text-amber-300 underline" onClick={check} disabled={checking}>
        {checking ? "Checking..." : "Check again"}
      </button>
    </div>
  );
}
