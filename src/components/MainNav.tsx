"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/camps", label: "Camps & Events" },
  { href: "/parties", label: "Art Parties" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MainNav({ current }: { current?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.classList.add("menu-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="menu-btn"
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="menu-icon" aria-hidden="true"><span /><span /><span /></span>
        {open ? "Close" : "Menu"}
      </button>
      <nav id="main-nav" className="nav" data-open={open} aria-label="Main">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={current === l.href ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
        <Link href="/camps" className="btn nav-cta" onClick={() => setOpen(false)}>
          Register for a camp
        </Link>
      </nav>
    </>
  );
}
