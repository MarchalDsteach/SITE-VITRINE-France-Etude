import Link from "next/link";
import ServiceCard from "@/components/ui/ServiceCard";
import FeaturedServiceCard from "@/components/ui/FeaturedServiceCard";
import StatsStrip from "@/components/ui/StatsStrip";
import CTA from "@/components/ui/CTA";
import Destinations from "@/components/ui/Destinations";
import VideoSection from "@/components/ui/VideoSection";
import TickerStrip from "@/components/ui/TickerStrip";
import StudentWall from "@/components/ui/StudentWall";
import ImpactBanner from "@/components/ui/ImpactBanner";
import Reveal from "@/components/Reveal";
import HeroVisual from "@/components/ui/HeroVisual";
import { SERVICES, GALLERY } from "@/lib/data";

export default function HomePage() {
  const services = Object.values(SERVICES).slice(0, 3);
  const featured = services[0];
  const rest = services.slice(1);

  return (
    <>
      <section className="relative overflow-hidden py-20 pb-16">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/image/hero.student.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(10,18,36,0.88) 0%, rgba(15,27,51,0.82) 55%, rgba(15,27,51,0.95) 100%)" }}
        />

        <HeroVisual />

        <div className="container-gpi relative mx-auto max-w-[820px] text-center">
          <span className="kicker justify-center" style={{ color: "var(--red-2)" }}>Plateforme n°1 des étudiants internationaux</span>
          <h1 className="my-4.5 text-[clamp(36px,5.4vw,58px)] leading-[1.06] text-white">
            Réussissez votre projet <span style={{ background: "linear-gradient(120deg,var(--red-2),var(--red))", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>d&apos;études</span> à l&apos;étranger
          </h1>
          <p className="mx-auto mb-8 mt-6 max-w-[560px] text-[17px] text-white/70">
            Notre équipe d&apos;experts vous accompagne à chaque étape de votre parcours, de la préparation de votre dossier à votre intégration en France et partout ailleurs, pour faire de votre rêve une réalité.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <Link href="/contact" className="btn btn-primary">Demander un entretien</Link>
            <Link href="#services" className="btn btn-glass">Découvrir nos services</Link>
          </div>
        </div>
        <div className="container-gpi relative">
          <StatsStrip />
        </div>
      </section>

      <TickerStrip />


      <section className="py-24">
        <div className="container-gpi">
          <Reveal>
            <div className="mb-10 max-w-[620px] text-center mx-auto">
              <span className="kicker justify-center">Destinations</span>
              <h2 className="mt-3 text-[clamp(26px,3.4vw,38px)]">Nos principales destinations</h2>
            </div>
          </Reveal>
          <Destinations />
        </div>
      </section>

      <section id="services" className="scroll-mt-24 py-24">
        <div className="container-gpi">
          <Reveal>
            <div className="mb-2 max-w-[620px]">
              <span className="kicker">Nos services</span>
              <h2 className="mt-3 text-[clamp(26px,3.4vw,38px)]">Tout ce dont vous avez besoin pour réussir</h2>
              <p className="mt-3 text-[15.5px]" style={{ color: "var(--slate)" }}>
                Des solutions complètes et professionnelles pour chaque étape de votre projet d&apos;études à l&apos;étranger.
              </p>
            </div>
          </Reveal>
          <div className="mt-11 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal>
              <FeaturedServiceCard service={featured} />
            </Reveal>
            {rest.map((s, i) => (
              <Reveal key={s.slug} delay={(i + 1) * 90}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
          <div className="mt-7 mb-8" style={{ textAlign: "center" }}>
            <Link href="/services" className="btn btn-outline">Voir tous nos services</Link>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: "var(--paper-2)" }}>
        <div className="container-gpi grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <span className="kicker">Alternances, stages &amp; jobs étudiants</span>
            <h2 className="mt-3 text-[30px]">Trouvez votre alternance, votre stage ou votre job étudiant en France</h2>
            <p className="mt-3.5" style={{ color: "var(--slate)" }}>
              Parcourez des offres vérifiées auprès de nos écoles partenaires, filtrez par métier, ville et type de contrat, et postulez en toute confiance.
            </p>
            <div className="mb-8 mt-6 flex flex-wrap gap-4">
              <Link href="/alternances" className="btn btn-ink">Voir les alternances</Link>
              <Link href="/stages" className="btn btn-outline">Voir les stages</Link>
              <Link href="/jobs-etudiants" className="btn btn-outline">Voir les jobs étudiants</Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="rotate-[-1.5deg]">
              <div className="card">
                <div className="mb-2 flex items-start justify-between">
                  <span className="kicker" style={{ color: "var(--ink)" }}>Offre du moment</span>
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
          </Reveal>
        </div>
      </section>

      <ImpactBanner />

      <section className="py-24">
        <div className="container-gpi">
          <Reveal>
            <div className="mb-10 max-w-[620px] text-center mx-auto">
              <span className="kicker justify-center">Communauté</span>
              <h2 className="mt-3 text-[clamp(26px,3.4vw,38px)]">Instant retro : Salon de l&apos;étudiant 2026</h2>
              <p className="mt-3 text-[15.5px]" style={{ color: "var(--slate)" }}>
                Retrouvez en images notre dernière édition du Salon de l&apos;Étudiant et du Lycéen.
              </p>
            </div>
          </Reveal>
          <StudentWall photos={GALLERY} />
        </div>
      </section>

      <section className="py-24" style={{ background: "var(--paper-2)" }}>
        <div className="container-gpi">
          <Reveal>
            <div className="mb-10 max-w-[620px] text-center mx-auto">
              <span className="kicker justify-center">Témoignages</span>
              <h2 className="mt-3 text-[clamp(26px,3.4vw,38px)]">Ils nous ont fait confiance</h2>
              <p className="mt-3 text-[15.5px]" style={{ color: "var(--slate)" }}>
                Découvrez les témoignages de nos étudiants qui ont bénéficié de notre accompagnement pour réussir leur projet d&apos;études à l&apos;étranger.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <VideoSection youtubeId="HY-_CeyhsBM" />
          </Reveal>
        </div>
      </section>

      <section className="py-24">
        <div className="container-gpi">
          <Reveal>
            <CTA
              title="Prêt à commencer votre aventure ?"
              text="Créez votre compte gratuitement et déposez votre premier dossier en quelques minutes."
              label="Créer mon compte"
              href="/register"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
