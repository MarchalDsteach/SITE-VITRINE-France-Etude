import Link from "next/link";
import { Service } from "@/lib/data";

export default function FeaturedServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[18px] p-8 text-white transition-transform duration-300 hover:-translate-y-1.5"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url('${service.image}')` }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(150deg, rgba(15,27,51,0.92) 0%, rgba(22,39,74,0.88) 55%, rgba(181,21,29,0.55) 160%)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full transition-transform duration-500 group-hover:scale-110"
        style={{ background: "radial-gradient(circle, rgba(228,33,43,0.35) 0%, transparent 70%)" }}
      />

      <div className="relative">
        <span className="rounded-full px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wide" style={{ background: "rgba(255,255,255,0.12)", color: "var(--red-2)" }}>
          {service.badge}
        </span>
        <div className="mb-5 mt-6 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl" style={{ background: "rgba(255,255,255,0.12)" }}>
          {service.icon}
        </div>
        <h3 className="mb-2.5 text-[24px] text-white">{service.name}</h3>
        <p className="max-w-[380px] text-[14.5px] text-white/65">{service.short}</p>
      </div>

      <div className="relative mt-8 flex items-center justify-between">
        <span className="font-mono text-[12px] text-white/50">{service.duration}</span>
        <span className="flex items-center gap-3 text-sm font-semibold" style={{ color: "var(--red-2)" }}>
          Découvrir le service
          <span aria-hidden className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">→</span>
        </span>
      </div>
    </Link>
  );
}
