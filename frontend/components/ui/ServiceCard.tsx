import Link from "next/link";
import { Service } from "@/lib/data";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div
      className="group flex h-full flex-col overflow-hidden rounded-[18px] border bg-white transition-all duration-300 ease-out hover:-translate-y-1.5"
      style={{ borderColor: "var(--line)", boxShadow: "var(--shadow)" }}
    >
      <div className="relative h-[190px] overflow-hidden">
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url('${service.image}')` }}
        />
        <span
          className="absolute right-3.5 top-3.5 rounded-full px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wide text-white"
          style={{ background: "rgba(15,27,51,0.7)", backdropFilter: "blur(6px)" }}
        >
          {service.badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2.5 text-[21px] leading-tight">{service.name}</h3>
        <p className="mb-4 flex-1 text-[14px]" style={{ color: "var(--slate)" }}>{service.short}</p>

        {(service.duration || service.price) && (
          <div className="mb-5 flex items-center justify-between gap-4 text-[13px]">
            {service.duration && <span className="font-mono" style={{ color: "var(--slate-light)" }}>{service.duration}</span>}
            {service.price && <span className="font-semibold" style={{ color: "var(--red)" }}>{service.price}</span>}
          </div>
        )}

        <Link href={`/services/${service.slug}`} className="btn btn-primary btn-sm mt-auto w-fit">
          Voir les conditions
        </Link>
      </div>
    </div>
  );
}
