"use client";

// ⚠️ Suppose une route GET /campus-france/status côté NestJS — adapte selon ton backend.

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type CampusFranceStatus = {
  step: string;
  dossierNumber: string | null;
  updatedAt: string;
};

export default function CampusFrancePage() {
  const [status, setStatus] = useState<CampusFranceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<CampusFranceStatus>("/campus-france/status")
      .then(setStatus)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Campus France</h1>
      <p className="text-sm text-slate-500 mt-1">
        Suivi de votre dossier Campus France
      </p>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 bg-white rounded-lg border border-slate-200 p-6">
        {loading ? (
          <p className="text-sm text-slate-500">Chargement...</p>
        ) : !status ? (
          <p className="text-sm text-slate-500">
            Aucune démarche Campus France liée à votre compte.
          </p>
        ) : (
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Étape actuelle</dt>
              <dd className="text-slate-900 font-medium">{status.step}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">N° de dossier</dt>
              <dd className="text-slate-900 font-medium">
                {status.dossierNumber || "Non attribué"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Dernière mise à jour</dt>
              <dd className="text-slate-900 font-medium">
                {new Date(status.updatedAt).toLocaleDateString("fr-FR")}
              </dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
}
