"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Ic } from "@/components/Icons";
import { NAV_GROUPS, NAV_ITEMS, activeItem, breadcrumb, isFocusRoute } from "@/lib/nav";

/**
 * App frame: ink left rail (full 232px from 1100px, 64px icons from 768px, a
 * drawer below 768px), a slim top bar with the breadcrumb, then the page.
 * The assessment runs in focus mode: the rail stays, collapsed to icons, so the
 * question card keeps its width.
 */
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname() ?? "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const act = activeItem(path);
  const crumbs = breadcrumb(path);
  const focus = isFocusRoute(path);

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (focus) return; // never navigate away from a question on a stray key press
      const t = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || (t && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(t.tagName)))) return;
      const hit = NAV_ITEMS.find((n) => n.key === e.key.toUpperCase());
      if (hit) { e.preventDefault(); router.push(hit.href); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, focus]);

  return (
    <div className={`app${open ? " rail-open" : ""}${focus ? " focus" : ""}`}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <aside className="rail" id="rail" aria-label="Site navigation">
        <div className="rail__brand">
          <Link href="/" className="rail__mark" aria-label="AI Fluency Assessment, overview">AM</Link>
          <div className="rail__brandtext">
            <div className="rail__name">AI Fluency Assessment</div>
            <div className="rail__sub">Methodology by Ankit Mishra</div>
          </div>
          <button type="button" className="rail__expand" onClick={() => setOpen((o) => !o)} aria-label={open ? "Collapse navigation" : "Expand navigation"} aria-expanded={open} aria-controls="rail"><Ic name="expand" /></button>
        </div>
        <nav aria-label="Primary" className="rail__navwrap">
          {NAV_GROUPS.map((g) => (
            <div key={g.name} className="rail__group">
              <div className="rail__hdr">{g.name}</div>
              {g.items.map((it) => {
                const on = act.href === it.href;
                return (
                  <Link key={it.href} href={it.href} className={`rail__item${on ? " active" : ""}`} aria-current={on ? "page" : undefined} data-label={it.label} title={focus ? it.label : `${it.label} (${it.key})`}>
                    <Ic name={it.icon} /><span className="rail__lbl rail__text">{it.label}</span>
                    {!focus && <span className="rail__lbl kbd" aria-hidden="true">{it.key}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="rail__spacer" />
        <div className="rail__foot rail__lbl">
          <ul className="rail__conn" aria-label="How this prototype runs">
            <li><i className="dot ok" />Runs in your browser</li>
            <li><i className="dot ok" />Progress kept in this tab</li>
            <li><i className="dot sim" />Pilot item bank · not validated</li>
          </ul>
          <div className="rail__note">Prototype · Oct 2026</div>
        </div>
      </aside>
      <div className="rail-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      <div className="main-col">
        <header className="topbar">
          <button type="button" className="topbar__menu" onClick={() => setOpen(true)} aria-label="Open navigation" aria-expanded={open} aria-controls="rail"><Ic name="menu" /></button>
          <Link href="/" className="topbar__brand" aria-label="AI Fluency Assessment, overview">AI Fluency Assessment</Link>
          <nav className="crumbs" aria-label="Breadcrumb"><ol>{crumbs.map((c, i) => <li key={i} aria-current={i === crumbs.length - 1 ? "page" : undefined}>{c}</li>)}</ol></nav>
          <span className="demo">Pilot assessment</span>
        </header>
        {children}
        <Footer />
      </div>
    </div>
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
      </div>
    </footer>
  );
}
