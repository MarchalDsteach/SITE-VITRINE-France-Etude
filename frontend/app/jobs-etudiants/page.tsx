import PageHero from "@/components/ui/PageHero";
import OffersBoard from "@/components/ui/OffersBoard";
import CTA from "@/components/ui/CTA";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Jobs étudiants — GPI" };

export default function JobsEtudiantsPage() {
  return (
    <>
      <PageHero
        crumb="Jobs étudiants"
        eyebrow="Recherche"
        title="Jobs étudiants"
        subtitle="Trouvez un job compatible avec votre emploi du temps : recherchez par métier, par ville et par type de contrat auprès de nos entreprises partenaires en France."
      />
      <section className="pb-24 pt-0">
        <div className="container-gpi">
          <OffersBoard kind="jobs" />
        </div>
      </section>
      <section className="py-16" style={{ background: "var(--paper-2)" }}>
        <div className="container-gpi">
          <Reveal>
            <CTA
              title="Vous êtes une entreprise ?"
              text="Publiez vos offres de jobs étudiants et accédez à notre vivier d'étudiants motivés."
              label="Devenir partenaire"
              href="/contact"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
