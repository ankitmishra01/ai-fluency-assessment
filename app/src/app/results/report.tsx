"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BANDS,
  bandNote,
  DIMENSION_MAX,
  getForm,
  IMPROVEMENT,
  TOTAL_MAX,
  score,
} from "@/lib/scoring";
import { clearRun, loadRun, type StoredRun } from "@/lib/storage";
import type { Dimension, Result } from "@/lib/types";

export function Report() {
  const [state, setState] = useState<
    { kind: "loading" } | { kind: "none" } | { kind: "ok"; run: StoredRun }
  >({ kind: "loading" });

  useEffect(() => {
    const run = loadRun();
    setState(run ? { kind: "ok", run } : { kind: "none" });
  }, []);

  if (state.kind === "loading") {
    return <p className="muted">Scoring your answers…</p>;
  }

  if (state.kind === "none") {
    return (
      <div className="card">
        <h2>No result in this browser tab</h2>
        <p className="muted">
          Results are held in the tab you took the assessment in and are not
          stored anywhere else. If you closed the tab, reopened the page in a
          new one, or have not taken the assessment yet, there is nothing to
          show.
        </p>
        <Link href="/assessment" className="btn">
          Take the assessment
        </Link>
      </div>
    );
  }

  return <Scored run={state.run} />;
}

function Scored({ run }: { run: StoredRun }) {
  const result: Result = score(run.form, run.answers);
  const items = getForm(run.form).items;
  const tips = IMPROVEMENT[result.weakest.key as Dimension];
  const gap = result.strongest.score - result.weakest.score;

  return (
    <>
      <div className="headline">
        <div>
          <div className="score">{result.total}</div>
          <div className="outof">out of {TOTAL_MAX}</div>
        </div>
        <div>
          <p className="band">{result.band}</p>
          <p>
            {bandNote(result.band)} Form {run.form}, {result.correct} of{" "}
            {result.items} items correct.
          </p>
        </div>
      </div>

      <div className="callout">
        <p style={{ margin: 0 }}>
          <strong>Read the profile, not the number.</strong> The band is an
          illustrative cut point chosen by judgment, not a validated standard.
          What is worth acting on is the shape across the four dimensions
          below.
        </p>
      </div>

      <p className="eyebrow">Where the score came from</p>
      <div className="card">
        {result.dimensions.map((d) => {
          const low = gap > 0 && d.key === result.weakest.key;
          return (
            <div className={low ? "dim low" : "dim"} key={d.key}>
              <div className="dim-head">
                <h3>{d.name}</h3>
                <span className="v">
                  {d.score}
                  <span className="muted" style={{ fontWeight: 400 }}>
                    {" "}
                    / {DIMENSION_MAX}
                  </span>
                </span>
              </div>
              <p className="blurb">{d.blurb}</p>
              <div
                className="bar"
                role="img"
                aria-label={`${d.name}: ${d.score} out of ${DIMENSION_MAX}`}
              >
                <div style={{ width: `${(d.score / DIMENSION_MAX) * 100}%` }} />
              </div>
              <p className="meta">
                {d.correct} of {d.total} items correct
                {low ? " · lowest dimension" : ""}
              </p>
            </div>
          );
        })}
      </div>

      <p className="eyebrow">Where to improve</p>
      <div className="card t-violet">
        <h2>Start with {result.weakest.name}</h2>
        <p className="muted">
          {gap > 0 ? (
            <>
              It is your lowest dimension at {result.weakest.score} of{" "}
              {DIMENSION_MAX}, {gap} points below your strongest (
              {result.strongest.name}).
            </>
          ) : (
            <>
              All four dimensions came out level at {result.weakest.score} of{" "}
              {DIMENSION_MAX}, so there is no weak spot to point at. Take this
              one as the default place to go deeper.
            </>
          )}{" "}
          {result.weakest.blurb} Three concrete things that move it:
        </p>
        <ul className="clean">
          {tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="small muted" style={{ marginBottom: 0 }}>
          With {result.weakest.total} items behind this dimension, a single
          lucky or unlucky answer moves it by{" "}
          {Math.round(DIMENSION_MAX / result.weakest.total)} points. Treat the
          gap as a signal to look into, not a measurement you can rely on.
        </p>
      </div>

      <p className="eyebrow">Band scale</p>
      <div className="bandscale">
        {BANDS.map((b) => (
          <div key={b.name} className={b.name === result.band ? "on" : undefined}>
            <strong>{b.name}</strong>
            <span className="rng">
              {b.min}–{b.max}
            </span>
          </div>
        ))}
      </div>
      <p className="small muted">
        Illustrative only. These boundaries have not been anchored to any
        external standard of job performance.
      </p>

      <p className="eyebrow">Item review</p>
      <div className="review">
        {items.map((it, i) => {
          const chosen = run.answers[it.id];
          const correct = chosen === it.answer;
          const chosenText = it.options.find((o) => o.key === chosen)?.text;
          const answerText = it.options.find(
            (o) => o.key === it.answer,
          )?.text;
          return (
            <div className="rev" key={it.id}>
              <div className="rev-top">
                <span>Q{i + 1}</span>
                <span className="pill dim">
                  {result.dimensions.find((d) => d.key === it.section)?.name}
                </span>
                <span className={correct ? "pill ok" : "pill no"}>
                  {correct ? "Correct" : "Incorrect"}
                </span>
              </div>
              <p className="rev-q">{it.q}</p>
              <dl className="rev-a">
                <dt>You chose</dt>
                <dd>
                  {chosen ? `${chosen}. ${chosenText}` : "No answer recorded"}
                </dd>
                {!correct && (
                  <>
                    <dt>Correct</dt>
                    <dd>
                      {it.answer}. {answerText}
                    </dd>
                  </>
                )}
              </dl>
            </div>
          );
        })}
      </div>

      <div className="q-nav" style={{ marginTop: 18 }}>
        <Link
          href="/assessment"
          className="btn"
          onClick={() => clearRun()}
        >
          Take the other form
        </Link>
        <Link href="/methodology" className="btn ghost">
          How this was scored
        </Link>
      </div>
    </>
  );
}
