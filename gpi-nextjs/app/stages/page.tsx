import PageHero from "@/components/ui/PageHero";
import ListingsSearch from "@/components/ui/ListingsSearch";
import CTA from "@/components/ui/CTA";
import { STAGES } from "@/lib/data";

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
          <ListingsSearch data={STAGES} kind="stages" />
        </div>
      </section>
      <section className="py-16" style={{ background: "var(--paper-2)" }}>
        <div className="container-gpi">
          <CTA
            title="Vous êtes une entreprise ?"
            text="Publiez vos offres de stage et accédez à notre vivier d'étudiants qualifiés."
            label="Devenir partenaire"
            href="/contact"
          />
        </div>
      </section>
    </>
  );
}
