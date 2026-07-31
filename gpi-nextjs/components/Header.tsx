"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import { SERVICES } from "@/lib/data";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/services", label: "Services", dropdown: true },
  { href: "/alternances", label: "Alternances" },
  { href: "/stages", label: "Stages" },
  { href: "/contact", label: "Contact" },
];

const MOBILE_EXTRA = [
  { href: "/mediatheque", label: "Médiathèque" },
  { href: "/temoignages", label: "Témoignages" },
  { href: "/espace", label: "Espace étudiant" },
];

function ChevronDown() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="mt-px transition-transform duration-200 group-hover:rotate-180">
      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-[200] border-b border-white/[0.08] bg-[rgba(15,27,51,0.94)] backdrop-blur-md">
      <div className="container-gpi flex h-[72px] items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5 text-paper">
          <Logo size={36} />
          <span className="leading-tight">
            <span className="block font-display text-[18px] font-bold text-paper">GPI</span>
            <span
              className="hidden whitespace-nowrap font-mono text-[9px] tracking-[0.1em] uppercase sm:block"
              style={{ color: "var(--red-2)" }}
            >
              Groupe Projet International
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex">
          {NAV.map((item) =>
            item.dropdown ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors ${
                    isActive(item.href) ? "bg-white/[0.07] text-paper" : "text-white/75 hover:bg-white/[0.07] hover:text-paper"
                  }`}
                >
                  {item.label}
                  <ChevronDown />
                </Link>
                <div className="invisible absolute left-1/2 top-[calc(100%+8px)] w-[280px] -translate-x-1/2 translate-y-1.5 rounded-xl border border-white/10 bg-ink2 p-2 opacity-0 shadow-gpi transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {Object.values(SERVICES).map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5 text-white/85 hover:bg-white/[0.07] hover:text-white"
                    >
                      <small className="font-mono text-[10px] uppercase tracking-wide" style={{ color: "var(--red-2)" }}>
                        {s.duration}
                      </small>
                      <span className="text-[13.5px]">{s.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors ${
                  isActive(item.href) ? "bg-white/[0.07] text-paper" : "text-white/75 hover:bg-white/[0.07] hover:text-paper"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/espace" className="hidden whitespace-nowrap text-[13.5px] font-medium text-white/75 hover:text-paper xl:inline-block">
            Se connecter
          </Link>
          <Link href="/espace" className="btn btn-primary btn-sm hidden whitespace-nowrap xl:inline-flex">
            S&apos;inscrire
          </Link>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-paper xl:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2.5 5.5H17.5M2.5 10H17.5M2.5 14.5H17.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="max-h-[75vh] overflow-y-auto bg-ink2 px-6 pb-4 pt-1 xl:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block border-b border-white/[0.08] py-3.5 text-[15px] ${isActive(item.href) ? "font-semibold text-white" : "text-white/80"}`}
            >
              {item.label}
            </Link>
          ))}
          <details className="border-b border-white/[0.08] py-1">
            <summary className="cursor-pointer list-none py-2.5 text-[13px] font-mono uppercase tracking-wide text-white/50">
              Nos services ↓
            </summary>
            <div className="pb-2 pl-1">
              {Object.values(SERVICES).map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-[14px] text-white/75"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </details>
          <div className="mt-1">
            {MOBILE_EXTRA.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block border-b border-white/[0.08] py-3.5 text-[15px] text-white/80"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex gap-2.5">
            <Link href="/espace" onClick={() => setMobileOpen(false)} className="btn btn-ghost-light btn-sm flex-1 justify-center">
              Se connecter
            </Link>
            <Link href="/espace" onClick={() => setMobileOpen(false)} className="btn btn-primary btn-sm flex-1 justify-center">
              S&apos;inscrire
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
