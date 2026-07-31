import { notFound } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ServiceCard from "@/components/ui/ServiceCard";
import QuickRequestForm from "@/components/ui/QuickRequestForm";
import Verificateur from "@/components/ui/Verificateur";
import { SERVICES } from "@/lib/data";

export function generateStaticParams() {
  return Object.keys(SERVICES).map((slug) => ({ slug }));
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = SERVICES[params.slug];
  if (!service) notFound();

  if (params.slug === "verificateur") {
    return (
      <>
        <PageHero
          crumb={`Services / ${service.name}`}
          eyebrow={service.badge}
          title={service.name}
          subtitle={service.short}
        />
        <section className="py-24">
          <div className="container-gpi">
            <Verificateur />
          </div>
        </section>
      </>
    );
  }

  const others = Object.values(SERVICES).filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero crumb={`Services / ${service.name}`} eyebrow={service.badge} title={service.name} subtitle={service.short} />

      <section className="py-24">
        <div className="container-gpi grid grid-cols-1 items-start gap-14 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl">Description du service</h2>
            <p style={{ color: "var(--slate)" }}>{service.desc}</p>

            <div className="my-5.5 flex items-center">
              {service.steps.map((st, i) => (
                <div key={st} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-bold"
                      style={{ background: i === 0 ? "var(--red)" : "var(--paper-2)", color: i === 0 ? "#fff" : "var(--slate)" }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-[12.5px]" style={{ color: i === 0 ? "var(--ink)" : "var(--slate)" }}>{st}</span>
                  </div>
                  {i < service.steps.length - 1 && <div className="mx-1.5 h-px w-8" style={{ background: "var(--line)" }} />}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border bg-ink px-3.5 py-2 text-sm text-white">{service.duration}</span>
              <span className="rounded-full border bg-white px-3.5 py-2 text-sm" style={{ borderColor: "var(--line)" }}>{service.price}</span>
            </div>

            <div className="mt-6.5 flex flex-wrap gap-3.5">
              <Link href="/espace" className="btn btn-primary">Démarrer une demande</Link>
              <Link href="/services" className="btn btn-outline">← Retour aux services</Link>
            </div>
          </div>

          <QuickRequestForm service={service} />
        </div>
      </section>

      <section className="py-16" style={{ background: "var(--paper-2)" }}>
        <div className="container-gpi">
          <div className="mb-2 max-w-[620px]">
            <span className="eyebrow">À découvrir aussi</span>
            <h2 className="mt-3 text-2xl">Autres services</h2>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((s) => <ServiceCard key={s.slug} service={s} />)}
          </div>
        </div>
      </section>
    </>
  );
}
