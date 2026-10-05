"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { auth } from "@/lib/api";

export default function VerifyEmailPage() {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center bg-slate-950 p-5 text-slate-300">Vérification…</main>}><VerifyEmailContent /></Suspense>;
}

function VerifyEmailContent() {
  const token = useSearchParams().get("token") ?? "";
  const [message, setMessage] = useState("Vérification de votre lien…");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }
    auth.verifyEmail(token)
      .then((response) => setMessage(response.message))
      .catch((reason: Error) => setError(reason.message));
  }, [token]);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-5">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.18em] text-amber-700">Vérification email</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">{error ? "Lien invalide" : "Adresse email"}</h1>
        <p role={error || !token ? "alert" : "status"} className={`mt-4 text-sm leading-6 ${error || !token ? "text-red-700" : "text-slate-600"}`}>
          {error || (!token ? "Le lien de vérification est incomplet." : message)}
        </p>
        <Link href="/login" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Aller à la connexion</Link>
      </section>
    </main>
  );
}