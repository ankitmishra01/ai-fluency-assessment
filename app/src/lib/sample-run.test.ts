import assert from "node:assert/strict";
import test from "node:test";

import { ADAPTIVE_ITEM_COUNT, scoreAdaptive } from "./adaptive.ts";
import { buildSampleRun } from "./sample-run.ts";

test("the sample run is a complete adaptive path", () => {
  const run = buildSampleRun();
  assert.equal(run.mode, "adaptive");
  assert.equal(run.sample, true);
  assert.equal(run.itemIds?.length, ADAPTIVE_ITEM_COUNT);
  assert.equal(new Set(run.itemIds).size, ADAPTIVE_ITEM_COUNT, "items must not repeat");
});

test("the sample profile is uneven, so strength and priority are meaningful", () => {
  const run = buildSampleRun();
  const result = scoreAdaptive(run.itemIds!, run.answers);
  assert.notEqual(
    result.strongest.key,
    result.weakest.key,
    "a flat profile makes the strongest/weakest callouts look arbitrary",
  );
  const scores = result.dimensions.map((d) => d.score);
  assert.ok(Math.max(...scores) - Math.min(...scores) >= 40, `spread too narrow: ${scores}`);
});

test("the sample lands mid-scale, not at either extreme", () => {
  const run = buildSampleRun();
  const result = scoreAdaptive(run.itemIds!, run.answers);
  assert.ok(result.total > 300, `sample too low to be useful: ${result.total}`);
  assert.ok(result.total < 700, `sample too high to show development priorities: ${result.total}`);
});

test("the sample is deterministic", () => {
  const a = scoreAdaptive(buildSampleRun().itemIds!, buildSampleRun().answers);
  const b = scoreAdaptive(buildSampleRun().itemIds!, buildSampleRun().answers);
  assert.equal(a.total, b.total);
});
