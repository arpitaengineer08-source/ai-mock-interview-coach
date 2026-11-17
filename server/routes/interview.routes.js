import { Router } from "express";
import { evaluationPrompt, questionPrompt, mentorPrompt } from "../lib/prompts.js";
import { evaluateAnswer, generateQuestion, mentor } from "../services/ai.service.js";

export const interviewRouter = Router();

function normalizeInput(body) {
  return {
    role: body.role || "Software Engineer",
    experience: body.experience || "Fresher",
    focus: Array.isArray(body.focus) && body.focus.length ? body.focus : ["Problem Solving"],
    difficulty: body.difficulty || "Medium",
    previousQuestions: Array.isArray(body.previousQuestions) ? body.previousQuestions : []
  };
}

interviewRouter.post("/question", async (req, res) => {
  const input = normalizeInput(req.body);
  const result = await generateQuestion(input, questionPrompt(input));
  res.json(result);
});

interviewRouter.post("/evaluate", async (req, res) => {
  const input = {
    ...normalizeInput(req.body),
    question: req.body.question || "",
    answer: req.body.answer || ""
  };

  if (!input.question || !input.answer.trim()) {
    return res.status(400).json({ error: "question and answer are required" });
  }

  const result = await evaluateAnswer(input, evaluationPrompt(input));
  res.json(result);
});

interviewRouter.post("/mentor", async (req, res) => {
  const input = {
    ...normalizeInput(req.body),
    recentScore: req.body.recentScore
  };

  const result = await mentor(input, mentorPrompt(input));
  res.json(result);
});
