import type { Evaluation, Project, Question, Setup } from "../types";

const request = async <T>(url: string, body?: unknown): Promise<T> => {
  const response = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
};

export const api = {
  ollamaStatus: () =>
    request<{ online: boolean; selectedModel: string | null; models: string[]; error?: string }>("/api/ollama/status"),

  nextQuestion: (setup: Setup, previousQuestions: string[]) =>
    request<Question>("/api/interview/question", { ...setup, previousQuestions }),

  evaluate: (setup: Setup, question: string, answer: string) =>
    request<Evaluation>("/api/interview/evaluate", { ...setup, question, answer }),

  projects: (setup: Setup) =>
    request<{ projects: Project[] }>("/api/projects/suggest", setup),

  mentor: (setup: Setup, recentScore?: number) =>
    request<{ priority: string; nextActions: string[]; practicePlan: string[]; mentorMessage: string }>("/api/interview/mentor", {
      ...setup,
      recentScore
    })
};
