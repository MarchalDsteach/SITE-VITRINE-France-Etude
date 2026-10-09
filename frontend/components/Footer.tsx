"use client";

import Link from "next/link";
import Logo from "./Logo";
import { SERVICES } from "@/lib/data";
import { showToast } from "@/lib/toast";

export default function Footer() {
  function onSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    showToast("L’inscription à la newsletter n’est pas encore disponible.");
  }

  return (
    <footer className="mt-16 bg-ink pb-6 pt-16 text-white/70">
      <div className="container-gpi">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-11 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mb-4 mt-3.5 max-w-[280px] text-[13.5px]">
              Groupe Projet International — plateforme d&apos;accompagnement académique et de mobilité internationale pour les étudiants africains.
            </p>
            <div className="flex gap-4">
              {[
                { s: "f", name: "Facebook" },
                { s: "in", name: "LinkedIn" },
                { s: "ig", name: "Instagram" },
                { s: "tt", name: "TikTok" },
              ].map(({ s, name }) => (
                <Link
                  key={s}
                  href="/contact"
                  aria-label={name}
                  title={name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[13px] transition-colors hover:bg-white/10"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h5 className="mb-4 font-mono text-[11.5px] uppercase tracking-wide" style={{ color: "var(--red-2)" }}>Services</h5>
            {Object.values(SERVICES).map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="mb-3.5 block text-[13.5px] text-white/60 transition-colors hover:text-white">
                {s.name.split(" (")[0]}
              </Link>
            ))}
          </div>
          <div>
            <h5 className="mb-4 font-mono text-[11.5px] uppercase tracking-wide" style={{ color: "var(--red-2)" }}>Ressources</h5>
            <Link href="/a-propos" className="mb-3.5 block text-[13.5px] text-white/60 transition-colors hover:text-white">À propos</Link>
            <Link href="/alternances" className="mb-3.5 block text-[13.5px] text-white/60 transition-colors hover:text-white">Alternances</Link>
            <Link href="/stages" className="mb-3.5 block text-[13.5px] text-white/60 transition-colors hover:text-white">Stages</Link>
            <Link href="/jobs-etudiants" className="mb-3.5 block text-[13.5px] text-white/60 transition-colors hover:text-white">Jobs étudiants</Link>
            <Link href="/mediatheque" className="mb-3.5 block text-[13.5px] text-white/60 transition-colors hover:text-white">Médiathèque</Link>
            <Link href="/temoignages" className="mb-3.5 block text-[13.5px] text-white/60 transition-colors hover:text-white">Témoignages</Link>
          </div>
          <div>
            <h5 className="mb-4 font-mono text-[11.5px] uppercase tracking-wide" style={{ color: "var(--red-2)" }}>Newsletter</h5>
            <p className="mb-3 text-[13.5px]">Recevez nos conseils et actualités.</p>
            <form onSubmit={onSubscribe} className="flex gap-3">
              <input
                type="email"
                required
                placeholder="votre@email.com"
                className="flex-1 rounded-lg border border-white/20 bg-white/[0.06] px-3 py-2.5 text-[13px] text-white placeholder:text-white/40"
              />
              <button type="submit" className="btn btn-primary btn-sm">OK</button>
            </form>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-6 text-[12.5px] text-white/45">
          <span>© 2026 GPI — Groupe Projet International. Tous droits réservés.</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/legal/mentions" className="hover:text-white">Mentions légales</Link>
            <Link href="/legal/cgv" className="hover:text-white">CGV</Link>
            <Link href="/legal/confidentialite" className="hover:text-white">Confidentialité</Link>
            <Link href="/gestion" className="hover:text-white">Administration</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
