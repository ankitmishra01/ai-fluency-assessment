import type { Metadata } from "next";
import { Runner } from "./runner";

export const metadata: Metadata = {
  title: "Assessment · AI Fluency Assessment",
  description:
    "Take a 32-question adaptive assessment selected from a 200-item workplace AI fluency bank.",
};

export default function AssessmentPage() {
  return (
    <main id="main-content">
      <div className="pagehead">
        <span>ASSESSMENT</span>
      </div>
      <Runner />
    </main>
  );
}
