import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("mobile methodology navigation keeps a numeric sticky offset", () => {
  assert.match(
    css,
    /@media \(max-width: 900px\)[\s\S]*?\.methodology-nav\s*\{[^}]*top:\s*0/,
  );
});

test("mobile assessment actions remain sticky within the question card", () => {
  assert.match(
    css,
    /@media \(max-width: 900px\)[\s\S]*?\.q-card \.q-nav\s*\{[^}]*position:\s*sticky[^}]*bottom:/,
  );
});
