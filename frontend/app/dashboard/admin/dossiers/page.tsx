"use client";

import { useEffect, useState } from "react";
import { api, Application, downloadFile, getApplicationTitle } from "@/lib/api";

type AdminApplication = Application & {
  documents: { id: string; name: string; createdAt: string; size: number }[];
  user: { id: string; firstName: string; lastName: string; email: string };
};

const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  SUBMITTED: "Soumise",
  PAYMENT_PENDING: "Paiement attendu",
  PAID: "Payée",
  IN_REVIEW: "En cours d’étude",
  APPROVED: "Validée",
  DELIVERED: "Terminée",
  REJECTED: "Refusée",
  CANCELLED: "Annulée",
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<AdminApplication[]>("/admin/applications")
      .then(setApplications)
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  async function download(document: AdminApplication["documents"][number]) {
    setError("");
    try {
      await downloadFile(`/admin/documents/${document.id}/download`, document.name);
    } catch (reason) {
      setError((reason as Error).message);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Dossiers étudiants</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Suivi et pièces jointes</h1>
        <p className="mt-2 text-sm text-slate-600">Consulte les demandes et télécharge les documents déposés par les étudiants.</p>
      </header>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="space-y-4">
        {loading ? <p className="py-8 text-sm text-slate-500">Chargement des dossiers…</p> : applications.map((application) => (
          <article key={application.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{application.reference} · {new Date(application.createdAt).toLocaleDateString("fr-FR")}</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-950">{getApplicationTitle(application)}</h2>
                <p className="mt-1 text-sm text-slate-600">{application.user.firstName} {application.user.lastName} · {application.user.email}</p>
              </div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">{statusLabels[application.status] ?? application.status}</span>
            </div>

            <section className="mt-5 border-t border-slate-100 pt-4">
              <h3 className="text-sm font-semibold text-slate-800">Documents ({application.documents.length})</h3>
              {application.documents.length === 0 ? <p className="mt-2 text-sm text-slate-500">Aucune pièce jointe reçue.</p> : (
                <ul className="mt-2 divide-y divide-slate-100">
                  {application.documents.map((document) => (
                    <li key={document.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{document.name}</p>
                        <p className="text-xs text-slate-500">{(document.size / 1024).toFixed(0)} Ko · {new Date(document.createdAt).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <button onClick={() => void download(document)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Télécharger</button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </article>
        ))}
        {!loading && applications.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-8 text-sm text-slate-500">Aucun dossier étudiant enregistré.</p>}
      </div>
    </div>
  );
}
