export default function BoardingPass() {
  return (
    <div className="relative grid animate-[passIn_.8s_cubic-bezier(.2,.8,.2,1)_both] grid-cols-[1fr_auto] overflow-hidden rounded-[18px] bg-paper text-ink shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
      <div
        className="absolute bottom-0 left-0 top-0 w-px"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(15,27,51,0.25) 0 6px, transparent 6px 12px)",
        }}
      />
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <span className="eyebrow" style={{ color: "var(--ink)" }}>Carte d&apos;embarquement</span>
          <span className="font-mono text-[11px]" style={{ color: "var(--slate-light)" }}>N° GPI-2026-04471</span>
        </div>
        <div className="mb-5 mt-1.5 flex items-center gap-3.5">
          <div className="font-display text-[26px] font-bold">
            DKR
            <small className="mt-0.5 block font-mono text-[10px] font-normal uppercase tracking-wide" style={{ color: "var(--slate-light)" }}>
              Départ
            </small>
          </div>
          <span style={{ color: "var(--red)" }} className="text-xl">✈</span>
          <div className="font-display text-[26px] font-bold">
            PAR
            <small className="mt-0.5 block font-mono text-[10px] font-normal uppercase tracking-wide" style={{ color: "var(--slate-light)" }}>
              Destination
            </small>
          </div>
        </div>
        <div className="mt-1.5 grid grid-cols-2 gap-x-4.5 gap-y-3.5">
          {[
            ["Étudiant", "Vous"],
            ["Statut", "Dossier actif"],
            ["Programme", "Campus France"],
            ["Embarquement", "Rentrée 2026"],
          ].map(([label, value]) => (
            <div key={label}>
              <label className="mb-1 block font-mono text-[9.5px] uppercase tracking-wide" style={{ color: "var(--slate-light)" }}>
                {label}
              </label>
              <span className="text-sm font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="relative flex w-[150px] flex-col justify-between bg-ink p-5 text-paper">
        <div>
          <span className="font-mono text-[10px] uppercase" style={{ color: "var(--red-2)" }}>Services actifs</span>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["AVI", "ADL", "Bourse", "Visa"].map((s) => (
              <span key={s} className="stamp-badge">{s}</span>
            ))}
          </div>
        </div>
        <div
          className="mt-3.5 h-[34px] opacity-85"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--paper) 0 2px, transparent 2px 4px, var(--paper) 4px 5px, transparent 5px 8px)",
          }}
        />
      </div>
    </div>
  );
}
