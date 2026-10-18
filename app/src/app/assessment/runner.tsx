"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ADAPTIVE_ITEM_COUNT,
  createAdaptiveSession,
  recordAdaptiveAnswer,
  type AdaptiveSession,
} from "@/lib/adaptive";
import { bankItem } from "@/lib/item-bank";
import { DIMENSIONS } from "@/lib/scoring";
import { clearProgress, loadProgress, saveProgress, saveRun } from "@/lib/storage";

const DIM_NAME: Record<string, string> = Object.fromEntries(
  DIMENSIONS.map((dimension) => [dimension.key, dimension.name]),
);

export function Runner() {
  const router = useRouter();
  const [session, setSession] = useState<AdaptiveSession | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  // `restored` is only used to tell the candidate why they are mid-test.
  const [restored, setRestored] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Resume an interrupted run. Reading storage during render would break the
  // static prerender, so this runs once after mount.
  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      setSession(saved);
      setRestored(true);
    }
    setHydrated(true);
  }, []);

  const submit = useCallback(() => {
    if (!session || !selected) return;
    const updated = recordAdaptiveAnswer(session, selected);
    if (updated.complete) {
      saveRun({
        mode: "adaptive",
        itemIds: updated.administered,
        answers: updated.answers,
        finishedAt: new Date().toISOString(),
      });
      clearProgress();
      router.push("/results");
      return;
    }
    saveProgress(updated);
    setSession(updated);
    setSelected(null);
    setRestored(false);
  }, [router, selected, session]);

  // Hold the frame until storage has been read, so a resumable run never
  // flashes the intro screen and invites the candidate to start over.
  if (!hydrated) return <p className="muted">Loading your assessment…</p>;

  if (!session) {
    return (
      <AdaptiveIntro
        onStart={() => {
          const fresh = createAdaptiveSession();
          saveProgress(fresh);
          setSession(fresh);
        }}
      />
    );
  }

  const current = bankItem(session.currentItemId);
  if (!current) return null;
  const number = session.administered.length + 1;

  return (
    <div className="q-shell">
      <h1 className="sr-h1">Adaptive AI fluency assessment</h1>
      <div className="progress">
        <div className="progress-head">
          <span><strong>Question {number}</strong> of {ADAPTIVE_ITEM_COUNT}{restored ? " · resumed" : ""}</span>
          <span>{DIM_NAME[current.section]} · Adaptive path</span>
        </div>
        <div className="bar" role="progressbar" aria-valuenow={number} aria-valuemin={1} aria-valuemax={ADAPTIVE_ITEM_COUNT} aria-label="Progress through the assessment">
          <div style={{ width: `${(number / ADAPTIVE_ITEM_COUNT) * 100}%` }} />
        </div>
      </div>

      <div className="q-card">
        <p className="panel-index" style={{ margin: 0 }}>{DIM_NAME[current.section]}</p>
        <h2 className="q-text">{current.q}</h2>
        <div className="options" role="group" aria-label="Answer options">
          {current.options.map((option) => (
            <button type="button" key={option.key} className={selected === option.key ? "opt on" : "opt"} aria-pressed={selected === option.key} onClick={() => setSelected(option.key)}>
              <span className="k" aria-hidden="true">{option.key}</span>
              <span className="t">{option.text}</span>
            </button>
          ))}
        </div>
        <div className="q-nav adaptive-nav">
          <span className="small muted">Your answer sets the difficulty of a later question in this dimension.</span>
          <span className="spacer" />
          <button type="button" onClick={submit} disabled={!selected}>Submit answer</button>
        </div>
        <div className="dots" aria-hidden="true">
          {Array.from({ length: ADAPTIVE_ITEM_COUNT }, (_, index) => <i key={index} className={index === number - 1 ? "now" : index < number - 1 ? "done" : undefined} />)}
        </div>
      </div>

      <p className="small muted" style={{ marginTop: 12 }}>
        Answers are final because each one determines your later item difficulty. Nothing is marked right or wrong until the end, and nothing leaves this browser tab.
      </p>
    </div>
  );
}

function AdaptiveIntro({ onStart }: { onStart: () => void }) {
  return (
    <section className="adaptive-intro">
      <p className="eyebrow">Adaptive assessment · 32 questions</p>
      <h1>The questions adjust to your demonstrated level.</h1>
      <p className="lede">The assessment starts at medium difficulty in each dimension. Correct answers lead to harder questions; incorrect answers lead to easier ones. You will answer eight questions in each of four dimensions, selected from a 200-item bank.</p>
      <div className="adaptive-facts" aria-label="Assessment format">
        <div><strong>200</strong><span>items in the bank</span></div>
        <div><strong>32</strong><span>items in your path</span></div>
        <div><strong>4</strong><span>balanced dimensions</span></div>
        <div><strong>20–25</strong><span>minutes</span></div>
      </div>
      <div className="callout"><p><strong>Answers become final when submitted.</strong> Like other adaptive tests, changing an earlier response would change the questions selected afterward. There is no penalty for taking time to think.</p></div>
      <div className="q-nav adaptive-nav" style={{ borderTop: "none", paddingTop: 0 }}>
        <button type="button" onClick={onStart}>Begin adaptive assessment</button>
        <span className="spacer" />
        <Link href="/sample" className="btn ghost">See a sample profile instead</Link>
      </div>
    </section>
  );
}
