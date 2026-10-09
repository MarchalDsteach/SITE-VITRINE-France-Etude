const ITEMS = ["AVI", "ADL", "CAMPUS FRANCE", "BOURSES", "ALTERNANCES", "STAGES", "JOBS ÉTUDIANTS", "VÉRIFICATEUR"];

export default function TickerStrip() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden py-3" style={{ background: "linear-gradient(90deg, var(--red-deep), var(--red))" }}>
      <div className="marquee-track flex w-max items-center gap-10" style={{ animationDuration: "22s" }}>
        {doubled.map((t, i) => (
          <span key={t + i} className="flex items-center gap-10 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-white/95">
            {t}
            <span aria-hidden className="text-white/50">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
