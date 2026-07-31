import PageHero from "@/components/ui/PageHero";
import Dashboard from "@/components/ui/Dashboard";

export const metadata = { title: "Espace étudiant — GPI" };

export default function EspacePage() {
  return (
    <>
      <PageHero crumb="Espace étudiant" eyebrow="Tableau de bord" title="Votre espace connecté" />
      <section className="py-24">
        <div className="container-gpi">
          <Dashboard />
        </div>
      </section>
    </>
  );
}
