/** 16px inline-SVG icons for the rail, one stroke style (1.5px, round joins). Decorative: the label carries the meaning. */
import type { Icon } from "@/lib/nav";
const P: Record<Icon | "menu" | "expand", string> = {
  overview: "M2 7.2 8 2.5l6 4.7V14H2zM6.3 14V9.8h3.4V14",
  assessment: "M3 2.5h10v11H3zM5.5 6l1.2 1.2L9 5M5.5 10.5h5",
  sample: "M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8zM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  results: "M2 13.5h12M3.5 13.5V9M6.5 13.5V5.5M9.5 13.5V7.5M12.5 13.5V3",
  plan: "M2 3.5h12v10.5H2zM2 6.5h12M5 1.5v3M11 1.5v3M4.5 9h2M9.5 9h2M4.5 11.5h2",
  methodology: "M8 14.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM8 7.3v4M8 4.8v.2",
  menu: "M2 4h12M2 8h12M2 12h12",
  expand: "M6 3.5l4.5 4.5L6 12.5",
};
export function Ic({ name, size = 16 }: { name: keyof typeof P; size?: number }) {
  return <svg className="ic" width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={P[name]} /></svg>;
}
