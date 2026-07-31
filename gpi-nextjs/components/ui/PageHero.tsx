import Link from "next/link";

export default function PageHero({
  crumb,
  eyebrow,
  title,
  subtitle,
}: {
  crumb: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="pagehero py-16">
      <div className="container-gpi relative">
        <div className="mb-3.5 font-mono text-[11.5px] uppercase tracking-wide text-white/50">
          <Link href="/" className="hover:text-[var(--red-2)]">Accueil</Link> / {crumb}
        </div>
        <span className="eyebrow" style={{ color: "var(--red-2)" }}>{eyebrow}</span>
        <h1 className="mt-3 text-[clamp(28px,4vw,42px)] text-white">{title}</h1>
        {subtitle && <p className="mt-3 max-w-[560px] text-white/70">{subtitle}</p>}
      </div>
    </section>
  );
}
