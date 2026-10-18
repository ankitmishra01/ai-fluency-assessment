import type { Metadata } from "next";
import { LearningPlanReport } from "./plan";

export const metadata: Metadata = {
  title: "Learning plan · AI Fluency Assessment",
  description: "A printable six-week learning plan based on your AI fluency dimension scores.",
};

export default function LearningPlanPage() {
  return <main className="plan-page"><LearningPlanReport /></main>;
}
