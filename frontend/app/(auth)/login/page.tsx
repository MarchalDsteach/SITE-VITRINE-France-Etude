"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, setToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await auth.login(form);
      setToken(response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user.status === "PENDING") {
        throw new Error("Votre compte est en attente de validation par l’administrateur.");
      }

      router.push(response.data.user.role === "ADMIN" ? "/gestion" : response.data.user.role === "ADVISOR" ? "/dashboard/conseiller" : "/dashboard/etudiant");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Connexion impossible.");
    } finally {
      setLoading(false);
    }
  }

  async function resendVerification() {
    setResending(true);
    setError("");
    setNotice("");
    try {
      const response = await auth.resendVerification(form.email);
      setNotice(response.message);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Envoi impossible.");
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-5">
      <div className="w-full max-w-md">
        <Link href="/" className="text-sm font-semibold text-amber-400">← GPI Voyages</Link>

        <div className="mt-5 rounded-2xl bg-white p-7 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">Bienvenue</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Connexion</h1>
          <p className="mt-2 text-sm text-slate-600">Accédez à votre espace étudiant ou administrateur.</p>

          {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {notice && <p role="status" className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</p>}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Mot de passe
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </label>

            <div className="flex items-center justify-between text-sm">
              <button type="submit" disabled={loading} className="w-full rounded-xl bg-slate-950 py-3 font-semibold text-white disabled:opacity-60">
                {loading ? "Connexion…" : "Se connecter"}
              </button>
            </div>
          </form>

          <button type="button" disabled={!form.email || resending} onClick={resendVerification} className="mt-4 text-sm font-medium text-slate-500 hover:text-slate-800 disabled:opacity-50">
            {resending ? "Envoi…" : "Renvoyer un lien de vérification"}
          </button>

          <div className="mt-5 flex items-center justify-between text-sm">
            <Link href="/register" className="font-semibold text-amber-700">Créer mon compte</Link>
            <Link href="/reset-password" className="text-slate-500 hover:text-slate-700">Mot de passe oublié</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
