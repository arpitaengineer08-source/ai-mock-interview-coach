export function extractJson(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Empty model response");
  }

  let cleaned = text.trim();

  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/i, "")
      .trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first >= 0 && last > first) {
      return JSON.parse(cleaned.slice(first, last + 1));
    }
    throw new Error("Model did not return valid JSON");
  }
}

export function ensureObject(value, requiredKeys = []) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Expected JSON object");
  }

  for (const key of requiredKeys) {
    if (!(key in value)) throw new Error(`Missing JSON key: ${key}`);
  }

  return value;
}
