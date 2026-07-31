import PageHero from "@/components/ui/PageHero";
import Gallery from "@/components/ui/Gallery";
import { GALLERY } from "@/lib/data";

export const metadata = { title: "Médiathèque — GPI" };

export default function MediathequePage() {
  return (
    <>
      <PageHero
        crumb="Médiathèque"
        eyebrow="Galerie"
        title="Nos moments forts en images"
        subtitle="Salons étudiants, remises d'attestations, événements partenaires : revivez les temps forts de la communauté GPI."
      />
      <section className="py-24">
        <div className="container-gpi">
          <Gallery images={GALLERY} />
        </div>
      </section>
    </>
  );
}
