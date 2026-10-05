"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, Application } from "@/lib/api";

export default function DemandesPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Application[]>("/applications")
      .then(setApplications)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Mes demandes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Suivez le statut de vos candidatures
          </p>
        </div>
        <Link
          href="/dashboard/etudiant/nouveau"
          className="rounded-md bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2"
        >
          Nouvelle demande
        </Link>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 bg-white rounded-lg border border-slate-200 overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-slate-500">Chargement...</p>
        ) : applications.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            Aucune demande pour le moment.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Programme</th>
                <th className="text-left px-6 py-3 font-medium">Statut</th>
                <th className="text-left px-6 py-3 font-medium">Créée le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-800">{app.program}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(app.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Application["status"] }) {
  const styles: Record<Application["status"], string> = {
    DRAFT: "bg-slate-100 text-slate-700",
    SUBMITTED: "bg-blue-50 text-blue-700",
    IN_REVIEW: "bg-amber-50 text-amber-700",
    ACCEPTED: "bg-green-50 text-green-700",
    REJECTED: "bg-red-50 text-red-700",
  };
  const labels: Record<Application["status"], string> = {
    DRAFT: "Brouillon",
    SUBMITTED: "Envoyée",
    IN_REVIEW: "En révision",
    ACCEPTED: "Acceptée",
    REJECTED: "Refusée",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
