"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { showToast } from "@/lib/toast";

export type OfferKind = "alternances" | "stages" | "jobs";

export type Offer = {
  id: string;
  kind: OfferKind;
  titre: string;
  org: string;
  ville: string;
  domaine: string;
  duree: string;
  rythme?: string; // organisation / horaires
  type?: string; // type de stage
  contrat?: string; // Apprentissage, CDD, ...
  limite?: string; // date ISO (AAAA-MM-JJ), facultative
  lien?: string; // URL ou e-mail pour postuler
  description?: string;
  createdAt: number;
};

export const KIND_META: Record<
  OfferKind,
  { label: string; singular: string; href: string; contrats: string[]; types: string[] }
> = {
  alternances: {
    label: "Alternances",
    singular: "alternance",
    href: "/alternances",
    contrats: ["Apprentissage", "Professionnalisation"],
    types: [],
  },
  stages: {
    label: "Stages",
    singular: "stage",
    href: "/stages",
    contrats: [],
    types: ["Stage de fin d'études", "Stage d'observation", "Stage court"],
  },
  jobs: {
    label: "Jobs étudiants",
    singular: "job étudiant",
    href: "/jobs-etudiants",
    contrats: ["CDI", "CDD", "Intérim", "Saisonnier", "Temps partiel", "Extra / week-end"],
    types: [],
  },
};

type ApiOffer = {
  id: string;
  title: string;
  company: string;
  location: string;
  contractType: string;
  type: "ALTERNANCE" | "INTERNSHIP" | "STUDENT_JOB";
  duration?: string | null;
  description: string;
  requirements?: string | null;
  applyUrl?: string | null;
  createdAt: string;
};

const OFFER_TYPE: Record<OfferKind, ApiOffer["type"]> = {
  alternances: "ALTERNANCE",
  stages: "INTERNSHIP",
  jobs: "STUDENT_JOB",
};

function fromApi(offer: ApiOffer): Offer {
  const kind = offer.type === "ALTERNANCE" ? "alternances" : offer.type === "INTERNSHIP" ? "stages" : "jobs";
  return {
    id: offer.id,
    kind,
    titre: offer.title,
    org: offer.company,
    ville: offer.location,
    domaine: offer.requirements || offer.contractType,
    duree: offer.duration || "Durée non précisée",
    type: kind === "stages" ? offer.contractType : undefined,
    contrat: kind !== "stages" ? offer.contractType : undefined,
    lien: offer.applyUrl || undefined,
    description: offer.description,
    createdAt: new Date(offer.createdAt).getTime(),
  };
}

/** Offres publiées par l'API, avec les suppressions réservées aux administrateurs. */
export function useOffers(kind: OfferKind) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void apiRequest<ApiOffer[]>(`/offers?type=${OFFER_TYPE[kind]}`)
      .then((result) => { if (active) setOffers(result.map(fromApi)); })
      .catch((reason: Error) => { if (active) setError(reason.message); })
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, [kind]);

  const addOffer = useCallback(
    async (data: Omit<Offer, "id" | "kind" | "createdAt">) => {
      const token = window.localStorage.getItem("gpi_access_token");
      if (!token) throw new Error("Connectez-vous avec un compte administrateur.");
      const result = await apiRequest<ApiOffer>("/offers", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: data.titre,
          company: data.org,
          location: data.ville,
          type: OFFER_TYPE[kind],
          contractType: data.contrat || data.type || KIND_META[kind].singular,
          duration: data.duree,
          description: [data.description, data.rythme && `Rythme : ${data.rythme}`, data.limite && `Date limite : ${data.limite}`].filter(Boolean).join("\n\n"),
          requirements: data.domaine,
          applyUrl: data.lien?.startsWith("http") ? data.lien : undefined,
          isPublished: true,
        }),
      });
      setOffers((current) => [fromApi(result), ...current]);
    },
    [kind]
  );

  const removeOffer = useCallback(
    async (id: string) => {
      const token = window.localStorage.getItem("gpi_access_token");
      if (!token) return;
      try {
        await apiRequest(`/offers/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        setOffers((current) => current.filter((offer) => offer.id !== id));
      } catch (reason) {
        showToast(reason instanceof Error ? reason.message : "Suppression impossible.");
      }
    },
    []
  );

  return { offers, ready, error, addOffer, removeOffer };
}

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const sync = () => {
      try {
        const user = JSON.parse(window.localStorage.getItem("gpi_user") ?? "null");
        setIsAdmin(user?.role === "ADMIN" && Boolean(window.localStorage.getItem("gpi_access_token")));
      } catch {
        setIsAdmin(false);
      }
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("gpi:admin-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("gpi:admin-changed", sync);
    };
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem("gpi_access_token");
    window.localStorage.removeItem("gpi_user");
    window.dispatchEvent(new Event("gpi:admin-changed"));
  }, []);

  return { isAdmin, logout };
}

/* --------------------------------- Helpers --------------------------------- */

export function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

export function applyHref(lien?: string) {
  if (!lien) return "/contact";
  const v = lien.trim();
  if (/^https?:\/\//i.test(v)) return v;
  if (v.includes("@") && !v.includes(" ")) return `mailto:${v}`;
  return `https://${v}`;
}
