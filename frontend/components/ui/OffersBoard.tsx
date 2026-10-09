"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import ListingsSearch from "@/components/ui/ListingsSearch";
import { showToast } from "@/lib/toast";
import { KIND_META, OfferKind, useAdmin, useOffers } from "@/lib/offers";

type FormState = {
  titre: string;
  org: string;
  ville: string;
  domaine: string;
  duree: string;
  rythme: string;
  type: string;
  contrat: string;
  limite: string;
  lien: string;
  description: string;
};

const INITIAL: FormState = {
  titre: "",
  org: "",
  ville: "",
  domaine: "",
  duree: "",
  rythme: "",
  type: "",
  contrat: "",
  limite: "",
  lien: "",
  description: "",
};

const COPY: Record<OfferKind, { titre: string; duree: string; rythme: string; domaine: string }> = {
  alternances: {
    titre: "Alternance Développeur Web",
    duree: "12-24 mois",
    rythme: "3j entreprise / 2j école",
    domaine: "Informatique",
  },
  stages: { titre: "Stage Support Informatique", duree: "4 mois", rythme: "", domaine: "Informatique" },
  jobs: {
    titre: "Équipier polyvalent",
    duree: "Temps partiel, 15h / semaine",
    rythme: "Soirs et week-ends",
    domaine: "Restauration",
  },
};

function AdminPanel({ kind, onAdd }: { kind: OfferKind; onAdd: ReturnType<typeof useOffers>["addOffer"] }) {
  const meta = KIND_META[kind];
  const ex = COPY[kind];
  const [open, setOpen] = useState(false);
  const [f, setF] = useState<FormState>(INITIAL);
  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      await onAdd({
        titre: f.titre.trim(),
        org: f.org.trim(),
        ville: f.ville.trim(),
        domaine: f.domaine.trim(),
        duree: f.duree.trim(),
        rythme: f.rythme.trim() || undefined,
        type: f.type || undefined,
        contrat: f.contrat || undefined,
        limite: f.limite || undefined,
        lien: f.lien.trim() || undefined,
        description: f.description.trim() || undefined,
      });
      setF(INITIAL);
      setOpen(false);
      showToast("Offre publiée ✓");
    } catch (reason) {
      showToast(reason instanceof Error ? reason.message : "Publication impossible.");
    }
  }

  return (
    <div className="rounded-[14px] border bg-white p-5 shadow-gpi" style={{ borderColor: "var(--line)" }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[17px]">Espace administrateur</h3>
          <p className="text-[13px]" style={{ color: "var(--slate)" }}>
            Ajoutez ou supprimez les offres de l&apos;onglet « {meta.label} ».
          </p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? "Fermer le formulaire" : `Ajouter une offre de ${meta.singular}`}
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="field mt-5 grid grid-cols-1 gap-4 border-t pt-5 sm:grid-cols-2" style={{ borderColor: "var(--line)" }}>
          <div className="sm:col-span-2">
            <label htmlFor="o-titre">Intitulé du poste *</label>
            <input id="o-titre" required value={f.titre} onChange={set("titre")} placeholder={ex.titre} />
          </div>
          <div>
            <label htmlFor="o-org">Entreprise / organisme *</label>
            <input id="o-org" required value={f.org} onChange={set("org")} placeholder="Nom de l'entreprise" />
          </div>
          <div>
            <label htmlFor="o-ville">Ville *</label>
            <input id="o-ville" required value={f.ville} onChange={set("ville")} placeholder="Nanterre, France" />
          </div>
          <div>
            <label htmlFor="o-domaine">{kind === "jobs" ? "Secteur *" : "Domaine *"}</label>
            <input id="o-domaine" required value={f.domaine} onChange={set("domaine")} placeholder={ex.domaine} />
          </div>
          <div>
            <label htmlFor="o-duree">{kind === "jobs" ? "Durée / volume horaire *" : "Durée *"}</label>
            <input id="o-duree" required value={f.duree} onChange={set("duree")} placeholder={ex.duree} />
          </div>

          {meta.contrats.length > 0 && (
            <div>
              <label htmlFor="o-contrat">Type de contrat *</label>
              <select id="o-contrat" required value={f.contrat} onChange={set("contrat")}>
                <option value="">Choisir…</option>
                {meta.contrats.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
          {meta.types.length > 0 && (
            <div>
              <label htmlFor="o-type">Type de stage *</label>
              <select id="o-type" required value={f.type} onChange={set("type")}>
                <option value="">Choisir…</option>
                {meta.types.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}
          {kind !== "stages" && (
            <div>
              <label htmlFor="o-rythme">{kind === "jobs" ? "Horaires" : "Rythme"}</label>
              <input id="o-rythme" value={f.rythme} onChange={set("rythme")} placeholder={ex.rythme} />
            </div>
          )}

          <div>
            <label htmlFor="o-limite">Date limite de candidature</label>
            <input id="o-limite" type="date" value={f.limite} onChange={set("limite")} />
          </div>
          <div>
            <label htmlFor="o-lien">Lien ou e-mail pour postuler</label>
            <input id="o-lien" value={f.lien} onChange={set("lien")} placeholder="https://… ou recrutement@entreprise.fr" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="o-desc">Description (facultative)</label>
            <textarea id="o-desc" rows={3} value={f.description} onChange={set("description")} placeholder="Missions, profil recherché…" />
          </div>
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" className="btn btn-primary btn-sm">Publier l&apos;offre</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => { setF(INITIAL); setOpen(false); }}>
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function OffersBoard({ kind }: { kind: OfferKind }) {
  const { offers, ready, error, addOffer, removeOffer } = useOffers(kind);
  const { isAdmin, logout } = useAdmin();
  const meta = KIND_META[kind];

  return (
    <div className="relative z-[5] -mt-12 flex flex-col gap-6">
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Impossible de charger les offres : {error}</p>}
      {isAdmin && (
        <>
          <AdminPanel kind={kind} onAdd={addOffer} />
          <div className="-mt-3 text-right">
            <button type="button" onClick={logout} className="text-[12.5px] underline" style={{ color: "var(--slate)" }}>
              Quitter le mode administrateur
            </button>
          </div>
        </>
      )}

      {ready && offers.length === 0 && (
        <div className="rounded-[14px] border bg-white px-6 py-16 text-center shadow-gpi" style={{ borderColor: "var(--line)" }}>
          <div aria-hidden className="mb-4 text-[34px]">🧭</div>
          <h3 className="mb-2 text-[19px]">Aucune offre de {meta.singular} pour le moment</h3>
          <p className="mx-auto max-w-[460px] text-[14.5px]" style={{ color: "var(--slate)" }}>
            {isAdmin
              ? "Utilisez le bouton ci-dessus pour publier la première offre de cet onglet."
              : "De nouvelles offres seront publiées prochainement. Revenez bientôt ou contactez-nous pour être informé."}
          </p>
          {!isAdmin && (
            <Link href="/contact" className="btn btn-outline btn-sm mt-6">Nous contacter</Link>
          )}
        </div>
      )}

      {offers.length > 0 && <ListingsSearch data={offers} kind={kind} isAdmin={isAdmin} onRemove={removeOffer} />}
    </div>
  );
}
