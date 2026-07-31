import Link from "next/link";
import { Service } from "@/lib/data";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/services/${service.slug}`} className="card block">
      <span
        className="absolute right-5 top-5 rounded-full px-2 py-1 font-mono text-[9.5px] uppercase tracking-wide"
        style={{ background: "var(--paper-2)", color: "var(--ink)" }}
      >
        {service.badge}
      </span>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[11px] bg-ink text-[19px]" style={{ color: "var(--red-2)" }}>
        {service.icon}
      </div>
      <h3 className="mb-2 text-lg">{service.name}</h3>
      <p className="mb-4 text-sm" style={{ color: "var(--slate)" }}>{service.short}</p>
      <div className="flex items-center justify-between text-[13px]">
        <span className="font-mono" style={{ color: "var(--slate-light)" }}>{service.duration}</span>
        <span className="font-semibold" style={{ color: "var(--ink)" }}>En savoir plus →</span>
      </div>
    </Link>
  );
}
