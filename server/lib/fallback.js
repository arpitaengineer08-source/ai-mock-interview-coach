// server/lib/fallback.js
// Deterministic rules engine used when Ollama is unavailable or returns invalid output.
// Exports are unchanged: fallbackQuestion, fallbackEvaluation, fallbackProjects, fallbackMentor.

import { QUESTIONS } from "./questions.js";

function clamp(value) {
  return Math.max(0, Math.min(10, Math.round(value)));
}

/* ------------------------------------------------------------------ */
/* Question selection: matches role / focus / difficulty and rotates   */
/* ------------------------------------------------------------------ */

const recentlyServed = []; // remembers what was served so questions do not repeat
const MEMORY = 12;

function wantedTags(input) {
  const tags = new Set();
  const add = (...t) => t.forEach((x) => tags.add(x));
  const focus = Array.isArray(input.focus) ? input.focus : input.focus ? [input.focus] : [];
  for (const raw of focus) {
    const f = String(raw).toLowerCase();
    if (/dsa|algorithm|data structure|coding|leetcode/.test(f)) add("dsa");
    if (/backend|api|database|dbms|sql|server/.test(f)) add("backend");
    if (/frontend|front-end|react|ui|web/.test(f)) add("frontend");
    if (/full[- ]?stack/.test(f)) add("fullstack", "frontend", "backend");
    if (/\bai\b|ml|machine learning|llm|genai|rag|agent|nlp|data science/.test(f)) add("ai");
    if (/system|architecture|design|scal/.test(f)) add("system-design");
    if (/\bcs\b|os|operating|network|fundamental|core/.test(f)) add("cs");
    if (/behaviou?r|hr|soft|communication|leadership/.test(f)) add("behavioural");
  }
  const role = String(input.role || "").toLowerCase();
  if (/front/.test(role)) add("frontend");
  if (/back/.test(role)) add("backend");
  if (/full[- ]?stack/.test(role)) add("fullstack", "frontend", "backend");
  if (/\bai\b|ml|machine|data|llm/.test(role)) add("ai");
  return tags;
}

const LEVELS = ["Easy", "Medium", "Hard"];

function wantedDifficulty(input) {
  const d = String(input.difficulty || "").toLowerCase();
  if (d.startsWith("e")) return "Easy";
  if (d.startsWith("h")) return "Hard";
  if (d.startsWith("m")) return "Medium";
  const exp = String(input.experience || "").toLowerCase();
  if (/fresher|intern|entry|0/.test(exp)) return "Easy";
  if (/senior|lead|staff|principal/.test(exp)) return "Hard";
  return "Medium";
}

function scoreQuestion(q, tags, difficulty) {
  let score = 0;
  for (const t of q.tags) if (tags.has(t)) score += 2;
  const gap = Math.abs(LEVELS.indexOf(q.difficulty) - LEVELS.indexOf(difficulty));
  score += gap === 0 ? 4 : gap === 1 ? 2 : 0;
  return score;
}

export function fallbackQuestion(input = {}) {
  const previous = new Set(input.previousQuestions || []);
  const tags = wantedTags(input);
  const difficulty = wantedDifficulty(input);

  const ranked = QUESTIONS.map((q, index) => ({ q, index, score: scoreQuestion(q, tags, difficulty) }))
    .sort((a, b) => b.score - a.score || a.index - b.index);

  let pool = ranked.filter((r) => !previous.has(r.q.question) && !recentlyServed.includes(r.q.question));
  if (!pool.length) {
    recentlyServed.length = 0; // everything has been served: start a new round
    pool = ranked.filter((r) => !previous.has(r.q.question));
  }
  if (!pool.length) pool = ranked;

  // Take the best-matching group and rotate through it by difficulty first.
  const best = pool[0].score;
  const top = pool.filter((r) => r.score >= best);
  const chosen = top[0].q;

  recentlyServed.push(chosen.question);
  if (recentlyServed.length > MEMORY) recentlyServed.shift();

  return {
    question: chosen.question,
    category: chosen.category,
    difficulty: chosen.difficulty,
    whyItMatters: chosen.whyItMatters,
    whatGoodLooksLike: chosen.whatGoodLooksLike,
    followUp: chosen.followUp,
    mode: "fallback",
    source: "rules-engine"
  };
}

