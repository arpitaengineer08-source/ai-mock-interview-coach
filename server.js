import "dotenv/config";
import express from "express";
import cors from "cors";
import { interviewRouter } from "./server/routes/interview.routes.js";
import { projectsRouter } from "./server/routes/projects.routes.js";
import { mentorRouter } from "./server/routes/mentor.routes.js";
import { ollamaRouter } from "./server/routes/ollama.routes.js";

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
}));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", async (_req, res) => {
  res.json({
    ok: true,
    service: "ai-mock-interview-coach-api",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/interview", interviewRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/mentor", mentorRouter);
app.use("/api/ollama", ollamaRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    ok: false,
    error: "Unexpected server error",
    mode: "fallback"
  });
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
