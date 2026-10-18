// Regression: QA-001 — /learning-plan rendered the internal BandName ("Beginner")
// instead of the published label ("Foundation builder"), so the same score was
// described with a level that does not appear on the results-page scale.
// Found by /qa on 2026-10-18 against the live prototype.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { BANDS, LEVEL_LABELS } from "./scoring.ts";

test("every band has a published label", () => {
  for (const band of BANDS) {
    assert.ok(
      LEVEL_LABELS[band.name],
      `band ${band.name} has no public label`,
    );
  }
});

test("published labels never leak an internal band name", () => {
  const internal = BANDS.map((b) => b.name);
  for (const [name, label] of Object.entries(LEVEL_LABELS)) {
    assert.ok(
      !internal.includes(label as (typeof internal)[number]),
      `label for ${name} is the internal name "${label}"`,
    );
  }
});

test("no page renders a raw result.band", () => {
  for (const page of ["../app/learning-plan/plan.tsx", "../app/results/report.tsx"]) {
    const src = readFileSync(new URL(page, import.meta.url), "utf8");
    assert.ok(
      !/\{\s*result\.band\s*\}/.test(src),
      `${page} renders result.band directly; wrap it in LEVEL_LABELS`,
    );
  }
});