/* ------------------------------------------------------------------ */
/* Evaluation                                                          */
/* ------------------------------------------------------------------ */

const k = (label, re, hint, w = 1) => ({ label, re, hint, w });

const BEHAVIOURAL = {
  items: [
    k("a clear situation", /when|during|while|at (my|the)|in (my|our) (project|team|internship|college|class)|once|last (year|semester)|project/i, "Set the scene briefly: where and when did this happen?"),
    k("your specific task or role", /my (role|task|responsibility|job)|i was (responsible|assigned|leading|in charge)|i (needed|had|was asked) to|goal was|my part/i, "Explain your own role and responsibility, not just the team's.", 1.5),
    k("concrete actions you took", /\bi (built|wrote|designed|implemented|decided|talked|discussed|organi[sz]ed|created|led|fixed|debugged|proposed|asked|set up|tested|planned|reviewed)/i, "Describe the specific actions you took, using 'I' rather than 'we'.", 2),
    k("a result or outcome", /result|outcome|as a (result|consequence)|reduced|improved|increased|saved|delivered|shipped|completed|%|percent|resolved|finished|worked out/i, "End with a measurable or clear result.", 2),
    k("reflection and learning", /learn(ed|t)|lesson|realis|realiz|next time|would (do|change)|differently|improv(ed|e) my|since then|now i/i, "Close with what you learned and what you would do differently.", 1.5),
    k("challenge or conflict", /challenge|problem|issue|disagree|conflict|mistake|deadline|failed|difficult|obstacle|bug|delay|pressure/i, "Make the difficulty explicit: what exactly went wrong or was hard?"),
    k("communication and teamwork", /team|communicat|discuss|feedback|stakeholder|mentor|supervisor|colleague|friend|asked for help|listen/i, "Show how you communicated with others.")
  ],
  outline: [
    "Situation: one or two sentences of context.",
    "Task: your specific responsibility or goal.",
    "Action: the concrete steps you personally took, and why.",
    "Result: what changed, ideally with a number.",
    "Reflection: what you learned and what you would do differently."
  ],
  followUp: "What would you do differently if you faced the same situation again?"
};

