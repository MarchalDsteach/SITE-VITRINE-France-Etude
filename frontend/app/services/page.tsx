import PageHero from "@/components/ui/PageHero";
import ServiceCard from "@/components/ui/ServiceCard";
import CTA from "@/components/ui/CTA";
import Reveal from "@/components/Reveal";
import { SERVICES } from "@/lib/data";

export const metadata = { title: "Services — GPI" };

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumb="Services"
        eyebrow="Nos services"
        title="Des démarches simplifiées, à chaque étape"
        subtitle="Attestations, admission, financement : GPI centralise toutes les démarches nécessaires à votre projet d'études à l'étranger."
      />
      <section className="py-24">
        <div className="container-gpi grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(SERVICES).map((s, i) => (
            <Reveal key={s.slug} delay={i * 70}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
      </section>
      <section className="py-16" style={{ background: "var(--paper-2)" }}>
        <div className="container-gpi">
          <Reveal>
            <CTA title="Besoin d'un accompagnement sur mesure ?" text="Parlons de votre projet, nous vous orientons vers le bon service." label="Prendre contact" href="/contact" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
