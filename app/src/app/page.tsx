import Link from "next/link";
import {
  BANDS,
  DIMENSIONS,
  dimensionCounts,
  EXAMPLE_RESULT,
} from "@/lib/scoring";

export default function Home() {
  const a = dimensionCounts("A");
  const b = dimensionCounts("B");
  const totalItems =
    Object.values(a).reduce((x, y) => x + y, 0) +
    Object.values(b).reduce((x, y) => x + y, 0);

  return (
    <main id="main-content" className="home-main">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">Workplace AI capability · Pilot instrument</p>
          <h1>What someone can actually do with AI, scored out of 800.</h1>
          <p className="hero-lede">
            Most AI readiness surveys measure confidence. This measures
            judgment. Four dimensions, 200 points each, built on a pilot bank of{" "}
            {totalItems} items written for working professionals rather than for
            engineers.
          </p>
          <div className="hero-actions">
            <Link href="/assessment" className="btn hero-cta">
              Take the assessment
            </Link>
            <Link href="/methodology" className="btn ghost hero-cta">
              How it is scored
            </Link>
          </div>
        </div>
        <aside className="hero-aside" aria-label="Assessment overview">
          <p className="aside-label">Built for development, not evaluation</p>
          <p>Use the profile to target learning programs and measure growth across four practical capabilities.</p>
          <ol className="sequence">
          <li>
            <span>01</span>
            <strong>Pick a form</strong>
            Two parallel forms, A and B, so the same person can be retested.
          </li>
          <li>
            <span>02</span>
            <strong>Answer</strong>
            One item per screen. Nothing is marked right or wrong mid-test.
          </li>
          <li>
            <span>03</span>
            <strong>Read the profile</strong>
            A score, a band, four dimensions, and the one to work on next.
          </li>
          </ol>
        </aside>
      </section>

      <section className="capability-section" aria-labelledby="capability-title">
        <div className="section-intro">
          <p className="eyebrow">The capability framework</p>
          <h2 id="capability-title">Four dimensions that matter at work.</h2>
          <p>Each dimension contributes equally to the final profile, so technical knowledge cannot mask weak judgment and vice versa.</p>
        </div>
        <div className="workspace">
        {DIMENSIONS.map((d, i) => (
          <div className="panel" key={d.key}>
            <p className="panel-index">
              {String(i + 1).padStart(2, "0")} · 200 points
            </p>
            <h2>{d.name}</h2>
            <p>{d.blurb}</p>
          </div>
        ))}
        </div>
      </section>

      <div className="live-strip">
        <div>
          <span className="k">Total scale</span>
          <strong>800 points</strong>
        </div>
        <div>
          <span className="k">Dimensions</span>
          <strong>4 × 200</strong>
        </div>
        <div>
          <span className="k">Form A</span>
          <strong>{Object.values(a).reduce((x, y) => x + y, 0)} items</strong>
        </div>
        <div>
          <span className="k">Form B</span>
          <strong>{Object.values(b).reduce((x, y) => x + y, 0)} items</strong>
        </div>
      </div>

      <section className="scoring-section" aria-labelledby="scoring-title">
        <div className="section-intro narrow-intro">
          <p className="eyebrow">Transparent scoring</p>
          <h2 id="scoring-title">A profile you can inspect, not a black-box verdict.</h2>
        </div>
        <div className="grid2 scoring-grid">
        <div className="card">
          <h2>Every dimension is worth the same</h2>
          <p className="muted">
            A dimension score is the share of its items answered correctly,
            multiplied by 200 and rounded. The four dimension scores add up to
            the headline figure out of 800.
          </p>
          <p className="muted" style={{ marginBottom: 0 }}>
            Sections hold different numbers of items, so a dimension built from
            four mini-case items weighs exactly as much as one built from ten
            technical items. That is a deliberate choice: the four capabilities
            matter equally for the work, even though they are not equally easy
            to write items for.
          </p>
        </div>
        <div className="card">
          <h2>Worked example</h2>
          <p className="muted">
            A result of {EXAMPLE_RESULT.total} out of 800 lands in the{" "}
            {EXAMPLE_RESULT.band} band and breaks down as:
          </p>
          <div className="table-wrap">
            <table>
              <tbody>
                {EXAMPLE_RESULT.dimensions.map((d) => (
                  <tr key={d.name}>
                    <td>{d.name}</td>
                    <td className="num">{d.score} / 200</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small muted" style={{ margin: "8px 0 0" }}>
            The profile matters more than the headline. This person is strong on
            case judgment and weakest on risk, which points at a very different
            development plan than the total alone suggests.
          </p>
        </div>
        </div>
      </section>

      <p className="eyebrow">Illustrative bands</p>
      <div className="bandscale">
        {BANDS.map((b2) => (
          <div key={b2.name}>
            <strong>{b2.name}</strong>
            <span className="rng">
              {b2.min}–{b2.max}
            </span>
          </div>
        ))}
      </div>
      <p className="small muted">
        These cut points are set by judgment, not by data. They have not been
        anchored to any external standard of performance, so they describe the
        shape of the scale rather than a verdict on a person.
      </p>

      <section className="guardrails" aria-labelledby="guardrails-title">
        <div className="guardrails-heading">
          <p className="eyebrow">Responsible use</p>
          <h2 id="guardrails-title">Use the signal to plan learning. Do not turn it into a personnel rating.</h2>
        </div>
        <div className="guardrails-copy">
        <ul className="clean">
          <li>
            <strong>Not a validated instrument.</strong> No item discrimination
            analysis, no reliability coefficient, no criterion study against
            on-the-job performance has been run. The{" "}
            <Link href="/methodology">methodology page</Link> sets out what that
            work would involve.
          </li>
          <li>
            <strong>Not a hiring or performance decision tool.</strong> Nothing
            here should gate pay, promotion or selection. Used that way, an
            unvalidated test is both bad measurement and a legal exposure.
          </li>
          <li>
            <strong>Not a certification.</strong> There is no proctoring, no
            identity check and no time limit, so a score is only as honest as
            the person taking it.
          </li>
          <li>
            <strong>Not a measure of technical AI engineering skill.</strong>{" "}
            The technical dimension tests whether someone understands the
            machinery well enough to operate and question it, not whether they
            could build it.
          </li>
        </ul>
        </div>
      </section>

      <div className="privacy-panel">
        <p className="eyebrow">Privacy</p>
        <h2 style={{ color: "var(--paper)" }}>
          Nothing you answer leaves your browser.
        </h2>
        <p className="muted" style={{ marginBottom: 0 }}>
          There is no backend, no database, no account and no analytics. Your
          answers are held in your browser tab for the length of the session and
          scored on your own device. Nobody, including Ankit, can see your
          result. Close the tab and it is gone.
        </p>
      </div>

      <div className="closing-cta">
        <div><p className="eyebrow">Ready when you are</p><h2>See your four-dimension profile.</h2></div>
        <Link href="/assessment" className="btn hero-cta">
          Start the assessment
        </Link>
      </div>
    </main>
  );
}