// Each rubric item: label (shown to user), re (what to look for), w (weight), hint (shown when missed)
const RUBRICS = {
  rag: {
    name: "RAG system design",
    items: [
      { label: "document ingestion", w: 1, re: /ingest|upload|extract(ion)?\b|pars(e|ing)|\bpdf\b|docx|metadata|etl|loader/i, hint: "Describe how documents are ingested, parsed and tagged with metadata (tenant ID, document ID)." },
      { label: "chunking", w: 1, re: /chunk|split(ting)? (the )?(document|text)|overlap|sliding window|segment/i, hint: "Explain the chunking strategy (size, overlap) and why it preserves context." },
      { label: "embeddings", w: 1, re: /embedding|\bembed\b|vectori[sz]|encoder/i, hint: "Mention how chunks and queries are converted to embeddings." },
      { label: "vector storage", w: 1, re: /vector (db|database|store|index|search)|pgvector|pinecone|faiss|weaviate|qdrant|milvus|chroma|elasticsearch|opensearch/i, hint: "Name where vectors are stored and how they are indexed." },
      { label: "retrieval", w: 1, re: /retriev|semantic search|similarity|top[- ]?k|hybrid|re-?rank|bm25|nearest neighbo/i, hint: "Explain retrieval: similarity search, top-k, hybrid search or re-ranking." },
      { label: "tenant isolation", w: 1.5, re: /tenant|namespace|isolat|multi-?tenan/i, hint: "Explain how tenants are isolated (tenant ID on every chunk, per-tenant index or namespace)." },
      { label: "access control", w: 1, re: /rbac|role[- ]based|access control|permission|\bacl\b|authori[sz]|row[- ]level/i, hint: "Describe access control (RBAC, permission filters applied before retrieval)." },
      { label: "answer generation", w: 1, re: /\bllm\b|generat|prompt|grounded|citation|cite|source/i, hint: "Explain how retrieved chunks are passed to the LLM and how sources are cited." },
      { label: "evaluation metrics", w: 1.5, re: /precision|recall|faithful|relevan|groundedness|\bmrr\b|ndcg|golden (set|dataset)|benchmark|hallucinat|correctness/i, hint: "Define evaluation: retrieval metrics (Precision@K, Recall@K) and answer metrics (faithfulness, relevance)." },
      { label: "operations (latency, caching, monitoring)", w: 1, re: /latency|cach(e|ing)|monitor|observab|scal(e|ing|able)|queue|async|rate limit|logging|metrics dashboard/i, hint: "Add operational concerns: latency, caching, scaling and monitoring." }
    ],
    outline: [
      "State assumptions: tenants, document types, scale and latency target.",
      "Ingestion pipeline: upload, text extraction, metadata (tenant ID, document ID), chunking and embeddings.",
      "Query path: embed the query, apply tenant and permission filters, retrieve top-k, optionally re-rank.",
      "Generation: pass the retrieved chunks to the LLM with citations and a refusal path when context is missing.",
      "Security and isolation: tenant-scoped indexes or filters, RBAC, audit logs.",
      "Evaluation and operations: Precision@K / Recall@K, faithfulness, monitoring, caching and failure handling."
    ],
    followUp: "How would you detect when retrieval returned irrelevant chunks?"
  },
  agent: {
    name: "AI agent design",
    items: [
      { label: "explicit tools", w: 1.5, re: /tool[- ]?(call|use|registry|schema)|function[- ]call|\btools?\b|api (wrapper|call)|mcp/i, hint: "Define the explicit tools the agent may call and their typed inputs." },
      { label: "input constraints", w: 1, re: /constrain|allow-?list|whitelist|validat|schema|sandbox|least privilege|read[- ]only|restrict/i, hint: "Constrain tool inputs with schemas, allowlists and a sandbox." },
      { label: "permission boundaries", w: 1.5, re: /permission|scope|boundar|token|protected branch|least privilege|access/i, hint: "Describe permission boundaries (scoped tokens, protected branches, read-only by default)." },
      { label: "human approval", w: 1.5, re: /human|approv|review|confirm|sign[- ]off|manual/i, hint: "Require human approval for risky or wide-reaching actions." },
      { label: "tracking and auditing", w: 1, re: /\blog|audit|trace|track|observab|telemetry|history/i, hint: "Track tool calls and outcomes with logs and audit trails." },
      { label: "limits and rollback", w: 1, re: /rollback|revert|dry[- ]run|diff|size limit|rate limit|budget|max (steps|iterations)|timeout|kill switch/i, hint: "Add limits (max steps, diff size, budget) and a rollback or dry-run path." },
      { label: "testing and CI", w: 1, re: /\btest|\bci\b|lint|build check|pipeline/i, hint: "Run tests and CI before proposing the pull request." },
      { label: "repository understanding", w: 1, re: /index|\bast\b|embedding|repository (graph|map)|codebase|context window|retriev/i, hint: "Explain how the agent understands the repository (index, search, retrieval)." },
      { label: "pull request flow", w: 1, re: /pull request|\bpr\b|branch|commit|patch/i, hint: "Describe the branch, commit and pull-request workflow." }
    ],
    outline: [
      "State assumptions: repository size, allowed actions and trust level.",
      "Architecture: planner, repository index, tool registry and executor.",
      "Tools: typed inputs, allowlists, sandboxed execution, read-only by default.",
      "Safety: scoped permissions, protected branches, human approval for risky changes, limits on diff size and steps.",
      "Verification: run tests and linters, dry-run, review diff before opening the PR.",
      "Observability: log every tool call and outcome, support rollback."
    ],
    followUp: "How would you prevent the agent from making an unsafe repository-wide change?"
  },
  automation: {
    name: "Workflow automation design",
    items: [
      { label: "natural-language planning", w: 1, re: /planner|plan(ning)?\b|intent|natural[- ]language|\bllm\b|parse (the )?request/i, hint: "Explain how the request is converted into a structured plan." },
      { label: "schema validation", w: 1.5, re: /schema|validat|zod|json schema|typed|allow-?list|action registry/i, hint: "Validate every planned step against a typed action registry before running it." },
      { label: "orchestration", w: 1, re: /orchestrat|workflow engine|executor|\bdag\b|worker|job queue|state machine|step runner/i, hint: "Describe the orchestrator or workflow engine that executes steps in order." },
      { label: "idempotency", w: 1.5, re: /idempot|dedup|exactly[- ]once|at[- ]least[- ]once/i, hint: "Use idempotency keys so retries do not repeat side effects." },
      { label: "retries and failure handling", w: 1.5, re: /retry|retries|backoff|dead[- ]letter|timeout|circuit breaker|failure|failed/i, hint: "Handle failures with retries, backoff, timeouts and a dead-letter queue." },
      { label: "compensation / rollback", w: 1, re: /compensat|saga|roll ?back|undo|revert/i, hint: "Explain what happens when step 4 of 6 fails (compensating actions or rollback)." },
      { label: "observability", w: 1, re: /\blog|trace|metric|audit|monitor|observab/i, hint: "Add logs, traces and metrics for every workflow run." },
      { label: "security and permissions", w: 1, re: /permission|auth|oauth|secret|rate limit|least privilege|access control/i, hint: "Cover permissions, secrets and rate limits for connected APIs." },
      { label: "user confirmation / dry run", w: 0.5, re: /dry[- ]run|preview|confirm|approval|human[- ]in/i, hint: "Let the user preview or confirm the plan before side effects occur." },
      { label: "testing", w: 0.5, re: /\btest|mock|simulat|sandbox/i, hint: "Mention how plans and executors are tested." }
    ],
    outline: [
      "State assumptions: supported APIs, users and failure expectations.",
      "Planning: the LLM turns the request into a structured plan of typed actions.",
      "Validation: check every action and parameter against a registry and permissions before any side effect.",
      "Execution: orchestrator with a job queue, idempotency keys, retries with backoff and timeouts.",
      "Failure handling: dead-letter queue, compensating actions or rollback for partial failures.",
      "Observability and testing: logs, traces, metrics, dry-run mode and tests with mocked APIs."
    ],
    followUp: "What happens when step 4 of a 6-step workflow fails?"
  },
  generic: {
    name: "System design / technical answer",
    items: [
      { label: "concrete components", w: 1.5, re: /api|database|\bdb\b|cache|queue|service|server|client|index|load balancer|storage|endpoint|algorithm|data structure|\bhash|\btree|graph|array|sql|redis|postgres|http/i, hint: "Name concrete components, APIs, data structures or algorithms." },
      { label: "data model / storage", w: 1, re: /schema|table|model|storage|persist|database|\bdb\b|index|key[- ]value|collection/i, hint: "Explain the data model and where data is stored." },
      { label: "scalability / performance", w: 1, re: /scal(e|ing|able)|latency|throughput|performance|shard|partition|replica|cache|complexity|big[- ]?o|o\(/i, hint: "Discuss scalability, performance or complexity." },
      { label: "failure and edge cases", w: 1.5, re: /failure|fail|error|timeout|retry|edge case|race condition|fallback|conflict|corner case|partial|exception|invalid/i, hint: "Discuss at least one failure or edge-case scenario and its mitigation." },
      { label: "security / access", w: 1, re: /security|auth|permission|encrypt|validat|sanitiz|access control|\brbac\b|rate limit/i, hint: "Cover security: authentication, authorization and input validation." },
      { label: "trade-offs", w: 1.5, re: /trade[- ]?off|versus|\bvs\.?\b|alternative|however|downside|pros and cons|instead of|depends on|at the cost of/i, hint: "State trade-offs and why you chose one option over another." },
      { label: "testing and monitoring", w: 1, re: /\btest|monitor|observab|\blog|metric|alert|evaluat|measure/i, hint: "Close with testing, monitoring and how you would measure success." }
    ],
    outline: [
      "State assumptions and the user/problem constraints.",
      "Explain the main architecture or algorithm in execution order.",
      "Discuss trade-offs, failure modes and security.",
      "Close with testing and observability."
    ],
    followUp: "What would you change if the system had 100x more traffic?"
  }
};

function detectTopic(question = "", answer = "") {
  const q = String(question);
  if (/\brag\b|retrieval|document q&a|embedding|vector/i.test(q)) return "rag";
  if (/agent|tool-calling|pull request|autonomous/i.test(q)) return "agent";
  if (/automation|workflow|natural-language request/i.test(q)) return "automation";
  if (q.trim()) return "generic";
  if (/\brag\b|chunk|embedding|vector/i.test(answer)) return "rag";
  if (/agent|tool call|pull request/i.test(answer)) return "agent";
  if (/workflow|idempot|saga|orchestrat/i.test(answer)) return "automation";
  return "generic";
}

const NON_ANSWER = /^(i\s*(do\s*not|don'?t|dont|cant|can'?t|cannot)\s*(really\s*)?(know|remember|answer|say|understand)|idk|no\s*idea|not\s*sure|dunno|skip|pass|n\/?a|none|nothing|no\s*answer|\?+|\.+)\b/i;

function analyse(answer) {
  const text = answer.trim();
  const words = text ? text.split(/\s+/).filter(Boolean) : [];
  const lower = words.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, "")).filter(Boolean);
  const unique = new Set(lower);
  const sentences = text.split(/[.!?\n]+/).filter((s) => s.trim().split(/\s+/).length >= 3).length;
  const listLines = (text.match(/^\s*(\d+[.)]|[-*\u2022]|#{1,4}\s|[A-Z][A-Za-z &\/-]{2,30}:)/gm) || []).length;
  return {
    text,
    wordCount: words.length,
    uniqueRatio: lower.length ? unique.size / lower.length : 0,
    sentences,
    listLines,
    hasPipeline: /\u2192|->|=>/.test(text),
    hasAssumptions: /assum|constraint|requirement|expected load|\busers?\b|scale of|clarif/i.test(text),
    hasTradeoffs: /trade[- ]?off|versus|\bvs\.?\b|alternative|however|downside|pros and cons|instead of|depends on|at the cost of/i.test(text),
    hasEdge: /failure|fail|error|timeout|retry|edge case|race|fallback|leak|conflict|partial|isolation|prevent/i.test(text),
    hasReasoning: /because|so that|in order to|to (prevent|avoid|preserve|ensure|reduce|improve|support)|which (allows|ensures|prevents)|since /i.test(text),
    hasSequence: /first|then|next|finally|after that|step \d|\b1[.)]/i.test(text),
    hasComplexity: /O\(|complexity|linear time|constant (time|space)|logarithmic/i.test(text),
    hasDsaEdge: /empty|null|single|one element|duplicate|negative|no solution|not found|out of bounds|overflow|zero/i.test(text),
    hasExample: /for example|for instance|e\.g\.|example:|input|consider (the )?(array|list|string|case)|\[\s*\d/i.test(text),
    hasAlternative: /brute|naive|alternative|another (way|approach)|instead|better than|improve|optimi[sz]e|compared (to|with)/i.test(text),
    star: {
      situation: /when|during|while|at (my|the)|in (my|our)|once|last (year|semester)|project|internship|college/i.test(text),
      task: /my (role|task|responsibility|job)|i was (responsible|assigned|leading|in charge)|i (needed|had|was asked) to|goal was|my part/i.test(text),
      action: /\bi (built|wrote|designed|implemented|decided|talked|discussed|organi[sz]ed|created|led|fixed|debugged|proposed|asked|set up|tested|planned|reviewed)/i.test(text),
      result: /result|outcome|as a (result|consequence)|reduced|improved|increased|saved|delivered|shipped|completed|%|percent|resolved|finished/i.test(text),
      reflection: /learn(ed|t)|lesson|realis|realiz|next time|would (do|change)|differently|since then|now i/i.test(text)
    }
  };
}

function isNonAnswer(a) {
  if (!a.wordCount) return true;
  if (a.wordCount <= 12 && NON_ANSWER.test(a.text)) return true;
  if (a.wordCount <= 3 && !/[a-z]{4,}/i.test(a.text.replace(/\b(test|asdf|okay|hello|hi|yes|no)\b/gi, ""))) return true;
  if (a.wordCount >= 5 && a.uniqueRatio < 0.25) return true;
  return false;
}

function findBankQuestion(question) {
  return QUESTIONS.find((q) => q.question === question);
}

function questionKind(q) {
  if (!q) return "design";
  if (q.tags.includes("behavioural")) return "behavioural";
  if (q.tags.includes("dsa")) return "dsa";
  return "design";
}

function rubricFor(bankQ, input, answerText) {
  if (bankQ?.concepts) return { items: bankQ.concepts, outline: bankQ.outline, followUp: bankQ.followUp, kind: questionKind(bankQ) };
  if (bankQ && bankQ.tags.includes("behavioural")) return { ...BEHAVIOURAL, followUp: bankQ.followUp, kind: "behavioural" };
  const key = bankQ?.topic || detectTopic(input.question, answerText);
  const base = RUBRICS[key];
  return { items: base.items, outline: base.outline, followUp: bankQ?.followUp || base.followUp, kind: "design" };
}

export function fallbackEvaluation(input) {
  const a = analyse(input.answer || "");
  const bankQ = findBankQuestion(input.question);
  const rubric = rubricFor(bankQ, input, a.text);
  const kind = rubric.kind;

  // ---- Empty or "I don't know" answers: score 0 or 1 ----
  if (isNonAnswer(a)) {
    const empty = a.wordCount === 0;
    const score = empty ? 0 : 1;
    return {
      overallScore: score,
      communicationScore: score,
      technicalScore: 0,
      problemSolvingScore: 0,
      strengths: [empty ? "No answer was provided yet." : "You were honest about not knowing, which is better than guessing."],
      improvements: [
        "Write at least a few sentences, even a partial attempt is better than none.",
        kind === "behavioural" ? "Think of one real example and describe it with Situation, Task, Action, Result." : "Start with what you do know, state assumptions, then reason step by step.",
        kind === "dsa" ? "Begin with a brute-force idea, then improve it and state the complexity." : "Use a simple structure: assumptions \u2192 design \u2192 trade-offs \u2192 failure modes."
      ],
      missedPoints: rubric.items.slice(0, 3).map((i) => i.hint),
      betterAnswerOutline: rubric.outline,
      followUpQuestion: "Which part of this question feels most unfamiliar, and what would you look up first?",
      mentorNote: "Not knowing is fine in practice. In a real interview, think aloud: break the problem down, say what you do know and ask clarifying questions.",
      mode: "fallback",
      source: "rules-engine"
    };
  }

  // ---- Coverage of the question's concepts ----
  let total = 0;
  let got = 0;
  const covered = [];
  const missed = [];
  for (const item of rubric.items) {
    total += item.w;
    if (item.re.test(a.text)) { got += item.w; covered.push(item); } else { missed.push(item); }
  }
  const coverage = total ? got / total : 0;

  // ---- Structure score (0-10), depends on the kind of question ----
  let structure = 0;
  if (kind === "behavioural") {
    structure += a.star.situation ? 2 : 0;
    structure += a.star.task ? 2 : 0;
    structure += a.star.action ? 2 : 0;
    structure += a.star.result ? 2 : 0;
    structure += a.star.reflection ? 2 : 0;
  } else if (kind === "dsa") {
    structure += a.listLines >= 3 ? 2 : a.hasSequence ? 1.5 : 0;
    structure += a.hasComplexity ? 2.5 : 0;
    structure += a.hasDsaEdge ? 2 : 0;
    structure += a.hasExample ? 1 : 0;
    structure += a.hasAlternative ? 1.5 : 0;
    structure += a.hasReasoning ? 1 : 0;
  } else {
    structure += a.listLines >= 4 ? 3 : a.listLines >= 2 ? 2 : a.hasSequence ? 1 : 0;
    structure += a.hasPipeline ? 1.5 : 0;
    structure += a.hasAssumptions ? 0.5 : 0;
    structure += a.hasTradeoffs ? 1.5 : 0;
    structure += a.hasEdge ? 1.5 : 0;
    structure += a.hasReasoning ? 1 : 0;
    structure += a.sentences >= 4 ? 1 : 0;
  }

  // ---- Dimension scores ----
  let technical = 10 * coverage;
  let problemSolving = 0.4 * structure + 0.6 * (10 * coverage);

  const wc = a.wordCount;
  const scale = kind === "dsa" ? 0.6 : 1; // good DSA answers are shorter than design answers
  let communication = wc >= 150 * scale ? 8 : wc >= 90 * scale ? 7 : wc >= 50 * scale ? 6 : wc >= 25 * scale ? 4 : wc >= 10 ? 3 : 2;
  if (a.listLines >= 3 || a.hasSequence) communication += 1;
  if (a.hasReasoning) communication += 0.5;
  if (wc > 30 && a.uniqueRatio < 0.4) communication -= 2; // repetitive / keyword stuffing

  // Short answers cannot score high, however many keywords they contain.
  const cap = wc < 15 * scale ? 3 : wc < 30 * scale ? 5 : wc < 50 * scale ? 6 : wc < 80 * scale ? 8 : 10;
  technical = Math.min(technical, cap);
  problemSolving = Math.min(problemSolving, cap);

  // A complete, well-structured answer should land at 9-10.
  const completeEnough = kind === "design" ? a.listLines >= 4 : structure >= 6;
  if (coverage >= 0.85 && completeEnough && wc >= 80 * scale) {
    technical = Math.max(technical, 9);
    problemSolving = Math.max(problemSolving, (a.hasTradeoffs && a.hasAssumptions) || kind !== "design" ? 10 : 9);
    communication = Math.max(communication, 9);
  } else if (coverage >= 0.7 && wc >= 60 * scale) {
    technical = Math.max(technical, 7);
  }

  const technicalScore = clamp(technical);
  const problemSolvingScore = clamp(problemSolving);
  const communicationScore = clamp(communication);
  const overallScore = clamp(0.45 * technicalScore + 0.35 * problemSolvingScore + 0.2 * communicationScore);

  // ---- Feedback text ----
  const strengths = [];
  if (covered.length) {
    const names = covered.slice(0, 5).map((i) => i.label).join(", ");
    strengths.push(`You covered key areas: ${names}${covered.length > 5 ? " and more" : ""}.`);
  }
  if (kind !== "behavioural" && (a.listLines >= 3 || a.hasSequence)) strengths.push("Your answer follows a clear step-by-step structure.");
  if (kind === "behavioural" && structure >= 8) strengths.push("Your story has a clear Situation, Task, Action and Result.");
  if (kind === "dsa" && a.hasComplexity) strengths.push("You stated the time and space complexity.");
  if (kind === "design" && a.hasPipeline) strengths.push("You summarised the flow end to end, which makes the design easy to follow.");
  if (kind === "design" && a.hasEdge && covered.length) strengths.push("You addressed risks such as isolation, failures or leakage.");
  if (!strengths.length) strengths.push("You attempted a direct answer.");

  const improvements = [];
  if (kind === "behavioural") {
    if (!a.star.situation) improvements.push("Set the scene: where and when did this happen?");
    if (!a.star.task) improvements.push("State your own role and responsibility clearly.");
    if (!a.star.action) improvements.push("Describe the concrete actions you took, using 'I' rather than 'we'.");
    if (!a.star.result) improvements.push("Finish with a measurable result or clear outcome.");
    if (!a.star.reflection) improvements.push("Close with what you learned and what you would do differently.");
  } else if (kind === "dsa") {
    if (!a.hasAlternative) improvements.push("Start with the brute-force idea, then explain why your approach is better.");
    if (!a.hasComplexity) improvements.push("State the time and space complexity of your solution.");
    if (!a.hasDsaEdge) improvements.push("Discuss edge cases: empty input, single element, duplicates, no solution.");
    if (!a.hasExample) improvements.push("Walk through a small example to prove the idea works.");
  } else {
    if (!a.hasTradeoffs) improvements.push("Make trade-offs explicit (for example speed vs. accuracy, cost vs. complexity).");
    if (!a.hasAssumptions) improvements.push("Start by stating assumptions: scale, users, latency and data types.");
    if (!a.hasEdge) improvements.push("Discuss at least one failure, security, scaling or edge-case scenario.");
    if (a.listLines < 3 && !a.hasSequence) improvements.push("Use a simple structure: assumptions \u2192 design \u2192 trade-offs \u2192 failure modes.");
  }
  if (!a.hasReasoning) improvements.push("Explain why you chose each step or component, not only what it is.");
  if (wc < 60 * scale) improvements.push("Add more detail: a short answer rarely shows enough reasoning.");
  if (!improvements.length) improvements.push("Add measurable targets or concrete numbers to make the answer even stronger.");

  const missedPoints = missed.slice(0, 4).map((i) => i.hint);
  if (!missedPoints.length) missedPoints.push("No major concept was missed. Consider adding measurable targets or deeper trade-offs.");

  let mentorNote;
  if (overallScore >= 9) mentorNote = "Excellent coverage. To stand out further, quantify your decisions and be ready for deep follow-up questions.";
  else if (overallScore >= 7) mentorNote = "Solid answer. Add the missing points and concrete numbers to move from good to excellent.";
  else if (overallScore >= 4) mentorNote = "You have the right ideas, but the answer needs more depth. Work through each missed point and practise explaining it aloud.";
  else mentorNote = "Build the answer step by step. Use the better-answer outline and try the question again.";

  return {
    overallScore,
    communicationScore,
    technicalScore,
    problemSolvingScore,
    strengths: strengths.slice(0, 4),
    improvements: improvements.slice(0, 4),
    missedPoints,
    betterAnswerOutline: rubric.outline,
    followUpQuestion: rubric.followUp,
    mentorNote,
    mode: "fallback",
    source: "rules-engine"
  };
}

/* ------------------------------------------------------------------ */
/* Projects and mentor (unchanged)                                     */
/* ------------------------------------------------------------------ */

export function fallbackProjects(input) {
  return {
    projects: [
      {
        title: "RepoPilot — AI Engineering Agent",
        oneLiner: "A repository-aware agent that plans, tests and proposes safe code changes.",
        problem: "Developers lose time understanding unfamiliar codebases and repetitive maintenance tasks.",
        coreFeatures: ["Repository graph", "Tool-calling agent", "Test-aware change proposals", "Human approval gates"],
        architecture: ["React dashboard", "Node API", "Worker queue", "Repository index", "LLM/Ollama adapter"],
        techStack: ["TypeScript", "Node.js", "PostgreSQL", "Redis", "Ollama"],
        resumeImpact: "Demonstrates agent orchestration, developer tooling, async jobs and safety boundaries."
      },
      {
        title: "RecallRAG — Private Knowledge Copilot",
        oneLiner: "A permission-aware RAG workspace for searching a user's technical documents.",
        problem: "Important engineering knowledge is spread across PDFs, docs and project notes.",
        coreFeatures: ["Document ingestion", "Hybrid retrieval", "Citation-aware answers", "Permission filters"],
        architecture: ["Ingestion worker", "Chunk/index pipeline", "Vector search", "Evaluation service", "Chat API"],
        techStack: ["React", "Express", "PostgreSQL/pgvector", "Ollama", "Docker"],
        resumeImpact: "Shows practical RAG architecture, evaluation and data isolation."
      },
      {
        title: "FlowForge — Natural Language Automation",
        oneLiner: "A SaaS workflow builder that converts plain-language tasks into validated API workflows.",
        problem: "Small teams spend time manually coordinating repetitive multi-step operations.",
        coreFeatures: ["Natural-language planner", "Typed action registry", "Retries", "Idempotency keys", "Execution logs"],
        architecture: ["Web app", "Planner service", "Workflow engine", "Job queue", "Connector layer"],
        techStack: ["React", "TypeScript", "Node.js", "Redis", "PostgreSQL"],
        resumeImpact: "Demonstrates workflow orchestration, API design and production reliability."
      }
    ],
    mode: "fallback",
    source: "rules-engine"
  };
}

export function fallbackMentor(input) {
  return {
    priority: "Improve depth and explain engineering trade-offs clearly.",
    nextActions: [
      "Practice one system-design question and narrate assumptions before architecture.",
      "For every answer, name one failure mode and one measurable metric.",
      "Build one small AI/developer-tool feature end-to-end and document the architecture."
    ],
    practicePlan: [
      "20 minutes: solve a backend/system-design question.",
      "15 minutes: review one trade-off and failure mode.",
      "15 minutes: explain your answer aloud without reading notes."
    ],
    mentorMessage: "For off-campus interviews, aim to make your reasoning easy to follow and backed by concrete engineering decisions.",
    mode: "fallback",
    source: "rules-engine"
  };
}
