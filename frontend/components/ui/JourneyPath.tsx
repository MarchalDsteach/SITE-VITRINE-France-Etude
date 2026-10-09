const NODES = [
  { label: "Dossier", sub: "Constitution", icon: "📁" },
  { label: "Visa", sub: "Attestations", icon: "🛂" },
  { label: "Envol", sub: "Départ", icon: "✈" },
  { label: "Campus", sub: "Réussite", icon: "🎓" },
];

export default function JourneyPath() {
  return (
    <div className="glass relative overflow-hidden rounded-[22px] p-7 sm:p-8">
      <div className="mb-7 flex items-center justify-between gap-4">
        <span className="kicker" style={{ color: "var(--red-2)" }}>Votre parcours GPI</span>
        <span className="font-mono text-[11px] text-white/40">DKR → PAR</span>
      </div>

      <svg viewBox="0 0 320 160" className="w-full" style={{ overflow: "visible" }}>
        <path
          d="M 20 130 C 90 130, 90 40, 160 70 C 220 95, 230 30, 300 30"
          fill="none"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="2"
        />
        <path
          d="M 20 130 C 90 130, 90 40, 160 70 C 220 95, 230 30, 300 30"
          fill="none"
          stroke="var(--red-2)"
          strokeWidth="2"
          strokeDasharray="6 8"
          style={{ animation: "dashMove 2.2s linear infinite" }}
        />
        {[
          [20, 130],
          [148, 66],
          [222, 88],
          [300, 30],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="15" fill="#0f1b33" stroke="var(--red-2)" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r="15" fill="none" stroke="rgba(255,77,86,0.35)" strokeWidth="6" />
          </g>
        ))}
      </svg>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {NODES.map((n) => (
          <div key={n.label} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-4 text-center">
            <div aria-hidden className="mb-3 text-[20px] leading-none">{n.icon}</div>
            <div className="text-[12.5px] font-semibold text-white">{n.label}</div>
            <div className="font-mono text-[9.5px] uppercase tracking-wide text-white/40">{n.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
