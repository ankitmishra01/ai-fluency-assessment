"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { scoreAdaptive } from "@/lib/adaptive";
import { bankItem } from "@/lib/item-bank";
import { BANDS, bandNote, DIMENSION_MAX, getForm, LEVEL_LABELS, TOTAL_MAX, score } from "@/lib/scoring";
import { clearProgress, clearRun, loadRun, type StoredRun } from "@/lib/storage";
import type { DimensionScore, Result } from "@/lib/types";

function dimensionStatus(dimension: DimensionScore, result: Result): string {
  if (dimension.key === result.weakest.key) return "Development priority";
  if (dimension.key === result.strongest.key) return "Demonstrated strength";
  return dimension.score >= 140 ? "Working capability" : "Build next";
}

export function Report() {
  const [state, setState] = useState<
    { kind: "loading" } | { kind: "none" } | { kind: "ok"; run: StoredRun }
  >({ kind: "loading" });

  useEffect(() => {
    const run = loadRun();
    setState(run ? { kind: "ok", run } : { kind: "none" });
  }, []);

  if (state.kind === "loading") return <p className="muted">Scoring your answers…</p>;

  if (state.kind === "none") {
    return (
      <div className="card result-empty">
        <h2>No result in this browser tab</h2>
        <p className="muted">This prototype keeps results in the tab where you took the assessment. Complete a form here to generate your profile and learning plan.</p>
        <Link href="/assessment" className="btn">Take the assessment</Link>
      </div>
    );
  }

  return <Scored run={state.run} />;
}

function Scored({ run }: { run: StoredRun }) {
  const adaptive = run.mode === "adaptive" && Boolean(run.itemIds);
  const result = adaptive
    ? scoreAdaptive(run.itemIds!, run.answers)
    : score(run.form!, run.answers);
  const items = adaptive
    ? run.itemIds!.map((id) => bankItem(id)).filter((item) => Boolean(item))
    : getForm(run.form!).items;
  const priorities = [...result.dimensions].sort((a, b) => a.score - b.score).slice(0, 2);

  return (
    <>
      {run.sample ? (
        <div className="development-notice"><strong>This is a sample profile.</strong> It was produced by running the real scoring over a fixed set of answers, so every number below is computed, not mocked up. <Link href="/assessment">Take the assessment yourself</Link> to generate your own.</div>
      ) : null}

      <div className="development-notice"><strong>For learning and development only.</strong> This profile is meant to guide training and coaching, not hiring, promotion, or performance evaluation.</div>

      <section className="result-hero" aria-labelledby="result-level">
        <div className="result-score">
          <span className="score">{result.total}</span><span className="outof">out of {TOTAL_MAX}</span>
          <h2 id="result-level">{LEVEL_LABELS[result.band]}</h2>
          <p>{bandNote(result.band)}</p>
          <span className="result-basis">{adaptive ? "Adaptive path" : `Form ${run.form}`} · {result.correct} of {result.items} scenarios correct</span>
        </div>
        <div className="result-interpretation">
          <p className="eyebrow">What this result says</p>
          <h2>Your strongest capability is {result.strongest.name.toLowerCase()}.</h2>
          <p>Your clearest development opportunities are {priorities[0].name} and {priorities[1].name}. The profile reflects demonstrated judgment across four equally weighted dimensions, not confidence or self-report.</p>
          <div className="evidence-strip" aria-label="Assessment evidence"><span><strong>{result.items}</strong> scenarios</span><span><strong>4</strong> dimensions</span><span><strong>200</strong> points each</span></div>
        </div>
      </section>

      <div className="section-title-row">
        <div><p className="eyebrow">Your capability profile</p><h2>Four dimensions, one development picture</h2></div>
        <p>Scores show demonstrated performance on this form.</p>
      </div>
      <div className="dimension-grid">
        {result.dimensions.map((d) => (
          <article className="dimension-card" key={d.key}>
            <h3>{d.name}</h3><div className="dimension-value">{d.score} <span>/ {DIMENSION_MAX}</span></div>
            <div className="bar" role="img" aria-label={`${d.name}: ${d.score} out of ${DIMENSION_MAX}`}><div style={{ width: `${(d.score / DIMENSION_MAX) * 100}%` }} /></div>
            <p>{d.blurb}</p>
            <span className={`dimension-status ${d.key === result.strongest.key ? "strength" : ""}`}>{dimensionStatus(d, result)}</span>
          </article>
        ))}
      </div>

      <section className="learning-cta">
        <div><p className="eyebrow">Recommended next step</p><h2>Build your six-week learning plan</h2><p>Your plan begins with {priorities[0].name} and {priorities[1].name}, then applies both capabilities to a real workplace task.</p></div>
        <Link href="/learning-plan" className="btn">View learning plan</Link>
      </section>

      <div className="section-title-row compact"><div><p className="eyebrow">Level scale</p><h2>How to read your level</h2></div></div>
      <div className="bandscale">
        {BANDS.map((b) => <div key={b.name} className={b.name === result.band ? "on" : undefined}><strong>{LEVEL_LABELS[b.name]}</strong><span className="rng">{b.min}–{b.max}</span></div>)}
      </div>
      <p className="small muted">These cut points are illustrative and have not yet been validated against an external standard of workplace performance.</p>

      <details className="item-review">
        <summary><span><strong>Review how your score was calculated</strong><small>See every question, your answer, and the keyed answer</small></span><span aria-hidden="true">Expand</span></summary>
        <div className="review">
          {items.map((it, i) => {
            if (!it) return null;
            const chosen = run.answers[it.id];
            const correct = chosen === it.answer;
            const chosenText = it.options.find((o) => o.key === chosen)?.text;
            const answerText = it.options.find((o) => o.key === it.answer)?.text;
            return <div className="rev" key={it.id}><div className="rev-top"><span>Q{i + 1}</span><span className="pill dim">{result.dimensions.find((d) => d.key === it.section)?.name}</span>{adaptive && <span className="pill dim">Difficulty {it.difficulty}/5</span>}<span className={correct ? "pill ok" : "pill no"}>{correct ? "Correct" : "Incorrect"}</span></div><p className="rev-q">{it.q}</p><dl className="rev-a"><dt>You chose</dt><dd>{chosen ? `${chosen}. ${chosenText}` : "No answer recorded"}</dd>{!correct && <><dt>Keyed answer</dt><dd>{it.answer}. {answerText}</dd></>}</dl></div>;
          })}
        </div>
      </details>

      <div className="q-nav result-actions"><Link href="/assessment" className="btn ghost" onClick={() => { clearRun(); clearProgress(); }}>Take a new adaptive path</Link><Link href="/methodology" className="btn ghost">How this was scored</Link></div>
    </>
  );
}
