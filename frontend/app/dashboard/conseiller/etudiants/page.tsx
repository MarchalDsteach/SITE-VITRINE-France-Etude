"use client";

import { useEffect, useState } from "react";
import { api, Lead } from "@/lib/api";

export default function ConseillerEtudiantsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLeads(await api.get<Lead[]>("/advisor/leads"));
    } catch (reason) {
      setError((reason as Error).message);
    }
  }

  useEffect(() => {
    api.get<Lead[]>("/advisor/leads").then(setLeads).catch((reason: Error) => setError(reason.message));
  }, []);

  async function updateStatus(id: string, status: Lead["status"]) {
    try {
      await api.patch(`/advisor/leads/${id}`, { status });
      await load();
    } catch (reason) {
      setError((reason as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">Étudiants</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Suivi des dossiers</h1>
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 uppercase">
            <tr>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Demande</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-slate-100">
                <td className="px-4 py-3"><p className="font-medium text-slate-900">{lead.fullName || (lead.user ? `${lead.user.firstName} ${lead.user.lastName}` : "Contact")}</p><p className="text-xs text-slate-500">{lead.email || lead.user?.email}</p></td>
                <td className="px-4 py-3 text-slate-600">{lead.subject || lead.serviceName || "Demande de contact"}</td>
                <td className="px-4 py-3"><select value={lead.status} onChange={(event) => updateStatus(lead.id, event.target.value as Lead["status"])} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs"><option value="NEW">Nouveau</option><option value="CONTACTED">Contacté</option><option value="IN_PROGRESS">En cours</option><option value="RESOLVED">Résolu</option><option value="ARCHIVED">Archivé</option></select></td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && <p className="p-5 text-sm text-slate-500">Aucune demande assignée à votre compte.</p>}
      </div>
    </div>
  );
}
