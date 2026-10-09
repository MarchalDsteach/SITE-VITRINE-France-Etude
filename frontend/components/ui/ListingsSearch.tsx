"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { apiUrl } from "@/lib/api";
import { KIND_META, Offer, OfferKind, applyHref, formatDate } from "@/lib/offers";

function durMonths(str: string) {
  const matches = str.match(/(\d+)/g);
  return matches ? parseInt(matches[matches.length - 1], 10) : 0;
}

const FIELD = "w-full rounded-[9px] border px-3.5 py-3 text-sm";
const FIELD_STYLE = { borderColor: "var(--line)", background: "var(--paper)" } as const;

export default function ListingsSearch({
  data,
  kind,
  isAdmin = false,
  onRemove,
}: {
  data: Offer[];
  kind: OfferKind;
  isAdmin?: boolean;
  onRemove?: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [domaine, setDomaine] = useState("");
  const [ville, setVille] = useState("");
  const [duree, setDuree] = useState("");
  const [contrat, setContrat] = useState("");

  const meta = KIND_META[kind];
  const hasContrat = meta.contrats.length > 0;
  const hasDuree = kind !== "jobs";
  const domaineLabel = kind === "jobs" ? "Tous les secteurs" : "Tous les domaines";

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

  // Rien à filtrer tant qu'aucune offre n'a été publiée
  if (data.length === 0) return null;

  const cols = 2 + (hasContrat ? 1 : 0) + (hasDuree ? 1 : 0) + 1; // recherche + ville + domaine (+ contrat) (+ durée)
  const lgCols = cols >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-4";

  return (
    <div>
      <div
        className={`grid grid-cols-1 gap-3 rounded-[14px] border bg-white p-5 shadow-gpi sm:grid-cols-2 ${lgCols}`}
        style={{ borderColor: "var(--line)" }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Métier, mot-clé, entreprise..."
          aria-label="Rechercher une offre"
          className={FIELD}
          style={FIELD_STYLE}
        />
        <select value={ville} onChange={(e) => setVille(e.target.value)} aria-label="Ville" className={FIELD} style={FIELD_STYLE}>
          <option value="">Ville (lieu de recherche)</option>
          {villes.map((v) => <option key={v}>{v}</option>)}
        </select>
        <select value={domaine} onChange={(e) => setDomaine(e.target.value)} aria-label="Domaine" className={FIELD} style={FIELD_STYLE}>
          <option value="">{domaineLabel}</option>
          {domaines.map((d) => <option key={d}>{d}</option>)}
        </select>
        {hasContrat && (
          <select value={contrat} onChange={(e) => setContrat(e.target.value)} aria-label="Type de contrat" className={FIELD} style={FIELD_STYLE}>
            <option value="">Tout type de contrat</option>
            {meta.contrats.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        {hasDuree && (
          <select value={duree} onChange={(e) => setDuree(e.target.value)} aria-label="Durée" className={FIELD} style={FIELD_STYLE}>
            <option value="">Toute durée</option>
            <option value="court">Courte (≤ 3 mois)</option>
            <option value="long">Longue (&gt; 3 mois)</option>
          </select>
        )}
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
            <div aria-hidden className="mb-4 text-[34px]">🧭</div>
            <p>Aucune offre ne correspond à votre recherche pour le moment.<br />Essayez d&apos;élargir vos filtres.</p>
          </div>
        )}
        {filtered.map((it) => {
          const href = it.lien ? apiUrl(`/offers/${it.id}/apply`) : applyHref();
          const external = href.startsWith("http") || href.startsWith("mailto:");
          return (
            <div key={it.id} className="card flex flex-wrap items-center justify-between gap-4 p-5.5">
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
                  {it.description && (
                    <p className="mt-1.5 max-w-[620px] text-[13.5px]" style={{ color: "var(--slate)" }}>{it.description}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="tag tag-accent">{it.domaine}</span>
                    <span className="tag">{it.duree}</span>
                    {(it.rythme || it.type) && <span className="tag">{it.rythme || it.type}</span>}
                    {it.contrat && <span className="tag">{it.contrat}</span>}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {it.limite && (
                  <span className="mb-2 block font-mono text-[11.5px]" style={{ color: "var(--red)" }}>
                    Limite : {formatDate(it.limite)}
                  </span>
                )}
                <div className="flex items-center justify-end gap-3">
                  {isAdmin && onRemove && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        if (window.confirm(`Supprimer l'offre « ${it.titre} » ?`)) onRemove(it.id);
                      }}
                    >
                      Supprimer
                    </button>
                  )}
                  {external ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Postuler</a>
                  ) : (
                    <Link href={href} className="btn btn-primary btn-sm">Postuler</Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
