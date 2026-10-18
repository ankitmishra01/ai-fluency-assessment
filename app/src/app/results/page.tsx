import type { Metadata } from "next";
import { Report } from "./report";

export const metadata: Metadata = {
  title: "Result · AI Fluency Assessment",
  description:
    "Your score out of 800, the four-dimension breakdown, and a per-item review. Scored in your browser; nothing is sent anywhere.",
};

export default function ResultsPage() {
  return (
    <main>
      <div className="pagehead">
        <span>RESULT</span>
      </div>
      <h1>Your AI fluency profile</h1>
      <p className="lede">
        Scored on your own device from the answers held in this browser tab.
        Nothing was uploaded, and no copy of this result exists anywhere else.
      </p>
      <Report />
    </main>
  );
}
