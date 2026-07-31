import Link from "next/link";
import ServiceCard from "@/components/ui/ServiceCard";
import StatsStrip from "@/components/ui/StatsStrip";
import BoardingPass from "@/components/ui/BoardingPass";
import Testimonials from "@/components/ui/Testimonials";
import Gallery from "@/components/ui/Gallery";
import CTA from "@/components/ui/CTA";
import { SERVICES, TESTIMONIALS, GALLERY, PARTNERS } from "@/lib/data";

export default function HomePage() {
  const services = Object.values(SERVICES).slice(0, 3);

  return (
    <>
      <section
        className="relative overflow-hidden py-20 pb-24"
        style={{ background: "linear-gradient(180deg, var(--ink) 0%, var(--ink-2) 100%)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(251,248,242,0.06) 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="container-gpi relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="eyebrow" style={{ color: "var(--red-2)" }}>Plateforme n°1 des étudiants internationaux</span>
            <h1 className="my-4.5 text-[clamp(34px,5vw,54px)] leading-[1.08] text-white">
              Votre aventure <em className="not-italic" style={{ color: "var(--red-2)" }}>académique</em> commence ici
            </h1>
            <p className="mb-8 max-w-[480px] text-[17px] text-white/72">
              GPI vous accompagne dans toutes vos démarches d&apos;études à l&apos;étranger : AVI, Campus France, logement, bourses, alternances et stages.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link href="/espace" className="btn btn-primary">Commencer maintenant</Link>
              <Link href="/services" className="btn btn-ghost-light">Découvrir nos services</Link>
            </div>
          </div>
          <BoardingPass />
        </div>
        <div className="container-gpi relative">
          <StatsStrip />
        </div>
      </section>

      <section className="py-24">
        <div className="container-gpi">
          <div className="mb-2 max-w-[620px]">
            <span className="eyebrow">Nos services</span>
            <h2 className="mt-3 text-[clamp(26px,3.4vw,38px)]">Tout ce dont vous avez besoin pour réussir</h2>
            <p className="mt-3 text-[15.5px]" style={{ color: "var(--slate)" }}>
              Des solutions complètes et professionnelles pour chaque étape de votre projet d&apos;études à l&apos;étranger.
            </p>
          </div>
          <div className="mt-11 grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => <ServiceCard key={s.slug} service={s} />)}
          </div>
          <div className="mt-7.5">
            <Link href="/services" className="btn btn-outline">Voir tous nos services</Link>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: "var(--paper-2)" }}>
        <div className="container-gpi grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Nouveau — Alternances &amp; Stages</span>
            <h2 className="mt-3 text-[30px]">Trouvez votre alternance ou votre stage en France</h2>
            <p className="mt-3.5" style={{ color: "var(--slate)" }}>
              Parcourez des offres vérifiées auprès de nos écoles partenaires, filtrez par domaine et par ville, et postulez en toute confiance.
            </p>
            <div className="mt-5.5 flex flex-wrap gap-3.5">
              <Link href="/alternances" className="btn btn-route">Voir les alternances</Link>
              <Link href="/stages" className="btn btn-outline">Voir les stages</Link>
            </div>
          </div>
          <div className="rotate-[-1.5deg]">
            <div className="card">
              <div className="mb-2 flex items-start justify-between">
                <span className="eyebrow" style={{ color: "var(--ink)" }}>Offre du moment</span>
                <span className="font-mono text-[11px]" style={{ color: "var(--slate-light)" }}>REF-AL-2291</span>
              </div>
              <h4 className="mb-1 text-[19px]">Alternance Développeur Web</h4>
              <p className="mb-3.5 text-[13px]" style={{ color: "var(--slate)" }}>NoSchool Digital · Bordeaux, France</p>
              <div className="grid grid-cols-2 gap-3.5">
                {[["Domaine", "Informatique"], ["Durée", "12-24 mois"], ["Rythme", "3j / 2j"], ["Limite", "15 août 2026"]].map(([l, v]) => (
                  <div key={l}>
                    <label className="mb-1 block font-mono text-[9.5px] uppercase" style={{ color: "var(--slate-light)" }}>{l}</label>
                    <span className="text-sm font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-gpi">
          <div className="mb-2 max-w-[620px]">
            <span className="eyebrow">Galerie</span>
            <h2 className="mt-3 text-[clamp(26px,3.4vw,38px)]">Instant retro : Salon de l&apos;étudiant 2026</h2>
            <p className="mt-3 text-[15.5px]" style={{ color: "var(--slate)" }}>
              Retrouvez en images notre dernière édition du Salon de l&apos;Étudiant et du Lycéen.
            </p>
          </div>
          <Gallery images={GALLERY} />
          <div className="mt-6.5">
            <Link href="/mediatheque" className="btn btn-outline">Voir toute la médiathèque</Link>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: "var(--paper-2)" }}>
        <div className="container-gpi">
          <div className="mb-2 max-w-[620px]">
            <span className="eyebrow">Témoignages</span>
            <h2 className="mt-3 text-[clamp(26px,3.4vw,38px)]">Ils ont fait confiance à GPI</h2>
          </div>
          <Testimonials items={TESTIMONIALS} />
        </div>
      </section>

      <section className="py-24">
        <div className="container-gpi">
          <CTA
            title="Prêt à commencer votre aventure ?"
            text="Créez votre compte gratuitement et déposez votre premier dossier en quelques minutes."
            label="Créer mon compte"
            href="/espace"
          />
        </div>
      </section>

      <section className="py-16">
        <div className="container-gpi">
          <div className="mb-2 max-w-[620px]">
            <span className="eyebrow">Partenaires</span>
            <h2 className="text-[26px]">Ils nous font confiance</h2>
          </div>
          <div className="mt-8 flex flex-wrap gap-3.5">
            {PARTNERS.map((p) => (
              <div key={p} className="flex-1 rounded-[10px] border bg-white px-5.5 py-4 text-center font-display font-semibold" style={{ borderColor: "var(--line)", color: "var(--slate)", minWidth: 150 }}>
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
