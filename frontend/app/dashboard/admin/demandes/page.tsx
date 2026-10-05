"use client";

import { useEffect, useState } from "react";
import { api, Lead, StudentProfile } from "@/lib/api";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [advisors, setAdvisors] = useState<StudentProfile[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get<Lead[]>("/admin/leads"), api.get<StudentProfile[]>("/admin/users")])
      .then(([leadData, userData]) => {
        setLeads(leadData);
        setAdvisors(userData.filter((user) => user.role === "ADVISOR" && user.status === "ACTIVE"));
      })
      .catch((reason: Error) => setError(reason.message));
  }, []);

  async function assign(leadId: string, advisorId: string) {
    setError("");
    try {
      await api.patch(`/admin/leads/${leadId}/assign`, { advisorId: advisorId || null });
      const updated = await api.get<Lead[]>("/admin/leads");
      setLeads(updated);
    } catch (reason) {
      setError((reason as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Demandes</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Attribution aux conseillers</h1>
      </div>
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="space-y-3">
        {leads.map((lead) => (
          <article key={lead.id} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{lead.status.replaceAll("_", " ")} · {new Date(lead.createdAt).toLocaleDateString("fr-FR")}</p>
              <h2 className="mt-1 font-semibold text-slate-900">{lead.subject || lead.serviceName || "Demande de contact"}</h2>
              <p className="mt-1 text-sm text-slate-600">{lead.fullName || "Contact"} · {lead.email || "Email non renseigné"}</p>
              {lead.message && <p className="mt-2 line-clamp-2 text-sm text-slate-500">{lead.message}</p>}
            </div>
            <label className="text-sm font-medium text-slate-700">Conseiller
              <select value={lead.advisorId ?? ""} onChange={(event) => assign(lead.id, event.target.value)} className="mt-1.5 block min-w-56 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                <option value="">Non attribuée</option>
                {advisors.map((advisor) => <option key={advisor.id} value={advisor.id}>{advisor.firstName} {advisor.lastName}</option>)}
              </select>
            </label>
          </article>
        ))}
        {leads.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">Aucune demande reçue.</p>}
      </div>
    </div>
  );
}