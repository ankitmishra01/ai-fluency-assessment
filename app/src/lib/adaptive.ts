import { ITEM_BANK, bankItem } from "./item-bank.ts";
import { bandFor, DIMENSIONS, DIMENSION_MAX } from "./scoring.ts";
import type { AnswerMap, Dimension, DimensionScore, Result } from "./types.ts";

export const ADAPTIVE_ITEMS_PER_DIMENSION = 8;
export const ADAPTIVE_ITEM_COUNT = ADAPTIVE_ITEMS_PER_DIMENSION * 4;

const ORDER: Dimension[] = ["technical", "applied", "risk", "case"];

export interface AdaptiveSession {
  seed: string;
  currentItemId: string;
  administered: string[];
  answers: AnswerMap;
  targets: Record<Dimension, number>;
  complete: boolean;
}

function hash(value: string): number {
  let out = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    out ^= value.charCodeAt(index);
    out = Math.imul(out, 16777619);
  }
  return out >>> 0;
}

function nextItem(
  seed: string,
  dimension: Dimension,
  target: number,
  used: string[],
): string {
  const available = ITEM_BANK.filter(
    (item) =>
      item.section === dimension &&
      item.difficulty === target &&
      !used.includes(item.id),
  );
  if (available.length === 0) {
    throw new Error(`No unused ${dimension} item at difficulty ${target}`);
  }
  return available[hash(`${seed}:${dimension}:${used.length}`) % available.length].id;
}

export function createAdaptiveSession(seed = crypto.randomUUID()): AdaptiveSession {
  const targets = { technical: 3, applied: 3, risk: 3, case: 3 };
  return {
    seed,
    currentItemId: nextItem(seed, "technical", 3, []),
    administered: [],
    answers: {},
    targets,
    complete: false,
  };
}

export function recordAdaptiveAnswer(
  session: AdaptiveSession,
  answer: string,
): AdaptiveSession {
  if (session.complete) return session;
  const current = bankItem(session.currentItemId);
  if (!current) throw new Error("Adaptive session references an unknown item");

  const dimension = current.section as Dimension;
  const administered = [...session.administered, current.id];
  const answers = { ...session.answers, [current.id]: answer };
  const correct = answer === current.answer;
  const targets = {
    ...session.targets,
    [dimension]: Math.max(
      1,
      Math.min(5, session.targets[dimension] + (correct ? 1 : -1)),
    ),
  };

  if (administered.length === ADAPTIVE_ITEM_COUNT) {
    return { ...session, administered, answers, targets, complete: true };
  }

  const nextDimension = ORDER[administered.length % ORDER.length];
  return {
    ...session,
    currentItemId: nextItem(
      session.seed,
      nextDimension,
      targets[nextDimension],
      administered,
    ),
    administered,
    answers,
    targets,
  };
}

export function scoreAdaptive(itemIds: string[], answers: AnswerMap): Result {
  const dimensions: DimensionScore[] = DIMENSIONS.map((dimension) => {
    const items = itemIds
      .map((id) => bankItem(id))
      .filter(
        (item): item is NonNullable<typeof item> =>
          Boolean(item && item.section === dimension.key),
      );
    const correct = items.filter((item) => answers[item.id] === item.answer).length;
    const earned = items.reduce((sum, item) => {
      if (answers[item.id] !== item.answer) return sum;
      return sum + 0.75 + (item.difficulty ?? 3) * 0.0625;
    }, 0);
    const score = items.length
      ? Math.round((earned / (items.length * 1.0625)) * DIMENSION_MAX)
      : 0;
    return {
      key: dimension.key,
      name: dimension.name,
      blurb: dimension.blurb,
      correct,
      total: items.length,
      score,
    };
  });
  const total = dimensions.reduce((sum, dimension) => sum + dimension.score, 0);
  const ranked = [...dimensions].sort((a, b) => a.score - b.score);
  return {
    form: "Adaptive",
    total,
    band: bandFor(total),
    correct: dimensions.reduce((sum, dimension) => sum + dimension.correct, 0),
    items: itemIds.length,
    dimensions,
    weakest: ranked[0],
    strongest: ranked[ranked.length - 1],
  };
}
