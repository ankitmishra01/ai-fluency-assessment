"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Overview" },
  { href: "/assessment", label: "Assessment" },
  { href: "/methodology", label: "Methodology" },
];

export function Header() {
  const path = usePathname();
  return (
    <header className="top">
      <div className="top-inner">
        <Link href="/" className="logo">
          <span className="logo-mark" aria-hidden="true">AM</span>
          <span className="logo-copy">
            <strong>AI Fluency Assessment</strong>
            <span>Methodology by Ankit Mishra</span>
          </span>
        </Link>
        <nav aria-label="Primary">
          {TABS.map((t) => {
            const active =
              t.href === "/" ? path === "/" : path.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={active ? "active" : undefined}
                aria-current={active ? "page" : undefined}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
        <span className="demo">Pilot assessment</span>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="foot-inner">
        <p>
          Designed and authored by Ankit Mishra for workplace learning and
          development. Pilot item bank; not a validated instrument.
        </p>
        <div className="foot-links">
          <Link href="/">Overview</Link>
          <Link href="/assessment">Assessment</Link>
          <Link href="/methodology">Methodology</Link>
        </div>
      </div>
    </footer>
  );
}
