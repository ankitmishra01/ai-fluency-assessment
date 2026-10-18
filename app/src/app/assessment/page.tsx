import type { Metadata } from "next";
import { Runner } from "./runner";

export const metadata: Metadata = {
  title: "Assessment · AI Fluency Assessment",
  description:
    "Pick a form and answer the items one screen at a time. Nothing is marked right or wrong mid-test.",
};

export default function AssessmentPage() {
  return (
    <main>
      <div className="pagehead">
        <span>ASSESSMENT</span>
      </div>
      <Runner />
    </main>
  );
}
