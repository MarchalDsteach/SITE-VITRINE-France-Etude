"use client";

import { useEffect, useState } from "react";
import { api, Lead } from "@/lib/api";

export default function ConseillerAgendaPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get<Lead[]>("/advisor/leads").then(setLeads).catch((reason: Error) => setError(reason.message));
  }, []);
  const followUps = leads.filter((lead) => !["RESOLVED", "ARCHIVED"].includes(lead.status));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">Agenda</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Relances à effectuer</h1>
        <p className="mt-2 text-sm text-slate-600">Demandes ouvertes, classées de la plus récente à la plus ancienne.</p>
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="space-y-4">
        {followUps.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">{new Date(item.createdAt).toLocaleDateString("fr-FR")}</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">{item.subject || item.serviceName || "Demande de contact"}</h2>
                <p className="mt-1 text-sm text-slate-600">{item.fullName || item.user?.firstName || item.email || "Contact"}</p>
              </div>
              <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800">{item.status.replaceAll("_", " ")}</span>
            </div>
          </div>
        ))}
        {!error && followUps.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">Aucune relance en attente.</p>}
      </div>
    </div>
  );
}
