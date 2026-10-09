import PageHero from "@/components/ui/PageHero";
import OffersBoard from "@/components/ui/OffersBoard";
import CTA from "@/components/ui/CTA";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Stages — GPI" };

export default function StagesPage() {
  return (
    <>
      <PageHero
        crumb="Stages"
        eyebrow="Recherche"
        title="Recherche de stages"
        subtitle="Trouvez le stage qui correspond à votre parcours : recherchez par métier, par ville et par domaine auprès de nos entreprises partenaires en France."
      />
      <section className="pb-24 pt-0">
        <div className="container-gpi">
          <OffersBoard kind="stages" />
        </div>
      </section>
      <section className="py-16" style={{ background: "var(--paper-2)" }}>
        <div className="container-gpi">
          <Reveal>
            <CTA
              title="Vous êtes une entreprise ?"
              text="Publiez vos offres de stage et accédez à notre vivier d'étudiants qualifiés."
              label="Devenir partenaire"
              href="/contact"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
