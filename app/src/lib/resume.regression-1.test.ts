// Regression: QA-002 — refreshing mid-assessment discarded every answer and
// returned the candidate to the intro screen. In-progress state lived only in
// React state; StoredRun was written on completion.
// Found by /qa on 2026-10-18 against the live prototype (lost 5 answers at Q6).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createAdaptiveSession, recordAdaptiveAnswer } from "./adaptive.ts";

const runner = readFileSync(new URL("../app/assessment/runner.tsx", import.meta.url), "utf8");
const storage = readFileSync(new URL("./storage.ts", import.meta.url), "utf8");

test("an in-progress session round-trips through JSON without loss", () => {
  let session = createAdaptiveSession("fixed-seed");
  for (let i = 0; i < 5; i += 1) {
    session = recordAdaptiveAnswer(session, "A");
  }
  const restored = JSON.parse(JSON.stringify(session)) as typeof session;
  assert.equal(restored.seed, session.seed);
  assert.equal(restored.currentItemId, session.currentItemId);
  assert.deepEqual(restored.administered, session.administered);
  assert.deepEqual(restored.answers, session.answers);
  assert.deepEqual(restored.targets, session.targets);
  assert.equal(restored.administered.length, 5);
});

test("storage exposes progress persistence separate from the finished run", () => {
  for (const fn of ["saveProgress", "loadProgress", "clearProgress"]) {
    assert.match(storage, new RegExp(`export function ${fn}\\b`), `${fn} missing`);
  }
  assert.match(storage, /PROGRESS_KEY/, "progress needs its own storage key");
});

test("loadProgress refuses a completed session", () => {
  assert.match(
    storage,
    /s\.complete\) return null/,
    "a finished session must not be resumed as progress",
  );
});

test("the runner saves after every answer and restores on mount", () => {
  assert.match(runner, /saveProgress\(updated\)/, "no save after an answer");
  assert.match(runner, /loadProgress\(\)/, "no restore on mount");
  assert.match(runner, /clearProgress\(\)/, "progress not cleared on completion");
  assert.match(runner, /useEffect\(/, "restore must happen after mount, not during render");
});
