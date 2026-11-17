import { extractJson } from "../lib/json.js";
import { generateWithOllama, selectModel } from "../lib/ollama.js";
import { fallbackEvaluation, fallbackMentor, fallbackProjects, fallbackQuestion } from "../lib/fallback.js";

async function runAI(prompt, fallbackFactory, requiredKeys, input) {
  try {
    const model = await selectModel();
    if (!model) return fallbackFactory(input);

    const raw = await generateWithOllama(prompt, model);
    const parsed = extractJson(raw);

    for (const key of requiredKeys) {
      if (!(key in parsed)) throw new Error(`AI response missing ${key}`);
    }

    return { ...parsed, mode: "ollama", model };
  } catch (error) {
    console.warn("Ollama unavailable or invalid response; using fallback:", error.message);
    return fallbackFactory(input);
  }
}

export async function generateQuestion(input, prompt) {
  return runAI(prompt, fallbackQuestion, ["question", "category", "difficulty"], input);
}

export async function evaluateAnswer(input, prompt) {
  return runAI(
    prompt,
    fallbackEvaluation,
    ["overallScore", "communicationScore", "technicalScore", "problemSolvingScore", "strengths", "improvements"],
    input
  );
}

export async function suggestProjects(input, prompt) {
  return runAI(prompt, fallbackProjects, ["projects"], input);
}

export async function mentor(input, prompt) {
  return runAI(prompt, fallbackMentor, ["priority", "nextActions", "practicePlan", "mentorMessage"], input);
}
