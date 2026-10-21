import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("methodology navigation sticks below the top bar with a numeric offset", () => {
  // The top bar is sticky at every width now, so the section nav sits under it.
  assert.match(css, /\.methodology-nav\s*\{[^}]*top:\s*var\(--header-h\)/);
  assert.match(css, /--header-h:\s*\d+px/);
  assert.doesNotMatch(css, /--header-h:\s*auto/);
});

test("mobile assessment actions remain sticky within the question card", () => {
  assert.match(
    css,
    /@media \(max-width: 900px\)[\s\S]*?\.q-card \.q-nav\s*\{[^}]*position:\s*sticky[^}]*bottom:/,
  );
});
