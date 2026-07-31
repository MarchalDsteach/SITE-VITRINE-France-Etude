import PageHero from "@/components/ui/PageHero";
import ListingsSearch from "@/components/ui/ListingsSearch";
import CTA from "@/components/ui/CTA";
import { ALTERNANCES } from "@/lib/data";

export const metadata = { title: "Alternances — GPI" };

export default function AlternancesPage() {
  return (
    <>
      <PageHero
        crumb="Alternances"
        eyebrow="Recherche"
        title="Recherche d'alternances"
        subtitle="Trouvez l'alternance qui correspond à votre formation : recherchez par métier, par ville et par type de contrat auprès de nos écoles et entreprises partenaires en France."
      />
      <section className="pb-24 pt-0">
        <div className="container-gpi">
          <ListingsSearch data={ALTERNANCES} kind="alternances" />
        </div>
      </section>
      <section className="py-16" style={{ background: "var(--paper-2)" }}>
        <div className="container-gpi">
          <CTA
            title="Vous êtes une entreprise ?"
            text="Publiez vos offres d'alternance et accédez à notre vivier d'étudiants qualifiés."
            label="Devenir partenaire"
            href="/contact"
          />
        </div>
      </section>
    </>
  );
}
