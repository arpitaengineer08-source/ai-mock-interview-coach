import { Router } from "express";
import { getOllamaStatus } from "../lib/ollama.js";

export const ollamaRouter = Router();

ollamaRouter.get("/status", async (_req, res) => {
  res.json(await getOllamaStatus());
});
