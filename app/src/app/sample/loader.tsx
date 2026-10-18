"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { buildSampleRun } from "@/lib/sample-run";
import { clearProgress, saveRun } from "@/lib/storage";

/**
 * Seeds the demonstration run into this tab and hands off to the real results
 * page, so the sample exercises exactly the same rendering, scoring and
 * learning-plan code a candidate would see. Nothing here is a mock-up.
 */
export function SampleLoader() {
  const router = useRouter();

  useEffect(() => {
    saveRun(buildSampleRun());
    clearProgress();
    router.replace("/results");
  }, [router]);

  return <p className="muted">Building the sample profile…</p>;
}
