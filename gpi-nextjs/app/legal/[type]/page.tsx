import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";

const LEGAL: Record<string, { title: string; content: string }> = {
  mentions: {
    title: "Mentions légales",
    content: `
      <h2>Éditeur du site</h2>
      <p>Le site GPI (Groupe Projet International) est un projet pédagogique développé par une équipe de 4 étudiants dans le cadre d'un travail collectif.</p>
      <h2>Hébergement</h2>
      <p>Ce site est destiné à être déployé sur une infrastructure de production (Vercel / Railway / VPS) définie par l'équipe Intégrations &amp; DevOps du projet.</p>
      <h2>Propriété intellectuelle</h2>
      <p>Les contenus, textes et éléments graphiques de ce site sont la propriété du Groupe Projet International, sauf mention contraire.</p>
    `,
  },
  cgv: {
    title: "Conditions Générales de Vente",
    content: `
      <h2>Objet</h2>
      <p>Les présentes CGV encadrent les prestations d'accompagnement administratif proposées par GPI aux étudiants (AVI, ADL, Campus France, Bourses).</p>
      <h2>Tarifs &amp; paiement</h2>
      <p>Les tarifs sont indiqués sur chaque page service. Le paiement est exigible à la validation de la demande.</p>
      <h2>Délais</h2>
      <p>Les délais annoncés sont indicatifs et courent à réception d'un dossier complet.</p>
      <ul>
        <li>AVI : 24-48h</li>
        <li>ADL : 48-72h</li>
        <li>Campus France : 2-4 semaines</li>
      </ul>
    `,
  },
  confidentialite: {
    title: "Politique de confidentialité",
    content: `
      <h2>Données collectées</h2>
      <p>GPI collecte les informations nécessaires au traitement de vos demandes : identité, coordonnées, justificatifs.</p>
      <h2>Utilisation</h2>
      <p>Ces données sont utilisées exclusivement pour le traitement de votre dossier et ne sont jamais revendues à des tiers.</p>
      <h2>Vos droits</h2>
      <p>Vous disposez d'un droit d'accès, de rectification et de suppression de vos données, sur simple demande à contact@gpi-etudes.org.</p>
    `,
  },
};

export function generateStaticParams() {
  return Object.keys(LEGAL).map((type) => ({ type }));
}

export default function LegalPage({ params }: { params: { type: string } }) {
  const page = LEGAL[params.type];
  if (!page) notFound();

  return (
    <>
      <PageHero crumb={page.title} eyebrow="Informations légales" title={page.title} />
      <section className="py-24">
        <div
          className="container-gpi max-w-[720px] [&_h2]:mb-2.5 [&_h2]:mt-7 [&_h2]:text-xl [&_li]:mb-2.5 [&_li]:text-[14.5px] [&_p]:mb-2.5 [&_p]:text-[14.5px] [&_ul]:pl-5"
          style={{ color: "var(--slate)" }}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </section>
    </>
  );
}
