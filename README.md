# AI Mock Interview Coach (InterviewOS)

An AI-powered mock interview coach that asks role-specific questions, evaluates your answers across multiple dimensions, and gives structured, actionable feedback. It runs locally, supports local LLMs through **Ollama**, and keeps working with a deterministic **fallback engine** when no model is available.

> Built as a B.Tech CSE Minor Project at SRM University, Delhi-NCR, Sonepat.

## Features

- **Practice question bank:** 28 questions across DSA, backend, system design, AI/LLM, frontend, CS fundamentals and behavioural topics, with easy, medium and hard levels.
- **No repeats:** questions rotate, and matching follows your role, focus areas and difficulty.
- **Structured evaluation:** overall, technical, problem-solving and communication scores (0-10), strengths, improvements, missed points, a better-answer outline, a mentor note and a follow-up question.
- **Question-aware scoring (fallback mode):** every question has its own concepts. DSA answers are checked for approach, complexity and edge cases, behavioural answers for STAR structure, design answers for architecture, trade-offs and failure handling. "I don't know" scores 0-1.
- **Local AI with Ollama:** automatic model selection `qwen3:8b` -> `llama3.1:8b` -> `mistral:7b`.
- **Always available:** rules/template fallback engine and a connection-status banner.
- **Project Lab and mentor guidance** for next steps.
- **Privacy-conscious:** answers stay on your machine, nothing is stored.

## Tech stack

React, TypeScript, Vite, Tailwind CSS, Node.js, Express 5, Ollama.

## Prerequisites

- Node.js 18+ and npm
- Optional: [Ollama](https://ollama.com) and a supported model (needs roughly 16 GB RAM for 7-8B models)

## Install and run

```bash
npm install
npm install --prefix client
npm run dev
```

Open http://localhost:5173.

The API listens on `PORT` (default `5000`). On macOS, port 5000 is used by AirPlay Receiver. If the app shows "Unexpected end of JSON input", create a `.env` file with `PORT=5001` and set the proxy target in `client/vite.config.ts` to `http://localhost:5001`.

## Ollama (optional)

```bash
ollama pull qwen3:8b        # or llama3.1:8b / mistral:7b
curl http://localhost:11434/api/tags
```

Without Ollama, the app uses the fallback engine and shows a banner.

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Backend health |
| GET | `/api/ollama/status` | Ollama and model availability |
| POST | `/api/interview/question` | Next question (`role`, `experience`, `focus`, `difficulty`, `previousQuestions`) |
| POST | `/api/interview/evaluate` | Evaluate an answer (`role`, `experience`, `focus`, `question`, `answer`) |
| POST | `/api/projects/suggest` | Project suggestions |
| POST | `/api/mentor/suggest` | Mentoring guidance |

## Project structure

```text
server.js                  Express entry point
server/routes/             interview, projects, mentor, ollama routers
server/services/           AI service (Ollama first, fallback second)
server/lib/fallback.js     Rules engine: question selection and scoring
server/lib/questions.js    Question bank with per-question scoring concepts
server/lib/ollama.js       Ollama adapter
client/                    React + TypeScript + Vite front end
```

## Roadmap

- In-browser video and speech practice signals (eye contact, pace, filler words) with no video upload
- Automated unit and API tests
- Support for smaller local models
- Progress dashboard across sessions

## Disclaimer

Scores are practice guidance, not a measure of employability. This is a coaching tool, not a hiring system.

## Team

Arpita Sharma, Aseel Ibrahim, Sariga Nair. Supervisor: Ms. Arul.

## License

MIT. See [LICENSE](LICENSE).
