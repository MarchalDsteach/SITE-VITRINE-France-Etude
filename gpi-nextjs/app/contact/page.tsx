import PageHero from "@/components/ui/PageHero";
import ContactForm from "@/components/ui/ContactForm";

export const metadata = { title: "Contact — GPI" };

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumb="Contact"
        eyebrow="Contact"
        title="Parlons de votre projet"
        subtitle="Une question, un besoin d'accompagnement ? Notre équipe vous répond sous 24h ouvrées."
      />
      <section className="py-24">
        <div className="container-gpi grid grid-cols-1 items-start gap-14 lg:grid-cols-2">
          <ContactForm />
          <div className="space-y-4">
            <div className="card">
              <h3 className="mb-1.5 text-lg">Email</h3>
              <p style={{ color: "var(--slate)" }}>contact@gpi-etudes.org</p>
            </div>
            <div className="card">
              <h3 className="mb-1.5 text-lg">Téléphone</h3>
              <p style={{ color: "var(--slate)" }}>+33 5 56 00 00 00</p>
            </div>
            <div className="card">
              <h3 className="mb-1.5 text-lg">Adresses</h3>
              <p style={{ color: "var(--slate)" }}>
                <b>Siège :</b> 20 Rue de Lentillac, 33800 Bordeaux<br />
                <b>Bureau :</b> 15 Cour Edouard Vaillant, 33300 Bordeaux
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
