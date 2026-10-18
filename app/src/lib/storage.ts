import type { AnswerMap, FormId } from "./types";

export const RUN_KEY = "ai-fluency-run-v1";

export interface StoredRun {
  mode?: "adaptive";
  form?: FormId;
  itemIds?: string[];
  answers: AnswerMap;
  finishedAt: string;
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
