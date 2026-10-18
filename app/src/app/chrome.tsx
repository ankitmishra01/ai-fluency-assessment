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
          <strong>AI Fluency Assessment</strong>
          <span>Ankit Mishra</span>
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
        <span className="demo">Prototype</span>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="foot-inner">
        <p>
          Prototype built by Ankit Mishra. Pilot item bank, illustrative scoring
          bands. Not a validated instrument.
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
