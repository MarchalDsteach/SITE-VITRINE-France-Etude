"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, Lead } from "@/lib/api";

export default function ConseillerDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<Lead[]>("/advisor/leads").then(setLeads).catch((reason: Error) => setError(reason.message));
  }, []);

  const openLeads = leads.filter((lead) => !["RESOLVED", "ARCHIVED"].includes(lead.status));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">Conseiller</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Suivi étudiant et agenda</h1>
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Demandes assignées" value={leads.length} />
        <Stat label="À traiter" value={openLeads.length} accent />
        <Stat label="Terminées" value={leads.length - openLeads.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-semibold text-slate-900">Relances à traiter</h2><Link href="/dashboard/conseiller/agenda" className="text-sm font-semibold text-cyan-800">Voir la liste</Link></div>
          <div className="mt-5 space-y-4">
            {openLeads.slice(0, 4).map((lead) => (
              <div key={lead.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{lead.subject || lead.serviceName || "Demande de contact"}</p>
                <p className="mt-1 text-xs text-slate-500">{lead.fullName || lead.user?.firstName || lead.email || "Contact"} · {new Date(lead.createdAt).toLocaleDateString("fr-FR")}</p>
                <p className="mt-2 text-xs font-medium text-cyan-800">{lead.status.replaceAll("_", " ")}</p>
              </div>
            ))}
            {openLeads.length === 0 && <p className="py-8 text-sm text-slate-500">Aucune demande assignée à traiter.</p>}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Dossiers récents</h2>
          <div className="mt-5 space-y-3">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="truncate font-medium text-slate-800">{lead.fullName || lead.user?.firstName || lead.email || "Contact"}</span>
                <span className="shrink-0 text-xs font-medium text-slate-500">{lead.status.replaceAll("_", " ")}</span>
              </div>
            ))}
            {leads.length === 0 && <p className="py-6 text-sm text-slate-500">Aucun dossier attribué.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-cyan-200 bg-cyan-50" : "border-slate-200 bg-white"}`}>
      <p className="text-3xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </div>
  );
}
