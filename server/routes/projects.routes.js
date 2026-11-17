import { Router } from "express";
import { projectPrompt } from "../lib/prompts.js";
import { suggestProjects } from "../services/ai.service.js";

export const projectsRouter = Router();

projectsRouter.post("/suggest", async (req, res) => {
  const input = {
    role: req.body.role || "Software Engineer",
    experience: req.body.experience || "Fresher",
    focus: Array.isArray(req.body.focus) && req.body.focus.length ? req.body.focus : ["AI"]
  };

  const result = await suggestProjects(input, projectPrompt(input));
  res.json(result);
});
