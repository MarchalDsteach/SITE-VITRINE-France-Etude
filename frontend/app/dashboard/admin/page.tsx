"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, Offer } from "@/lib/api";

type AdminStats = {
  users: number;
  advisors: number;
  activeUsers: number;
  applications: number;
  pendingApplications: number;
  offers: number;
  unreadMessages: number;
  leads: number;
};

export default function AdminHomePage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get<Offer[]>("/offers/admin/all"), api.get<AdminStats>("/admin/stats")])
      .then(([offerData, statsData]) => {
        setOffers(offerData);
        setStats(statsData);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  const published = offers.filter((offer) => offer.isPublished);

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Tableau de bord</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Pilotage de la plateforme</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Validation des comptes, gestion des dossiers, suivi des étudiants et publication des offres.
        </p>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric href="/gestion/utilisateurs" label="Comptes étudiants" value={stats?.users ?? 0} />
        <Metric href="/gestion/dossiers" label="Dossiers à suivre" value={stats?.pendingApplications ?? 0} accent />
        <Metric href="/gestion/messages" label="Messages non lus" value={stats?.unreadMessages ?? 0} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric href="/gestion/utilisateurs" label="Conseillers" value={stats?.advisors ?? 0} />
        <Metric href="/gestion/demandes" label="Demandes reçues" value={stats?.leads ?? 0} />
        <Metric href="/gestion/offres" label="Offres publiées" value={published.length} />
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-slate-950 p-7 text-white shadow-xl shadow-slate-900/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-amber-300">Validation</p>
              <h2 className="mt-2 text-xl font-semibold">Comptes à valider</h2>
            </div>
            <span className="rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-slate-950">À revoir</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Chaque nouvel inscrit doit être validé avant d’accéder au dashboard et de déposer des demandes.
          </p>
          <Link href="/gestion/utilisateurs" className="mt-6 inline-flex rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950">
            Gérer les comptes
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Offres</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Ajouter une nouvelle opportunité</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Les offres publiées apparaissent automatiquement dans la rubrique publique et dans le dashboard étudiant.
          </p>
          <Link href="/gestion/offres" className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            Gérer les offres
          </Link>
        </div>
      </section>
    </div>
  );
}

function Metric({ href, label, value, accent = false }: { href: string; label: string; value: number; accent?: boolean }) {
  return (
    <Link href={href} className={`group block rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${accent ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"}`}>
      <p className="text-3xl font-bold text-slate-950">{value}</p>
      <span className="mt-1 flex items-center justify-between gap-3 text-sm text-slate-600"><span>{label}</span><span aria-hidden="true" className="text-slate-400 transition group-hover:translate-x-1">→</span></span>
    </Link>
  );
}
