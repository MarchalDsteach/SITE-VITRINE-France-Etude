"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type User = { firstName?: string; lastName?: string; email?: string; role?: string };
type Lead = { id: string; fullName?: string | null; email?: string | null; phone?: string | null; subject?: string | null; source: string; status: string; priority: string; message?: string | null; serviceName?: string | null; createdAt: string; advisor?: User | null; user?: User | null };
const statuses: Record<string, string> = { NEW: "Nouveau", CONTACTED: "Contacté", IN_PROGRESS: "En cours", RESOLVED: "Résolu", ARCHIVED: "Archivé" };
const sources: Record<string, string> = { CONTACT_FORM: "Contact", QUICK_REQUEST: "Demande rapide", SERVICE_REQUEST: "Service", APPLICATION: "Candidature", OTHER: "Autre" };

export default function AdvisorPage() {
  const [ready, setReady] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const token = typeof window === "undefined" ? null : window.localStorage.getItem("gpi_access_token");
  const user = typeof window === "undefined" ? null : JSON.parse(window.localStorage.getItem("gpi_user") ?? "null") as User | null;

  useEffect(() => {
    if (!token || user?.role !== "ADVISOR") { window.location.replace("/espace"); return; }
    setReady(true);
    void apiRequest<Lead[]>("/advisor/leads", { headers: { Authorization: `Bearer ${token}` } }).then(setLeads).catch((reason) => setError(reason instanceof Error ? reason.message : "Chargement impossible."));
  }, [token, user?.role]);

  async function updateLead(id: string, status: string) {
    if (!token) return;
    try { const updated = await apiRequest<Lead>(`/advisor/leads/${id}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); setLeads((items) => items.map((item) => item.id === id ? { ...item, status: updated.status } : item)); } catch (reason) { setError(reason instanceof Error ? reason.message : "Mise à jour impossible."); }
  }

  const visible = filter === "ALL" ? leads : leads.filter((lead) => lead.status === filter);
  if (!ready) return <main className="grid min-h-screen place-items-center text-sm text-slate">Vérification de votre accès conseiller...</main>;
  return <main className="min-h-screen bg-[#f4f5fa] p-5 lg:p-10"><div className="mx-auto max-w-6xl"><header className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Espace conseiller</p><h1 className="mt-2 text-3xl sm:text-4xl">Mes demandes à accompagner.</h1><p className="mt-2 text-sm text-slate">Vous traitez les demandes entrantes et suivez leur avancement.</p></div><div className="rounded-xl bg-ink px-5 py-3 text-right text-white"><b className="block">{user?.firstName} {user?.lastName}</b><span className="text-xs text-white/60">Conseiller GPI</span></div></header>{error && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<div className="mb-6 grid gap-4 sm:grid-cols-3"><Metric label="Demandes reçues" value={leads.length} /><Metric label="Nouvelles" value={leads.filter((lead) => lead.status === "NEW").length} accent /><Metric label="En cours" value={leads.filter((lead) => lead.status === "IN_PROGRESS").length} /></div><div className="mb-4 flex flex-wrap gap-2">{[["ALL", "Toutes"], ["NEW", "Nouvelles"], ["CONTACTED", "Contactées"], ["IN_PROGRESS", "En cours"], ["RESOLVED", "Résolues"]].map(([value, label]) => <button key={value} onClick={() => setFilter(value)} className={`btn btn-sm ${filter === value ? "btn-primary" : "btn-outline"}`}>{label}</button>)}</div><section className="space-y-3">{visible.length === 0 ? <div className="rounded-xl border bg-white p-10 text-center text-sm text-slate">Aucune demande dans cette catégorie.</div> : visible.map((lead) => <article key={lead.id} className="rounded-xl border bg-white p-5" style={{ borderColor: "var(--line)" }}><div className="flex flex-wrap items-start justify-between gap-4"><div><b className="text-lg">{lead.fullName ?? lead.email ?? "Demande sans nom"}</b><p className="mt-1 text-sm text-slate">{lead.email ?? "Email non renseigné"} · {lead.phone ?? "Téléphone non renseigné"}</p><p className="mt-1 text-xs text-slate-light">{sources[lead.source] ?? lead.source} · {lead.serviceName ?? "Sans service"} · {new Date(lead.createdAt).toLocaleString("fr-FR")}</p></div><select value={lead.status} onChange={(event) => void updateLead(lead.id, event.target.value)} className="rounded-lg border px-3 py-2 text-sm"><option value="NEW">Nouveau</option><option value="CONTACTED">Contacté</option><option value="IN_PROGRESS">En cours</option><option value="RESOLVED">Résolu</option><option value="ARCHIVED">Archivé</option></select></div><p className="mt-4 text-sm text-slate">{lead.message ?? "Aucun message détaillé."}</p><span className="tag tag-accent mt-4 inline-block">{statuses[lead.status] ?? lead.status}</span></article>)}</section></div></main>;
}

function Metric({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) { return <div className={`rounded-xl border p-5 ${accent ? "border-red/20 bg-red-50" : "bg-white"}`} style={{ borderColor: accent ? undefined : "var(--line)" }}><b className="block text-3xl">{value}</b><span className="mt-1 block text-sm text-slate">{label}</span></div>; }
