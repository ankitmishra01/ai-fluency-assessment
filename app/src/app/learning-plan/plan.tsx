"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buildLearningPlan } from "@/lib/learning-plan";
import { scoreAdaptive } from "@/lib/adaptive";
import { DIMENSION_MAX, LEVEL_LABELS, score } from "@/lib/scoring";
import { loadRun, type StoredRun } from "@/lib/storage";

export function LearningPlanReport() {
  const [run, setRun] = useState<StoredRun | null | undefined>(undefined);
  useEffect(() => setRun(loadRun()), []);

  if (run === undefined) return <p className="muted">Building your learning plan…</p>;
  if (run === null) return <div className="card result-empty"><h1>No assessment result found</h1><p className="muted">Complete the assessment in this browser tab before opening a learning plan.</p><Link className="btn" href="/assessment">Take the assessment</Link></div>;

  const result = run.mode === "adaptive" && run.itemIds
    ? scoreAdaptive(run.itemIds, run.answers)
    : score(run.form!, run.answers);
  const plan = buildLearningPlan(result);

  return (
    <>
      <div className="plan-toolbar no-print"><Link href="/results" className="btn ghost">Back to results</Link><button type="button" onClick={() => window.print()}>Print or save PDF</button></div>
      <header className="plan-heading"><div><p className="eyebrow">AI fluency development plan</p><h1>Your six-week learning plan</h1></div><div className="plan-score"><strong>{result.total}</strong><span>out of 800 · {LEVEL_LABELS[result.band]}</span></div></header>
      {run.sample ? <div className="development-notice"><strong>This is a sample plan</strong>, generated from the sample profile by the same code a real result uses.</div> : null}
      <div className="development-notice"><strong>For learning and development only.</strong> Use this plan to guide practice and manager support. Do not use it for hiring, promotion, or performance evaluation.</div>
      <section className="plan-summary"><div><p className="eyebrow">Why these priorities</p><h2>Your plan follows the clearest score gaps</h2><p>{plan.rationale}</p></div><dl>{result.dimensions.map((dimension) => <div key={dimension.key}><dt>{dimension.name}</dt><dd>{dimension.score} / {DIMENSION_MAX}</dd></div>)}</dl></section>
      <section className="plan-phases" aria-label="Six-week learning schedule">
        {plan.phases.map((phase, index) => <article className="plan-phase" key={phase.weeks}><div className="phase-marker"><span>{String(index + 1).padStart(2, "0")}</span><strong>{phase.weeks}</strong></div><div className="phase-content"><h2>{phase.title}</h2><p className="phase-focus">{phase.focus}</p><div className="phase-grid"><div><h3>Learning outcomes</h3><ul>{phase.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></div><div><h3>Workplace practice</h3><p>{phase.practice}</p><h3>Evidence of completion</h3><p>{phase.evidence}</p></div></div></div></article>)}
      </section>
      <section className="manager-section"><div><p className="eyebrow">Manager conversation</p><h2>Support growth without turning the score into a rating</h2></div><ol>{plan.managerPrompts.map((prompt) => <li key={prompt}>{prompt}</li>)}</ol></section>
      <section className="reassess-section"><div><p className="eyebrow">After the program</p><h2>Reassess in 6–8 weeks</h2></div><p>Use a new adaptive path after the employee completes the learning activities. Compare the four-dimension profile and the quality of workplace evidence, not only the total score.</p></section>
      <footer className="plan-print-footer">AI Fluency Assessment · {run.mode === "adaptive" ? "Adaptive path" : `Form ${run.form}`} · Generated from this browser session</footer>
    </>
  );
}
