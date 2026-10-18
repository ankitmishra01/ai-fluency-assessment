import { FORMS } from "./items.ts";
import type {
  AnswerMap,
  BandName,
  Dimension,
  DimensionScore,
  Form,
  FormId,
  Item,
  Result,
} from "./types.ts";

export const DIMENSION_MAX = 200;
export const TOTAL_MAX = 800;

export const DIMENSIONS: {
  key: Dimension;
  name: string;
  blurb: string;
  sectionLabel: string;
}[] = [
  {
    key: "technical",
    name: "Technical AI Depth",
    blurb:
      "How well someone operates AI tools, prompts, models, and controls.",
    sectionLabel: "Section 1",
  },
  {
    key: "applied",
    name: "Applied AI Fit",
    blurb:
      "How effectively AI improves real work within someone's function.",
    sectionLabel: "Section 2",
  },
  {
    key: "risk",
    name: "Risk-Reward Competency",
    blurb:
      "Judgment on hallucination, bias, privacy, and when not to trust AI.",
    sectionLabel: "Section 3",
  },
  {
    key: "case",
    name: "AI Mini-Case Analysis",
    blurb:
      "Decision quality in open-ended business scenarios, beyond multiple choice.",
    sectionLabel: "Section 4",
  },
];

export const BANDS: { name: BandName; min: number; max: number; note: string }[] =
  [
    {
      name: "Beginner",
      min: 0,
      max: 399,
      note: "Below half the available points. Core vocabulary and first-order judgment are not yet reliable.",
    },
    {
      name: "Novice",
      min: 400,
      max: 559,
      note: "Half to roughly two thirds. Can follow an AI conversation but is not yet a safe independent operator.",
    },
    {
      name: "Intermediate",
      min: 560,
      max: 679,
      note: "Roughly 70 to 84 percent. Works independently on most tasks; gaps still show under pressure or at the edges.",
    },
    {
      name: "Advanced",
      min: 680,
      max: 800,
      note: "85 percent and above. Can set direction for others and is a credible reviewer of someone else's AI work.",
    },
  ];

export function bandFor(total: number): BandName {
  for (const b of BANDS) {
    if (total >= b.min && total <= b.max) return b.name;
  }
  return "Advanced";
}

export function bandNote(name: BandName): string {
  return BANDS.find((b) => b.name === name)?.note ?? "";
}

export function getForm(form: FormId): Form {
  return FORMS[form];
}

export function isFormId(v: string | null | undefined): v is FormId {
  return v === "A" || v === "B";
}

export function itemsFor(form: FormId, dimension: Dimension): Item[] {
  return getForm(form).items.filter((i) => i.section === dimension);
}

export function dimensionCounts(form: FormId): Record<Dimension, number> {
  const out = { technical: 0, applied: 0, risk: 0, case: 0 };
  for (const i of getForm(form).items) {
    out[i.section as Dimension] += 1;
  }
  return out;
}

/**
 * Each dimension is worth 200 points regardless of how many items it holds:
 * (correct in section / items in section) * 200, rounded to the nearest point.
 * The four dimension scores sum to the 800-point total.
 */
export function score(form: FormId, answers: AnswerMap): Result {
  const f = getForm(form);
  const dimensions: DimensionScore[] = DIMENSIONS.map((d) => {
    const items = f.items.filter((i) => i.section === d.key);
    const correct = items.filter((i) => answers[i.id] === i.answer).length;
    const total = items.length;
    return {
      key: d.key,
      name: d.name,
      blurb: d.blurb,
      correct,
      total,
      score: total === 0 ? 0 : Math.round((correct / total) * DIMENSION_MAX),
    };
  });

  const total = dimensions.reduce((a, d) => a + d.score, 0);
  const ranked = [...dimensions].sort((a, b) => a.score - b.score);

  return {
    form,
    total,
    band: bandFor(total),
    correct: dimensions.reduce((a, d) => a + d.correct, 0),
    items: f.items.length,
    dimensions,
    weakest: ranked[0],
    strongest: ranked[ranked.length - 1],
  };
}

/** Plain-language guidance keyed to the lowest-scoring dimension. */
export const IMPROVEMENT: Record<Dimension, string[]> = {
  technical: [
    "Read one primer end to end on how a transformer actually produces a token, so attention, context windows and KV-caching stop being brand names.",
    "Run the same prompt against two models and two temperature settings, and write down what changed. Operating the controls teaches more than reading about them.",
    "Learn the cost model: what a token is, what a context window costs, and why a long document is expensive to re-send on every turn.",
  ],
  applied: [
    "Pick one weekly task in your own function and redesign it around AI end to end, including the handoffs, not just the drafting step.",
    "Write the build-versus-buy case for one tool your team is considering, with maintenance and switching costs stated in numbers.",
    "Define success for one AI initiative before it launches: the baseline, the metric, and what result would make you stop.",
  ],
  risk: [
    "Keep a log of AI outputs you had to correct, and sort them into hallucination, stale information, bias and scope error. The pattern is usually narrower than expected.",
    "Draft the one-page AI use policy for your own team: what data may go in, what needs human sign-off, and who is accountable when it is wrong.",
    "Practise naming the failure mode before deployment, not after. For each use case, write the worst plausible output and what would catch it.",
  ],
  case: [
    "Take a real AI rollout you have read about and write the decision memo its leadership should have written, with the trade-off stated explicitly.",
    "Force yourself to separate what a case shows from what it merely suggests. Most weak answers over-read a single pilot result.",
    "Practise arguing the opposite side of a deployment decision you already believe in. Decision quality improves faster than recall does.",
  ],
};

export const EXAMPLE_RESULT = {
  total: 720,
  band: "Advanced" as BandName,
  dimensions: [
    { name: "Technical AI Depth", score: 188 },
    { name: "Applied AI Fit", score: 176 },
    { name: "Risk-Reward Competency", score: 164 },
    { name: "AI Mini-Case Analysis", score: 192 },
  ],
};
