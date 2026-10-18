"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { DIMENSIONS, dimensionCounts, getForm } from "@/lib/scoring";
import { saveRun } from "@/lib/storage";
import type { AnswerMap, FormId } from "@/lib/types";

const DIM_NAME: Record<string, string> = Object.fromEntries(
  DIMENSIONS.map((d) => [d.key, d.name]),
);

export function Runner() {
  const router = useRouter();
  const [form, setForm] = useState<FormId | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});

  const items = useMemo(() => (form ? getForm(form).items : []), [form]);
  const current = items[index];

  const choose = useCallback(
    (itemId: string, key: string) => {
      setAnswers((a) => ({ ...a, [itemId]: key }));
    },
    [],
  );

  const finish = useCallback(() => {
    if (!form) return;
    saveRun({ form, answers, finishedAt: new Date().toISOString() });
    router.push("/results");
  }, [answers, form, router]);

  if (!form) {
    return <Picker onPick={setForm} />;
  }

  if (!current) return null;

  const answered = Object.keys(answers).length;
  const last = index === items.length - 1;
  const scenario = getForm(form).scenario;

  return (
    <div className="q-shell">
      <h1 className="sr-h1">Form {form}</h1>
      <div className="progress">
        <div className="progress-head">
          <span>
            Form {form} · <strong>Question {index + 1}</strong> of{" "}
            {items.length}
          </span>
          <span>
            {DIM_NAME[current.section]} · {answered} answered
          </span>
        </div>
        <div
          className="bar"
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={items.length}
          aria-label="Progress through the assessment"
        >
          <div style={{ width: `${((index + 1) / items.length) * 100}%` }} />
        </div>
      </div>

      {current.section === "case" && (
        <div className="scenario">
          <h3>{scenario.title}</h3>
          <p>{scenario.body}</p>
        </div>
      )}

      <div className="q-card">
        <p className="panel-index" style={{ margin: 0 }}>
          {DIM_NAME[current.section]}
        </p>
        <h2 className="q-text">{current.q}</h2>
        <div className="options" role="group" aria-label="Answer options">
          {current.options.map((o) => {
            const on = answers[current.id] === o.key;
            return (
              <button
                type="button"
                key={o.key}
                className={on ? "opt on" : "opt"}
                aria-pressed={on}
                onClick={() => choose(current.id, o.key)}
              >
                <span className="k" aria-hidden="true">
                  {o.key}
                </span>
                <span className="t">{o.text}</span>
              </button>
            );
          })}
        </div>

        <div className="q-nav">
          <button
            type="button"
            className="ghost"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
          >
            Back
          </button>
          <span className="spacer" />
          {last ? (
            <button
              type="button"
              onClick={finish}
              disabled={answered < items.length}
            >
              {answered < items.length
                ? `${items.length - answered} left to answer`
                : "See my result"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                setIndex((i) => Math.min(items.length - 1, i + 1))
              }
              disabled={!answers[current.id]}
            >
              Next question
            </button>
          )}
        </div>

        <div className="dots" aria-hidden="true">
          {items.map((it, i) => (
            <i
              key={it.id}
              className={
                i === index ? "now" : answers[it.id] ? "done" : undefined
              }
            />
          ))}
        </div>
      </div>

      <p className="small muted" style={{ marginTop: 12 }}>
        No answer is marked right or wrong until you finish. Your responses stay
        in this browser tab and are never sent anywhere.
      </p>
    </div>
  );
}

function Picker({ onPick }: { onPick: (f: FormId) => void }) {
  const forms: FormId[] = ["A", "B"];
  return (
    <>
      <h1>Choose a form and begin</h1>
      <p className="lede">
        One item per screen, with progress shown. Nothing is marked right or
        wrong until you submit, and you can go back to change an answer before
        you do.
      </p>
      <div className="picker">
        {forms.map((f) => {
          const counts = dimensionCounts(f);
          const total = Object.values(counts).reduce((a, b) => a + b, 0);
          return (
            <button
              type="button"
              key={f}
              className="pick"
              onClick={() => onPick(f)}
            >
              <strong>Form {f}</strong>
              <span className="meta">
                {total} items · {counts.technical} technical,{" "}
                {counts.applied} applied, {counts.risk} risk-reward,{" "}
                {counts.case} mini-case
              </span>
              <span className="meta">
                Mini-case scenario:{" "}
                {f === "A"
                  ? "a retail customer-service chatbot"
                  : "a logistics route-optimization pilot"}
              </span>
              <span className="go">Start form {f}</span>
            </button>
          );
        })}
      </div>
      <div className="callout">
        <p>
          <strong>The two forms are parallel, not identical.</strong> They cover
          the same four dimensions with different items, so the same person can
          sit one now and the other later without simply remembering answers.
          Scores are on the same 800-point scale, but the forms have not been
          statistically equated, so a small difference between them should not
          be read as real change.
        </p>
      </div>
      <p className="small muted">
        Roughly 20 to 30 minutes. There is no timer, nothing is marked mid-test,
        and you can move back to change an answer before you submit.
      </p>
    </>
  );
}
