export type Setup = {
  role: string;
  experience: string;
  focus: string[];
  difficulty: string;
};

export type Question = {
  question: string;
  category: string;
  difficulty: string;
  whyItMatters: string;
  whatGoodLooksLike: string[];
  followUp: string;
  mode?: "ollama" | "fallback";
  model?: string;
};

export type Evaluation = {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  problemSolvingScore: number;
  strengths: string[];
  improvements: string[];
  missedPoints: string[];
  betterAnswerOutline: string[];
  followUpQuestion: string;
  mentorNote: string;
  mode?: "ollama" | "fallback";
  model?: string;
};

export type Project = {
  title: string;
  oneLiner: string;
  problem: string;
  coreFeatures: string[];
  architecture: string[];
  techStack: string[];
  resumeImpact: string;
};
