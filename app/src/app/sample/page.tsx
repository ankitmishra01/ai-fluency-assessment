import type { Metadata } from "next";
import { SampleLoader } from "./loader";

export const metadata: Metadata = {
  title: "Sample profile · AI Fluency Assessment",
  description:
    "A worked example of the profile the adaptive assessment produces, without taking all thirty-two questions.",
};

export default function SamplePage() {
  return (
    <main id="main-content">
      <div className="pagehead"><span>SAMPLE</span></div>
      <h1>Loading a sample profile</h1>
      <p className="lede">
        Opening a worked example of the result and the six-week learning plan,
        so you can see the output without answering thirty-two questions.
      </p>
      <SampleLoader />
    </main>
  );
}
