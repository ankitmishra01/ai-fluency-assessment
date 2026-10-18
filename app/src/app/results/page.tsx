import type { Metadata } from "next";
import { Report } from "./report";

export const metadata: Metadata = {
  title: "Result · AI Fluency Assessment",
  description:
    "Your evidence-based AI fluency profile, four-dimension breakdown, and development priorities.",
};

export default function ResultsPage() {
  return (
    <main>
      <div className="pagehead">
        <span>RESULT</span>
      </div>
      <h1>Your AI fluency profile</h1>
      <p className="lede">
        This prototype scores the answers held in your browser tab. In a company
        program, this profile would be shared with your employer to plan learning
        and development.
      </p>
      <Report />
    </main>
  );
}
