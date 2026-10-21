import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { NAV_ITEMS, activeItem, breadcrumb, isFocusRoute } from "./nav.ts";

test("every rail item points at a real route", () => {
  for (const item of NAV_ITEMS) {
    const dir = item.href === "/" ? "" : item.href;
    assert.ok(existsSync(new URL(`../app${dir}/page.tsx`, import.meta.url)), `${item.href} has no page.tsx`);
  }
});

test("rail items have unique hrefs and shortcut keys", () => {
  assert.equal(new Set(NAV_ITEMS.map((i) => i.href)).size, NAV_ITEMS.length);
  assert.equal(new Set(NAV_ITEMS.map((i) => i.key)).size, NAV_ITEMS.length);
});

test("active item matches the route, with or without a trailing slash", () => {
  assert.equal(activeItem("/").href, "/");
  assert.equal(activeItem("/results").href, "/results");
  assert.equal(activeItem("/results/").href, "/results");
  assert.equal(activeItem("/learning-plan").href, "/learning-plan");
  assert.equal(activeItem("/methodology/").href, "/methodology");
  assert.equal(activeItem("/unknown").href, "/");
  assert.deepEqual(breadcrumb("/assessment"), ["Assess", "Assessment"]);
});

test("only the assessment runs in focus mode", () => {
  assert.equal(isFocusRoute("/assessment"), true);
  assert.equal(isFocusRoute("/assessment/"), true);
  assert.equal(isFocusRoute("/results"), false);
  assert.equal(isFocusRoute("/"), false);
});
