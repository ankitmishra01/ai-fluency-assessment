import type { Dimension, DimensionScore, Result } from "./types.ts";

export interface LearningPhase {
  weeks: string;
  title: string;
  focus: string;
  outcomes: string[];
  practice: string;
  evidence: string;
}

export interface LearningPlan {
  durationWeeks: number;
  priorities: DimensionScore[];
  rationale: string;
  phases: LearningPhase[];
  managerPrompts: string[];
}

type DimensionModule = Omit<LearningPhase, "weeks">;

const MODULES: Record<Dimension, DimensionModule> = {
  technical: {
    title: "Build a dependable mental model of AI",
    focus:
      "Understand how modern AI systems generate outputs, where their limits come from, and which controls matter in everyday work.",
    outcomes: [
      "Explain models, context, retrieval, temperature, and hallucination in plain language.",
      "Choose a suitable model and prompting approach for a defined task.",
      "Recognize when a technical limitation makes an AI workflow unsafe or inefficient.",
    ],
    practice:
      "Run one work task through two models and two prompt settings. Record where the outputs changed and explain why.",
    evidence:
      "A one-page comparison showing the task, settings, output differences, and the employee's recommendation.",
  },
  applied: {
    title: "Turn AI capability into useful work",
    focus:
      "Select AI opportunities that solve a real workflow problem and define success before implementation.",
    outcomes: [
      "Map an end-to-end workflow instead of automating a single drafting step.",
      "Separate a useful use case from a technology demonstration.",
      "Define a baseline, success metric, owner, and stop condition for an AI initiative.",
    ],
    practice:
      "Redesign one recurring task from the employee's role and test the new workflow on a small, reversible pilot.",
    evidence:
      "A workflow map and pilot brief with baseline effort, target outcome, risks, and a clear scale-or-stop decision.",
  },
  risk: {
    title: "Make proportionate risk decisions",
    focus:
      "Identify likely failure modes, match safeguards to consequence, and keep accountability with the human decision-maker.",
    outcomes: [
      "Distinguish hallucination, bias, privacy, security, and scope errors.",
      "Choose review and monitoring controls based on impact rather than fear.",
      "State what data may be used and where human sign-off is required.",
    ],
    practice:
      "Create a pre-mortem for one real AI use case, then test the proposed controls against three plausible failures.",
    evidence:
      "A risk-and-controls sheet naming the failure, consequence, prevention, detection, and accountable owner.",
  },
  case: {
    title: "Strengthen AI decision-making",
    focus:
      "Use evidence, trade-offs, and uncertainty to make defensible recommendations in realistic business scenarios.",
    outcomes: [
      "Separate what evidence proves from what it only suggests.",
      "Compare value, risk, cost, and reversibility before recommending a direction.",
      "Define what new evidence would change the decision.",
    ],
    practice:
      "Write a short decision memo for an AI initiative, then argue the strongest case against the recommendation.",
    evidence:
      "A decision memo with options, evidence, assumptions, trade-offs, recommendation, and reassessment trigger.",
  },
};

function rankedDimensions(dimensions: DimensionScore[]): DimensionScore[] {
  return dimensions
    .map((dimension, index) => ({ dimension, index }))
    .sort((a, b) => a.dimension.score - b.dimension.score || a.index - b.index)
    .map(({ dimension }) => dimension);
}

export function buildLearningPlan(result: Result): LearningPlan {
  const priorities = rankedDimensions(result.dimensions).slice(0, 2);
  const [first, second] = priorities;
  const firstModule = MODULES[first.key];
  const secondModule = MODULES[second.key];

  return {
    durationWeeks: 6,
    priorities,
    rationale: `${first.name} (${first.score} of 200) and ${second.name} (${second.score} of 200) are the two lowest-scoring dimensions in this assessment. The plan starts there because they offer the clearest development opportunity; it does not imply a performance deficiency.`,
    phases: [
      { ...firstModule, weeks: "Weeks 1–2" },
      { ...secondModule, weeks: "Weeks 3–4" },
      {
        weeks: "Weeks 5–6",
        title: "Apply both capabilities in real work",
        focus: `Combine ${first.name} and ${second.name} in a small, reversible workplace use case.`,
        outcomes: [
          "Apply both development priorities in one end-to-end decision.",
          "Ask for evidence-based feedback from a manager or peer.",
          "Document what improved, what remained uncertain, and what to try next.",
        ],
        practice:
          "Complete a role-relevant pilot with a clear goal, safeguards, review point, and written reflection.",
        evidence:
          "A short portfolio record containing the initial problem, approach, output, review feedback, and next decision.",
      },
    ],
    managerPrompts: [
      "Which low-risk work task would give this employee a fair chance to practise these capabilities?",
      "What access, examples, or coaching would remove avoidable barriers?",
      "What observable evidence would show greater independence after six weeks?",
    ],
  };
}
