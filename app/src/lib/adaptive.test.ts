import assert from "node:assert/strict";
import test from "node:test";

import {
  ADAPTIVE_ITEMS_PER_DIMENSION,
  createAdaptiveSession,
  recordAdaptiveAnswer,
  scoreAdaptive,
} from "./adaptive.ts";
import { ITEM_BANK } from "./item-bank.ts";
import type { Dimension } from "./types.ts";

const dimensions: Dimension[] = ["technical", "applied", "risk", "case"];

test("the adaptive bank contains 200 balanced, uniquely identified items", () => {
  assert.equal(ITEM_BANK.length, 200);
  assert.equal(new Set(ITEM_BANK.map((item) => item.id)).size, 200);
  for (const dimension of dimensions) {
    const items = ITEM_BANK.filter((item) => item.section === dimension);
    assert.equal(items.length, 50);
    for (let difficulty = 1; difficulty <= 5; difficulty += 1) {
      assert.ok(
        items.filter((item) => item.difficulty === difficulty).length >= 8,
        `${dimension} needs at least eight difficulty-${difficulty} items`,
      );
    }
  }
});

test("a correct answer makes the next item in that dimension harder", () => {
  const session = createAdaptiveSession("test-seed");
  const first = ITEM_BANK.find((item) => item.id === session.currentItemId)!;
  const answered = recordAdaptiveAnswer(session, first.answer);
  let cursor = answered;

  while (!cursor.complete) {
    const item = ITEM_BANK.find((candidate) => candidate.id === cursor.currentItemId)!;
    if (item.section === first.section) {
      assert.ok(item.difficulty > first.difficulty);
      return;
    }
    cursor = recordAdaptiveAnswer(cursor, item.answer);
  }

  assert.fail("the session did not return to the first dimension");
});

test("an incorrect answer makes the next item in that dimension easier", () => {
  const session = createAdaptiveSession("test-seed");
  const first = ITEM_BANK.find((item) => item.id === session.currentItemId)!;
  const wrong = first.options.find((option) => option.key !== first.answer)!.key;
  let cursor = recordAdaptiveAnswer(session, wrong);

  while (!cursor.complete) {
    const item = ITEM_BANK.find((candidate) => candidate.id === cursor.currentItemId)!;
    if (item.section === first.section) {
      assert.ok(item.difficulty < first.difficulty);
      return;
    }
    cursor = recordAdaptiveAnswer(cursor, item.answer);
  }

  assert.fail("the session did not return to the first dimension");
});

test("an adaptive assessment administers eight items per dimension", () => {
  let session = createAdaptiveSession("complete-run");
  while (!session.complete) {
    const item = ITEM_BANK.find((candidate) => candidate.id === session.currentItemId)!;
    session = recordAdaptiveAnswer(session, item.answer);
  }

  assert.equal(session.administered.length, ADAPTIVE_ITEMS_PER_DIMENSION * 4);
  for (const dimension of dimensions) {
    assert.equal(
      session.administered.filter((id) =>
        ITEM_BANK.some((item) => item.id === id && item.section === dimension),
      ).length,
      ADAPTIVE_ITEMS_PER_DIMENSION,
    );
  }
});

test("harder correct answers produce a higher adaptive score", () => {
  const hardIds = dimensions.flatMap((dimension) =>
    ITEM_BANK.filter((item) => item.section === dimension && item.difficulty >= 4)
      .slice(0, 8)
      .map((item) => item.id),
  );
  const easyIds = dimensions.flatMap((dimension) =>
    ITEM_BANK.filter((item) => item.section === dimension && item.difficulty <= 2)
      .slice(0, 8)
      .map((item) => item.id),
  );
  const answers = Object.fromEntries(
    [...hardIds, ...easyIds].map((id) => [
      id,
      ITEM_BANK.find((item) => item.id === id)!.answer,
    ]),
  );

  assert.ok(scoreAdaptive(hardIds, answers).total > scoreAdaptive(easyIds, answers).total);
});
