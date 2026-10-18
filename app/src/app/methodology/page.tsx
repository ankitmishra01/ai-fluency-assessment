import type { Metadata } from "next";
import Link from "next/link";
import { ADAPTIVE_ITEM_COUNT, ADAPTIVE_ITEMS_PER_DIMENSION } from "@/lib/adaptive";
import { ITEM_BANK } from "@/lib/item-bank";
import { BANDS, DIMENSION_MAX, DIMENSIONS, TOTAL_MAX } from "@/lib/scoring";

export const metadata: Metadata = {
  title: "Methodology · AI Fluency Assessment",
  description: "How the 200-item adaptive bank selects questions, computes scores, and should be validated before higher-stakes use.",
};

export default function MethodologyPage() {
  return (
    <main id="main-content" className="methodology-page">
      <div className="pagehead"><span>METHODOLOGY</span></div>
      <h1>How the adaptive assessment works</h1>
      <p className="lede">A transparent account of the 200-item bank, adaptive routing, scoring, and the validation work still required. The design is similar in principle to computer-adaptive tests, but it is not presented as psychometrically equivalent to the GRE or GMAT.</p>

      <nav className="methodology-nav" aria-label="Methodology sections">
        <a href="#item-bank">Item bank</a><a href="#adaptive">Adaptive path</a><a href="#scoring">Scoring</a><a href="#bands">Bands</a><a href="#validation">Validation</a><a href="#limitations">Limitations</a><a href="#data">Data</a>
      </nav>

      <div className="prose">
        <h2 id="item-bank">The 200-item bank</h2>
        <p>The bank contains {ITEM_BANK.length} four-option questions written for workplace decisions rather than software engineering recall. It is balanced at 50 items per dimension. Within every dimension, ten items sit at each of five provisional difficulty levels.</p>
      </div>
      <div className="table-wrap wide narrow">
        <table><thead><tr><th>Dimension</th><th className="num">Bank items</th><th className="num">Delivered</th><th className="num">Points</th></tr></thead><tbody>
          {DIMENSIONS.map((dimension) => <tr key={dimension.key}><td><strong>{dimension.name}</strong><br/><span className="small muted">{dimension.blurb}</span></td><td className="num">{ITEM_BANK.filter((item) => item.section === dimension.key).length}</td><td className="num">{ADAPTIVE_ITEMS_PER_DIMENSION}</td><td className="num">{DIMENSION_MAX}</td></tr>)}
          <tr><td><strong>Total</strong></td><td className="num"><strong>{ITEM_BANK.length}</strong></td><td className="num"><strong>{ADAPTIVE_ITEM_COUNT}</strong></td><td className="num"><strong>{TOTAL_MAX}</strong></td></tr>
        </tbody></table>
      </div>

      <div className="prose">
        <h2 id="adaptive">How the adaptive path is selected</h2>
        <p>Each dimension starts at difficulty level 3 of 5. After a correct answer, the target difficulty for the next question in that dimension rises by one. After an incorrect answer, it falls by one. The target stays within levels 1 to 5. Dimensions rotate evenly, so every employee receives eight questions in each dimension.</p>
        <p>When several unused questions match the target, the browser chooses one from that level using a session seed. Two employees can therefore receive different questions while following the same difficulty path. Answers become final on submission because changing one would change the later route.</p>
        <div className="card"><p style={{ margin: 0 }}><strong>Example:</strong> an employee answers a level-3 risk question correctly. The next risk question is selected at level 4. If that answer is incorrect, the following risk question returns to level 3.</p></div>

        <h2 id="scoring">How a score is computed</h2>
        <p>Correct answers earn more credit at higher provisional difficulty levels. An incorrect answer earns no item credit, but it changes the later path toward questions better matched to the employee's demonstrated level. Eight item credits are normalized to a score out of {DIMENSION_MAX} for each dimension; four dimensions produce the total out of {TOTAL_MAX}.</p>
        <p>Difficulty weights are intentionally modest so one hard answer cannot dominate the profile. They are design estimates, not parameters learned from candidate data. Once a large pilot sample exists, the appropriate replacement is a calibrated item-response model based on observed difficulty and discrimination.</p>

        <h2 id="bands">Level bands</h2>
        <p>The bands remain developmental descriptions with soft edges. They are not certifications or externally anchored standards.</p>
      </div>
      <div className="table-wrap wide narrow"><table><thead><tr><th>Band</th><th className="num">Range</th><th>Reading</th></tr></thead><tbody>{BANDS.map((band) => <tr key={band.name}><td><strong>{band.name}</strong></td><td className="num">{band.min}–{band.max}</td><td>{band.note}</td></tr>)}</tbody></table></div>

      <div className="prose">
        <h2 id="validation">What validation comes next</h2>
        <h3>1. Independent content review</h3><p>Subject-matter experts should judge whether every item belongs in its assigned dimension, has one defensible best answer, and has the intended difficulty. Weak or double-keyed questions must be rewritten or removed.</p>
        <h3>2. Pilot calibration</h3><p>A broad workplace sample should establish observed item difficulty, discrimination, distractor performance, reliability, and differential item functioning. The provisional 1–5 labels should then be replaced with empirical parameters.</p>
        <h3>3. Adaptive simulation</h3><p>Completed response patterns should be replayed against alternative routing and stopping rules. This checks whether a 32-item path estimates the four dimensions consistently and whether certain routes overexpose particular content.</p>
        <h3>4. External validation</h3><p>Scores should be compared with independently assessed work samples and defined workplace outcomes. Until then, the assessment supports learning conversations, not claims about job performance.</p>

        <h2 id="limitations">Known limitations</h2>
        <ul className="clean">
          <li><strong>Provisional difficulty.</strong> Levels were assigned by content judgment and have not been estimated from response data.</li>
          <li><strong>Recognition, not production.</strong> Multiple choice is easier than producing and defending a recommendation unaided.</li>
          <li><strong>No proctoring.</strong> There is no identity check, timer, or browser lockdown.</li>
          <li><strong>Content exposure.</strong> A larger bank reduces repetition but does not prevent employees from sharing items.</li>
          <li><strong>Scores are not personnel ratings.</strong> The instrument is for learning and development, not hiring, promotion, pay, or performance management.</li>
        </ul>

        <h2 id="data">Data handling</h2>
        <p>The assessment runs in the browser. The seed, selected item IDs, answers, and result remain in that tab's session storage. There is no backend, account, analytics, or company dashboard in this prototype, so no employer or administrator can see an individual result.</p>

        <h2>Provenance</h2>
        <p>The framework and item bank were written by Ankit Mishra. The bank is represented as typed source data and tested automatically for 200 unique IDs, equal dimension coverage, and minimum coverage at every difficulty level.</p>
      </div>

      <div className="card dark"><p className="eyebrow">The honest summary</p><p className="muted" style={{ marginBottom: 0 }}>This is a working adaptive diagnostic with a materially broader bank and transparent routing. It is GRE/GMAT-like in the narrow sense that later difficulty responds to prior performance. It is not equivalent in calibration, security, reliability evidence, or stakes, and should not be described that way until the validation program is complete.</p></div>
      <div className="q-nav"><Link href="/assessment" className="btn">Take the assessment</Link><Link href="/" className="btn ghost">Back to overview</Link></div>
    </main>
  );
}
