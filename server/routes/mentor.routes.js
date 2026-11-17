import { Router } from "express";
import { mentorPrompt } from "../lib/prompts.js";
import { mentor } from "../services/ai.service.js";

export const mentorRouter = Router();

mentorRouter.post("/suggest", async (req, res) => {
  const input = {
    role: req.body.role || "Software Engineer",
    experience: req.body.experience || "Fresher",
    focus: Array.isArray(req.body.focus) && req.body.focus.length ? req.body.focus : ["Problem Solving"],
    recentScore: req.body.recentScore
  };

  const result = await mentor(input, mentorPrompt(input));
  res.json(result);
});
