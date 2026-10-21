/** Navigation model for the left rail, the top-bar breadcrumb and the keyboard shortcuts. Pure, so routes and keys can be tested. */
export type Icon = "overview" | "assessment" | "sample" | "results" | "plan" | "methodology";
export type NavItem = { href: string; label: string; key: string; icon: Icon };
export type NavGroup = { name: string; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  { name: "Assess", items: [
    { href: "/", label: "Overview", key: "O", icon: "overview" },
    { href: "/assessment", label: "Assessment", key: "A", icon: "assessment" },
    { href: "/sample", label: "Sample profile", key: "S", icon: "sample" },
  ] },
  { name: "Your report", items: [
    { href: "/results", label: "Results", key: "R", icon: "results" },
    { href: "/learning-plan", label: "Learning plan", key: "L", icon: "plan" },
  ] },
  { name: "About", items: [
    { href: "/methodology", label: "Methodology", key: "M", icon: "methodology" },
  ] },
];
export const NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.name })));

const norm = (p: string) => (p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p) || "/";

/** The nav item a path belongs to: exact match for the overview, otherwise the longest matching prefix. */
export function activeItem(path: string) {
  const p = norm(path);
  if (p === "/") return NAV_ITEMS[0];
  return NAV_ITEMS.filter((i) => i.href !== "/" && (p === i.href || p.startsWith(`${i.href}/`)))
    .sort((a, b) => b.href.length - a.href.length)[0] ?? NAV_ITEMS[0];
}

/** Breadcrumb for the top bar: group / page. */
export const breadcrumb = (path: string) => { const it = activeItem(path); return [it.group, it.label]; };

/** The question screen keeps the rail but collapses it to icons, and single-letter shortcuts are off there. */
export const isFocusRoute = (path: string) => activeItem(path).href === "/assessment";
