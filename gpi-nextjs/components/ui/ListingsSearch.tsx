"use client";

import { useMemo, useState } from "react";
import { Listing } from "@/lib/data";
import { showToast } from "@/lib/toast";

function durMonths(str: string) {
  const matches = str.match(/(\d+)/g);
  return matches ? parseInt(matches[matches.length - 1], 10) : 0;
}

export default function ListingsSearch({ data, kind }: { data: Listing[]; kind: "alternances" | "stages" }) {
  const [q, setQ] = useState("");
  const [domaine, setDomaine] = useState("");
  const [ville, setVille] = useState("");
  const [duree, setDuree] = useState("");
  const [contrat, setContrat] = useState("");

  const domaines = useMemo(() => [...new Set(data.map((d) => d.domaine))], [data]);
  const villes = useMemo(() => [...new Set(data.map((d) => d.ville))], [data]);

  const filtered = useMemo(() => {
    return data.filter((it) => {
      const text = `${it.titre} ${it.org} ${it.ville} ${it.domaine}`.toLowerCase();
      if (q && !text.includes(q.toLowerCase())) return false;
      if (domaine && it.domaine !== domaine) return false;
      if (ville && it.ville !== ville) return false;
      if (contrat && it.contrat !== contrat) return false;
      if (duree) {
        const m = durMonths(it.duree);
        if (duree === "court" && m > 3) return false;
        if (duree === "long" && m <= 3) return false;
      }
      return true;
    });
  }, [data, q, domaine, ville, duree, contrat]);

  return (
    <div>
      <div className={`relative z-[5] -mt-12 grid grid-cols-1 gap-3 rounded-[14px] border bg-white p-5 shadow-gpi sm:grid-cols-2 ${kind === "alternances" ? "lg:grid-cols-5" : "lg:grid-cols-4"}`} style={{ borderColor: "var(--line)" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Métier, mot-clé, entreprise..."
          className="w-full rounded-[9px] border px-3.5 py-3 text-sm lg:col-span-1"
          style={{ borderColor: "var(--line)", background: "var(--paper)" }}
        />
        <select value={ville} onChange={(e) => setVille(e.target.value)} className="w-full rounded-[9px] border px-3.5 py-3 text-sm" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
          <option value="">Ville (lieu de recherche)</option>
          {villes.map((v) => <option key={v}>{v}</option>)}
        </select>
        <select value={domaine} onChange={(e) => setDomaine(e.target.value)} className="w-full rounded-[9px] border px-3.5 py-3 text-sm" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
          <option value="">Tous les domaines</option>
          {domaines.map((d) => <option key={d}>{d}</option>)}
        </select>
        {kind === "alternances" && (
          <select value={contrat} onChange={(e) => setContrat(e.target.value)} className="w-full rounded-[9px] border px-3.5 py-3 text-sm" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
            <option value="">Tout type de contrat</option>
            <option value="Apprentissage">Apprentissage</option>
            <option value="Professionnalisation">Professionnalisation</option>
          </select>
        )}
        <select value={duree} onChange={(e) => setDuree(e.target.value)} className="w-full rounded-[9px] border px-3.5 py-3 text-sm" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
          <option value="">Toute durée</option>
          <option value="court">Courte (≤ 3 mois)</option>
          <option value="long">Longue (&gt; 3 mois)</option>
        </select>
      </div>

      <div className="mb-4.5 mt-9 flex flex-wrap items-center justify-between gap-2.5">
        <span className="font-mono text-[12.5px]" style={{ color: "var(--slate)" }}>
          {filtered.length} offre{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}
        </span>
        <span className="font-mono text-xs" style={{ color: "var(--slate-light)" }}>Mise à jour dynamique en temps réel</span>
      </div>

      <div className="flex flex-col gap-3.5">
        {filtered.length === 0 && (
          <div className="py-16 text-center" style={{ color: "var(--slate)" }}>
            <div className="mb-3 text-[34px]">🧭</div>
            <p>Aucune offre ne correspond à votre recherche pour le moment.<br />Essayez d&apos;élargir vos filtres.</p>
          </div>
        )}
        {filtered.map((it) => (
          <div key={it.titre + it.org} className="card flex flex-wrap items-center justify-between gap-4 p-5.5">
            <div className="flex items-start gap-4">
              <div
                className="flex h-12 w-12 flex-none items-center justify-center rounded-[10px] font-display text-base font-bold"
                style={{ background: "var(--paper-2)", color: "var(--ink)" }}
              >
                {it.org.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="mb-0.5 text-[16.5px]">{it.titre}</h4>
                <div className="flex flex-wrap gap-2.5 text-[13px]" style={{ color: "var(--slate)" }}>
                  <span>{it.org}</span><span>·</span><span>{it.ville}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="tag tag-route">{it.domaine}</span>
                  <span className="tag">{it.duree}</span>
                  <span className="tag">{it.rythme || it.type}</span>
                  {it.contrat && <span className="tag">{it.contrat}</span>}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="mb-2 block font-mono text-[11.5px]" style={{ color: "var(--ruby)" }}>Limite : {it.limite}</span>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => showToast(`Candidature envoyée pour "${it.titre}" ✓`)}
              >
                Postuler
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
