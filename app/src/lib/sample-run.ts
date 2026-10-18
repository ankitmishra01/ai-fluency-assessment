import {
  createAdaptiveSession,
  recordAdaptiveAnswer,
  type AdaptiveSession,
} from "./adaptive.ts";
import { bankItem } from "./item-bank.ts";
import type { Dimension } from "./types.ts";
import type { StoredRun } from "./storage.ts";

/**
 * A fixed, plausible profile so someone can see what the instrument produces
 * without answering thirty-two questions first. Uneven on purpose: the result
 * page picks a strongest and a weakest dimension, and a flat profile would
 * make that logic look arbitrary.
 */
const CORRECT_PER_DIMENSION: Record<Dimension, number> = {
  technical: 6,
  applied: 5,
  risk: 4,
  case: 3,
};

export const SAMPLE_SEED = "sample-profile-v1";

export function buildSampleRun(): StoredRun {
  let session: AdaptiveSession = createAdaptiveSession(SAMPLE_SEED);
  const used: Partial<Record<Dimension, number>> = {};

  while (!session.complete) {
    const item = bankItem(session.currentItemId);
    if (!item) throw new Error("Sample run referenced an unknown item");
    const dimension = item.section as Dimension;
    const seen = used[dimension] ?? 0;
    used[dimension] = seen + 1;

    const answerCorrectly = seen < CORRECT_PER_DIMENSION[dimension];
    const wrong = item.options.find((option) => option.key !== item.answer);
    session = recordAdaptiveAnswer(
      session,
      answerCorrectly ? item.answer : (wrong?.key ?? item.answer),
    );
  }

  return {
    mode: "adaptive",
    itemIds: session.administered,
    answers: session.answers,
    finishedAt: new Date().toISOString(),
    sample: true,
  };
}
