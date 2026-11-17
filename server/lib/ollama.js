const BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS || 25000);

export const MODEL_PRIORITY = ["qwen3:8b", "llama3.1:8b", "mistral:7b"];

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function getOllamaModels() {
  const response = await fetchWithTimeout(`${BASE_URL}/api/tags`);
  if (!response.ok) {
    throw new Error(`Ollama tags request failed: ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data.models) ? data.models : [];
}

export async function getOllamaStatus() {
  try {
    const models = await getOllamaModels();
    const names = models.map((m) => m.name);
    const selectedModel =
      MODEL_PRIORITY.find((model) =>
        names.some((name) => name === model || name.startsWith(`${model}:`))
      ) || null;

    return {
      online: true,
      selectedModel,
      models: names,
      baseUrl: BASE_URL
    };
  } catch (error) {
    return {
      online: false,
      selectedModel: null,
      models: [],
      baseUrl: BASE_URL,
      error: error.message
    };
  }
}

export async function selectModel() {
  const status = await getOllamaStatus();
  if (!status.online || !status.selectedModel) return null;
  return status.selectedModel;
}

export async function generateWithOllama(prompt, model) {
  const response = await fetchWithTimeout(`${BASE_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      format: "json",
      options: {
        temperature: 0.65,
        top_p: 0.9
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama generate failed: ${response.status}`);
  }

  const data = await response.json();
  return data.response;
}
