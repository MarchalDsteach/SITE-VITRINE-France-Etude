"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";

type StudentDocument = {
  id: string;
  name: string;
  size: number;
  createdAt: string;
};

type StudentApplication = {
  id: string;
  reference: string;
  type: string;
  documents: StudentDocument[];
};

export default function DocumentsPage() {
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadApplications() {
    const data = await api.get<StudentApplication[]>("/applications");
    setApplications(data);
  }

  useEffect(() => {
    api
      .get<StudentApplication[]>("/applications")
      .then(setApplications)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const applicationId = new FormData(form).get("applicationId");
    const file = (form.elements.namedItem("file") as HTMLInputElement).files?.[0];
    if (typeof applicationId !== "string" || !file) return;

    setUploading(true);
    setError("");
    setNotice("");
    const body = new FormData();
    body.append("file", file);
    try {
      await api.upload(`/applications/${applicationId}/documents`, body);
      await loadApplications();
      form.reset();
      setNotice("Document ajouté au dossier.");
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setUploading(false);
    }
  }

  const documentCount = applications.reduce((count, application) => count + application.documents.length, 0);

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">Dossiers</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-950">Mes documents</h1>
      <p className="mt-2 text-sm text-slate-600">Déposez les pièces justificatives dans le dossier correspondant.</p>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {notice && <p role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</p>}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-500">Chargement...</p>
        ) : applications.length === 0 ? (
          <p className="text-sm text-slate-500">Crée d’abord une demande pour pouvoir y ajouter des documents.</p>
        ) : (
          <form onSubmit={upload} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <label className="block text-sm font-medium text-slate-700">Dossier
              <select name="applicationId" required defaultValue="" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3">
                <option value="" disabled>Choisir un dossier</option>
                {applications.map((application) => <option key={application.id} value={application.id}>{application.reference} · {application.type.replaceAll("_", " ")}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">Fichier
              <input name="file" type="file" required accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" className="mt-1.5 block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
            </label>
            <button disabled={uploading} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{uploading ? "Envoi…" : "Déposer le fichier"}</button>
          </form>
        )}
      </div>

      <section className="mt-8 space-y-4">
        <div className="flex items-baseline justify-between gap-3"><h2 className="text-xl font-semibold text-slate-950">Fichiers déposés</h2><span className="text-sm text-slate-500">{documentCount} fichier{documentCount === 1 ? "" : "s"}</span></div>
        {applications.flatMap((application) => application.documents.map((document) => ({ ...document, reference: application.reference }))).map((document) => (
          <article key={document.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4">
            <div><p className="font-medium text-slate-900">{document.name}</p><p className="mt-1 text-xs text-slate-500">{document.reference} · {(document.size / 1024).toFixed(0)} Ko · {new Date(document.createdAt).toLocaleDateString("fr-FR")}</p></div>
          </article>
        ))}
        {!loading && documentCount === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">Aucun fichier n’a encore été déposé.</p>}
      </section>
    </div>
  );
}
