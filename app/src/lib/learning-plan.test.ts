import assert from "node:assert/strict";
import test from "node:test";

import { buildLearningPlan } from "./learning-plan.ts";
import type { DimensionScore, Result } from "./types.ts";

const dimension = (
  key: DimensionScore["key"],
  name: string,
  score: number,
): DimensionScore => ({
  key,
  name,
  score,
  blurb: `${name} description`,
  correct: Math.round(score / 20),
  total: 10,
});

const dimensions: DimensionScore[] = [
  dimension("technical", "Technical AI Depth", 80),
  dimension("applied", "Applied AI Fit", 170),
  dimension("risk", "Risk-Reward Competency", 120),
  dimension("case", "AI Mini-Case Analysis", 150),
];

const result: Result = {
  form: "A",
  total: 520,
  band: "Novice",
  correct: 22,
  items: 34,
  dimensions,
  weakest: dimensions[0],
  strongest: dimensions[1],
};

test("selects the two lowest dimensions as development priorities", () => {
  const plan = buildLearningPlan(result);

  assert.deepEqual(
    plan.priorities.map((priority) => priority.key),
    ["technical", "risk"],
  );
  assert.equal(plan.priorities[0].score, 80);
  assert.equal(plan.priorities[1].score, 120);
});

test("builds a six-week plan with score-specific rationale and evidence", () => {
  const plan = buildLearningPlan(result);

  assert.equal(plan.durationWeeks, 6);
  assert.equal(plan.phases.length, 3);
  assert.match(plan.rationale, /80 of 200/);
  assert.match(plan.rationale, /120 of 200/);
  for (const phase of plan.phases) {
    assert.ok(phase.weeks.length > 0);
    assert.ok(phase.outcomes.length > 0);
    assert.ok(phase.practice.length > 0);
    assert.ok(phase.evidence.length > 0);
  }
});

test("uses stable dimension order when scores are tied", () => {
  const tied = dimensions.map((item) => ({ ...item, score: 100 }));
  const plan = buildLearningPlan({
    ...result,
    total: 400,
    dimensions: tied,
    weakest: tied[0],
    strongest: tied[3],
  });

  assert.deepEqual(
    plan.priorities.map((priority) => priority.key),
    ["technical", "applied"],
  );
});

test("preserves AI capitalization in the integrated practice phase", () => {
  const plan = buildLearningPlan(result);

  assert.match(
    plan.phases[2].focus,
    /Technical AI Depth and Risk-Reward Competency/,
  );
});
