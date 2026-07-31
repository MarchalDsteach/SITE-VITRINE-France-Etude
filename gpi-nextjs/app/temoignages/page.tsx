import PageHero from "@/components/ui/PageHero";
import CTA from "@/components/ui/CTA";
import { TESTIMONIALS } from "@/lib/data";

export const metadata = { title: "Témoignages — GPI" };

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function TemoignagesPage() {
  return (
    <>
      <PageHero crumb="Témoignages" eyebrow="Avis" title="Ce qu'ils disent de nous" subtitle="5.0 · avis vérifiés de nos étudiants accompagnés." />
      <section className="py-24">
        <div className="container-gpi grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.nom} className="card">
              <div className="mb-2.5 text-sm" style={{ color: "var(--red)" }}>{"★".repeat(t.note)}</div>
              <p className="mb-4 text-[14.5px]" style={{ color: "var(--slate)" }}>&quot;{t.texte}&quot;</p>
              <div className="flex items-center gap-2.5">
                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-ink font-display text-sm font-bold" style={{ color: "var(--red-2)" }}>
                  {initials(t.nom)}
                </div>
                <div>
                  <b className="block text-[13.5px]">{t.nom}</b>
                  <span className="text-[11.5px]" style={{ color: "var(--slate-light)" }}>{t.role} · {t.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="py-16" style={{ background: "var(--paper-2)" }}>
        <div className="container-gpi">
          <CTA title="Vous aussi, vivez l'expérience GPI" text="Rejoignez plus de 1000 étudiants déjà accompagnés." label="Créer mon compte" href="/espace" />
        </div>
      </section>
    </>
  );
}
