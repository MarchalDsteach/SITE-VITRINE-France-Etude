"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { auth } from "@/lib/api";

export default function ResetPasswordPage() {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center bg-slate-950 p-5 text-slate-300">Chargement…</main>}><ResetPasswordForm /></Suspense>;
}

function ResetPasswordForm() {
  const token = useSearchParams().get("token") ?? "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      if (token) {
        if (password !== confirmation) throw new Error("Les mots de passe ne correspondent pas.");
        const response = await auth.resetPassword(token, password);
        setMessage(response.message);
        setCompleted(true);
      } else {
        const response = await auth.forgotPassword(email);
        setMessage(response.message);
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "La demande n’a pas abouti.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-5">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.18em] text-amber-700">Sécurité</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">{completed ? "Mot de passe modifié" : token ? "Choisir un nouveau mot de passe" : "Mot de passe oublié"}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{token ? "Choisissez un nouveau mot de passe pour votre compte." : "Nous vous enverrons un lien de réinitialisation si un compte correspond à cette adresse."}</p>
        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {message && <p role="status" className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}

        {!completed && <form onSubmit={submit} className="mt-6 space-y-4">
          {!token ? (
            <label className="block text-sm font-medium text-slate-700">
              Adresse email
              <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100" />
            </label>
          ) : (
            <>
              <label className="block text-sm font-medium text-slate-700">
                Nouveau mot de passe
                <input type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Confirmer le mot de passe
                <input type="password" minLength={8} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100" />
              </label>
            </>
          )}
          <button disabled={loading} className="w-full rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white disabled:opacity-60">
            {loading ? "Envoi…" : token ? "Réinitialiser le mot de passe" : "Envoyer le lien"}
          </button>
        </form>}
        <Link href="/login" className="mt-5 inline-block text-sm font-semibold text-amber-700">Retour à la connexion</Link>
      </div>
    </main>
  );
}
