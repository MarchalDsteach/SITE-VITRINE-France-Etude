"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function NouvelleDemandePage() {
  const router = useRouter();
  const [program, setProgram] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ⚠️ Adapte le body pour matcher create-application.dto.ts
      await api.post("/applications", { program });
      router.push("/dashboard/etudiant/demandes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-slate-900">
        Nouvelle demande
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        Créez une nouvelle candidature
      </p>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 bg-white rounded-lg border border-slate-200 p-6 space-y-4"
      >
        <div>
          <label
            htmlFor="program"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Programme / formation visée
          </label>
          <input
            id="program"
            type="text"
            required
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            placeholder="Ex : Master Informatique - Université de Lyon"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white text-sm font-medium px-4 py-2.5"
        >
          {loading ? "Création en cours..." : "Créer la demande"}
        </button>
      </form>
    </div>
  );
}
