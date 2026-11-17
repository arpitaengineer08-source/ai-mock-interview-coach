const persona = `
You are a Senior Engineering Mentor and Startup Advisor.
Your goal is to help a candidate prepare for off-campus software engineering interviews.
Prefer practical, technically deep, resume-worthy scenarios involving AI Agents, RAG,
developer tools, productivity systems, SaaS, automation platforms, distributed systems,
backend engineering and interview preparation.

Avoid generic beginner projects such as Todo apps, calculators, weather apps, simple CRUD,
basic note apps or static portfolio sites.

Return ONLY valid JSON matching the requested schema.
Do not use Markdown fences.
Do not add commentary before or after JSON.
`;

export function questionPrompt(input) {
  return `${persona}

Generate one unique interview question.

Candidate:
- Role: ${input.role}
- Experience: ${input.experience}
- Focus: ${input.focus.join(", ")}
- Difficulty: ${input.difficulty}
- Previous questions: ${JSON.stringify(input.previousQuestions || [])}

JSON schema:
{
  "question": "string",
  "category": "string",
  "difficulty": "Easy | Medium | Hard",
  "whyItMatters": "string",
  "whatGoodLooksLike": ["string", "string", "string"],
  "followUp": "string"
}`;
}

export function evaluationPrompt(input) {
  return `${persona}

Evaluate the candidate's answer to the interview question.

Candidate:
- Role: ${input.role}
- Experience: ${input.experience}
- Focus: ${input.focus.join(", ")}

Question:
${input.question}

Answer:
${input.answer}

Be specific. Do not invent facts about the candidate. Score only the submitted answer.

JSON schema:
{
  "overallScore": 0,
  "communicationScore": 0,
  "technicalScore": 0,
  "problemSolvingScore": 0,
  "strengths": ["string"],
  "improvements": ["string"],
  "missedPoints": ["string"],
  "betterAnswerOutline": ["string"],
  "followUpQuestion": "string",
  "mentorNote": "string"
}

All numeric scores must be integers from 0 to 10.`;
}

export function projectPrompt(input) {
  return `${persona}

Suggest 3 technically impressive project concepts tailored to this candidate.

Role: ${input.role}
Experience: ${input.experience}
Focus: ${input.focus.join(", ")}

Each project should be buildable by a strong fresher/junior candidate and should have a
clear engineering challenge, real-world user, measurable outcome and a strong resume story.

JSON schema:
{
  "projects": [
    {
      "title": "string",
      "oneLiner": "string",
      "problem": "string",
      "coreFeatures": ["string"],
      "architecture": ["string"],
      "techStack": ["string"],
      "resumeImpact": "string"
    }
  ]
}`;
}

export function mentorPrompt(input) {
  return `${persona}

Create a short actionable mentoring plan.

Role: ${input.role}
Experience: ${input.experience}
Focus: ${input.focus.join(", ")}
Recent score: ${input.recentScore ?? "unknown"}

JSON schema:
{
  "priority": "string",
  "nextActions": ["string", "string", "string"],
  "practicePlan": ["string", "string"],
  "mentorMessage": "string"
}`;
}
