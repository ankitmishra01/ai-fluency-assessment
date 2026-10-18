import type { Metadata } from "next";
import Link from "next/link";
import {
  BANDS,
  DIMENSION_MAX,
  DIMENSIONS,
  dimensionCounts,
  EXAMPLE_RESULT,
  TOTAL_MAX,
} from "@/lib/scoring";

export const metadata: Metadata = {
  title: "Methodology · AI Fluency Assessment",
  description:
    "Item counts per dimension, how scores are computed, and the validity work that would be needed before this instrument could support real decisions.",
};

export default function MethodologyPage() {
  const a = dimensionCounts("A");
  const b = dimensionCounts("B");
  const sum = (c: Record<string, number>) =>
    Object.values(c).reduce((x, y) => x + y, 0);

  return (
    <main>
      <div className="pagehead">
        <span>METHODOLOGY</span>
      </div>
      <h1>How this is built, and what it cannot yet tell you</h1>
      <p className="lede">
        A short, honest account of the item bank, the scoring arithmetic, the
        band cut points, and the validation work that has not been done. If you
        are deciding whether to use something like this, the last section is the
        one that matters.
      </p>

      <div className="prose">
        <h2>The item bank</h2>
        <p>
          Two parallel forms, A and B, written by hand for working
          professionals rather than for engineers. Each form covers the same
          four dimensions with different items, so a person can sit one form now
          and the other later. Every item is four-option multiple choice with a
          single keyed answer.
        </p>
      </div>

      <div className="table-wrap wide narrow" style={{ marginBottom: 10 }}>
        <table>
          <thead>
            <tr>
              <th>Dimension</th>
              <th className="num">Form A items</th>
              <th className="num">Form B items</th>
              <th className="num">Points</th>
            </tr>
          </thead>
          <tbody>
            {DIMENSIONS.map((d) => (
              <tr key={d.key}>
                <td>
                  <strong>{d.name}</strong>
                  <br />
                  <span className="small muted">{d.blurb}</span>
                </td>
                <td className="num">{a[d.key]}</td>
                <td className="num">{b[d.key]}</td>
                <td className="num">{DIMENSION_MAX}</td>
              </tr>
            ))}
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              <td className="num">
                <strong>{sum(a)}</strong>
              </td>
              <td className="num">
                <strong>{sum(b)}</strong>
              </td>
              <td className="num">
                <strong>{TOTAL_MAX}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="small muted narrow">
        Form B carries one fewer technical item than form A. One technical item
        was removed during review because two of its four options were both
        defensible readings of the same fact, which makes the keyed answer
        arbitrary. Removing it is the correct call: a double-keyed item adds
        noise, not information.
      </p>

      <div className="prose">
        <h2>How a score is computed</h2>
        <p>
          Each dimension is worth {DIMENSION_MAX} points regardless of how many
          items sit behind it. A dimension score is
        </p>
      </div>
      <div className="card" style={{ maxWidth: 760 }}>
        <p style={{ margin: 0, fontSize: 16 }}>
          <strong>
            (items correct in that section ÷ items in that section) ×{" "}
            {DIMENSION_MAX}
          </strong>
          , rounded to the nearest whole point.
        </p>
      </div>
      <div className="prose">
        <p>
          The four dimension scores are added to produce the headline figure out
          of {TOTAL_MAX}. Nothing is weighted, curved, or adjusted for item
          difficulty. Unanswered items count as incorrect, and the assessment
          cannot be submitted with items left blank.
        </p>
        <p>
          The worked example used across this site is{" "}
          <strong>{EXAMPLE_RESULT.total} out of {TOTAL_MAX}</strong>:{" "}
          {EXAMPLE_RESULT.dimensions.map((d, i) => (
            <span key={d.name}>
              {d.score} {d.name}
              {i < EXAMPLE_RESULT.dimensions.length - 1 ? ", " : ""}
            </span>
          ))}
          .
        </p>

        <h3>Why equal weights</h3>
        <p>
          Equal weighting is a judgment, not a finding. It says the four
          capabilities matter equally for the work, even though they are not
          equally easy to write items for. The mini-case dimension carries only
          four items, so each one is worth {DIMENSION_MAX / 4} points and a
          single careless answer moves the headline score by the same{" "}
          {DIMENSION_MAX / 4} points. That is the sharpest measurement weakness
          in the current design and the first thing more items would fix.
        </p>

        <h3>Precision the scale does not have</h3>
        <p>
          Reporting a score to the point implies precision this instrument has
          not earned. With ten items in a dimension, each item is worth 20
          points; with four, each is worth {DIMENSION_MAX / 4}. A gap of thirty
          or forty points between two people is well inside the noise. Treat the
          scale as ordered bands with soft edges, not as a measurement you can
          take a difference of.
        </p>

        <h2>Band cut points</h2>
        <p>
          The four band names come from the source test documents. The numeric
          boundaries below were set by judgment on the {TOTAL_MAX}-point scale
          and are illustrative. They have not been anchored to any external
          standard, which in testing terms means no standard-setting exercise
          has been run.
        </p>
      </div>
      <div className="table-wrap wide narrow" style={{ marginBottom: 10 }}>
        <table>
          <thead>
            <tr>
              <th>Band</th>
              <th className="num">Range</th>
              <th className="num">Share of scale</th>
              <th>Reading</th>
            </tr>
          </thead>
          <tbody>
            {BANDS.map((bd) => (
              <tr key={bd.name}>
                <td>
                  <strong>{bd.name}</strong>
                </td>
                <td className="num">
                  {bd.min}–{bd.max}
                </td>
                <td className="num">
                  {Math.round((bd.min / TOTAL_MAX) * 100)}–
                  {Math.floor((bd.max / TOTAL_MAX) * 100)}%
                </td>
                <td>{bd.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small muted narrow">
        A proper standard-setting exercise, such as a modified Angoff panel,
        would replace these with cut points defensible to a third party: a panel
        of subject-matter experts judges, item by item, what share of
        minimally-competent candidates would answer correctly, and the cut score
        falls out of those judgments rather than out of round numbers.
      </p>

      <div className="prose">
        <h2>What would make this a real instrument</h2>
        <p>
          What exists today is a well-specified prototype on a pilot item bank.
          Four things stand between it and a measure that could carry a decision
          about a person. They are listed in the order they should be done,
          because each one is wasted effort if the one before it fails.
        </p>

        <h3>1. Content validity review</h3>
        <p>
          A panel of independent subject-matter experts rates each item on
          whether it measures the dimension it is assigned to and whether the
          keyed answer is unambiguously the best one. The usual output is a
          content validity ratio per item; items that fail get rewritten or
          dropped. This step also catches double-keyed items of the kind already
          removed from form B, and it is the step that would most improve the
          current bank, because it needs expert time rather than large samples.
        </p>

        <h3>2. Item discrimination analysis</h3>
        <p>
          With a pilot sample, compute each item&apos;s difficulty (the share
          answering correctly) and its discrimination, typically the
          point-biserial correlation between getting that item right and the
          rest of the score. Items that everyone passes carry no information;
          items that strong candidates get wrong more often than weak ones are
          broken and must go. Distractor analysis belongs here too: an option
          nobody ever picks is doing no work. Useful signal needs on the order
          of 200 to 300 respondents per form.
        </p>

        <h3>3. Test-retest reliability</h3>
        <p>
          The same people sit form A and then form B after a gap long enough to
          blunt memory, commonly two to four weeks. The correlation between the
          two scores estimates how much of the score is signal and how much is
          noise. Internal consistency, such as Cronbach&apos;s alpha computed
          within each dimension, should be reported alongside it. A dimension
          built from four items will almost certainly show poor internal
          consistency, which is exactly why that result needs publishing rather
          than hiding. This step also tells you whether the two forms are
          genuinely equated or merely similar.
        </p>

        <h3>4. Criterion validation against on-the-job performance</h3>
        <p>
          The one that actually matters, and the one most vendors skip. Scores
          are correlated against an independent measure of how well people use
          AI in their real work: manager ratings on a defined rubric, assessed
          work samples, or a hard outcome such as time saved on a defined task.
          Without it, a high score means someone is good at this test. It does
          not yet mean they are good at the job, and any claim otherwise is
          unsupported.
        </p>
        <p>
          A fair design would also check that the instrument does not
          systematically disadvantage groups for reasons unrelated to AI
          fluency, through differential item functioning analysis. Reading load,
          idiom and business-context assumptions are the usual culprits in items
          like these.
        </p>

        <h2>Known limitations in this build</h2>
        <ul className="clean">
          <li>
            <strong>
              The keyed answer is often the longest option, which is a real
              validity problem.
            </strong>{" "}
            On form A the correct answer is the longest of the four options in
            26 of 34 items, or 76 percent, against 25 percent by chance. Keyed
            options average 126 characters and distractors average 98. Form B is
            milder at 14 of 33, or 42 percent, with 130 against 108 characters.
            This is the classic multiple-choice defect: a test-wise candidate
            who knows nothing about the subject can score above chance by
            picking the longest, most hedged option, so part of what this
            instrument currently measures is test-taking skill rather than AI
            fluency. The fix is cheap and mechanical, lengthen the distractors
            and trim the keys until the four options are of comparable weight,
            and it is the first thing that should happen before anyone uses a
            score for a real decision. It is disclosed here rather than left for
            a reader to discover, because an instrument that hides its own
            measurement error is worse than one that names it.
          </li>
          <li>
            <strong>Form B&apos;s answer key is unbalanced.</strong> Of its 33
            items, 7 are keyed A, 13 B, 11 C and only 2 D. Guessing B beats
            chance. Form A is close to even at 9, 10, 6 and 9. Balancing the key
            distribution is part of the same cleanup pass.
          </li>
          <li>
            <strong>Unproctored and untimed.</strong> No identity check, no
            timer and no lockdown, so a score is only as honest as the person
            taking it. Fine for self-assessment and team diagnostics; not fine
            for selection.
          </li>
          <li>
            <strong>Multiple choice measures recognition.</strong> Picking the
            best option from four is easier than producing the answer unaided,
            and it overstates ability at the top of the scale. The source
            documents include open-response prompts that are not part of this
            build, and they would address this directly.
          </li>
          <li>
            <strong>The forms are not statistically equated.</strong> They are
            parallel by design and intent, not by measurement. A difference of a
            few dozen points between form A and form B should not be read as
            real change in a person.
          </li>
          <li>
            <strong>The content ages.</strong> Items referring to current model
            behaviour and tooling will need review on something like a
            six-month cycle.
          </li>
          <li>
            <strong>The bank is small.</strong> Around thirty items per form is
            enough for a profile with four coarse bands. It is not enough for
            fine-grained scores, and items cannot be rotated to limit exposure.
          </li>
        </ul>

        <h2>Data handling</h2>
        <p>
          There is no backend, no database, no account system, no analytics and
          no cookies. The assessment runs entirely in the browser; answers are
          held in that tab&apos;s session storage and scored on the device. No
          personal data is collected, nothing is transmitted, and no record of
          any result exists after the tab is closed. That also means results
          cannot be recovered, compared across people, or aggregated, which is
          itself a limitation for anyone who wants team-level reporting.
        </p>

        <h2>Provenance</h2>
        <p>
          The items were written by Ankit Mishra and parsed from the source test
          documents into a typed data file. Parsing is reproducible rather than
          hand-transcribed, so the bank in this app matches the source. Two
          defects were found and handled during that pass: one item whose
          options were mislabelled in the source (A, C, C, D) was relabelled by
          position without changing the keyed answer, and one double-keyed item
          was removed.
        </p>
      </div>

      <div className="card dark">
        <p className="eyebrow">The honest summary</p>
        <p className="muted" style={{ marginBottom: 0 }}>
          This measures what it measures: performance on sixty-seven
          hand-written items across four defined dimensions. It is a credible
          structure for a diagnostic conversation and a reasonable basis for
          deciding what to teach a team next. It is not evidence about any
          individual that should be used to make a decision about them, and it
          should not be described to a client as anything more until the four
          steps above have been run and reported.
        </p>
      </div>

      <div className="q-nav">
        <Link href="/assessment" className="btn">
          Take the assessment
        </Link>
        <Link href="/" className="btn ghost">
          Back to overview
        </Link>
      </div>
    </main>
  );
}
