import type { AdaptiveSession } from "./adaptive";
import type { AnswerMap, FormId } from "./types";

export const RUN_KEY = "ai-fluency-run-v1";
export const PROGRESS_KEY = "ai-fluency-progress-v1";

export interface StoredRun {
  mode?: "adaptive";
  form?: FormId;
  itemIds?: string[];
  answers: AnswerMap;
  finishedAt: string;
  /** True for the published demonstration profile, so the result can say so. */
  sample?: boolean;
}

/**
 * The run lives in sessionStorage only: it never leaves the browser tab and is
 * discarded when the tab closes. Every access is guarded because storage can be
 * unavailable or throw in private windows.
 */
export function saveRun(run: StoredRun): void {
  try {
    window.sessionStorage.setItem(RUN_KEY, JSON.stringify(run));
  } catch {
    /* storage unavailable; the result is still rendered from memory */
  }
}

export function loadRun(): StoredRun | null {
  try {
    const raw = window.sessionStorage.getItem(RUN_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "answers" in parsed
    ) {
      const r = parsed as StoredRun;
      if (
        typeof r.answers === "object" &&
        ((r.mode === "adaptive" && Array.isArray(r.itemIds)) ||
          r.form === "A" ||
          r.form === "B")
      ) {
        return r;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function clearRun(): void {
  try {
    window.sessionStorage.removeItem(RUN_KEY);
  } catch {
    /* nothing to clear */
  }
}

/**
 * In-progress persistence. Without this a refresh, an accidental back
 * navigation, or a phone locking mid-test silently discards every answer and
 * drops the candidate back on the intro screen. The run itself is only written
 * on completion, so this is a separate key with its own lifetime: written after
 * every answer, cleared the moment the run finishes or is restarted.
 */
export function saveProgress(session: AdaptiveSession): void {
  try {
    window.sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(session));
  } catch {
    /* storage unavailable; the run still works in memory for this tab */
  }
}

export function loadProgress(): AdaptiveSession | null {
  try {
    const raw = window.sessionStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const s = parsed as AdaptiveSession;
    const shapeOk =
      typeof s.seed === "string" &&
      typeof s.currentItemId === "string" &&
      Array.isArray(s.administered) &&
      typeof s.answers === "object" &&
      s.answers !== null &&
      typeof s.targets === "object" &&
      s.targets !== null;
    // A completed session belongs to the run, not to progress.
    if (!shapeOk || s.complete) return null;
    return s;
  } catch {
    return null;
  }
}

export function clearProgress(): void {
  try {
    window.sessionStorage.removeItem(PROGRESS_KEY);
  } catch {
    /* nothing to clear */
  }
}
