"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { showToast } from "@/lib/toast";
import { Service } from "@/lib/data";

export default function QuickRequestForm({ service }: { service: Service }) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const values = new FormData(form);
    setError("");
    setSubmitting(true);
    try {
      await apiRequest("/leads", {
        method: "POST",
        body: JSON.stringify({
          fullName: values.get("fullName"),
          email: values.get("email"),
          message: values.get("message"),
          serviceName: service.name,
          subject: service.name,
          source: "QUICK_REQUEST",
        }),
      });
      form.reset();
      showToast("Demande envoyée — un conseiller GPI vous contacte sous 24h ✓");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Envoi de la demande impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card">
      <h3 className="mb-4 text-[17px]">Demande rapide — {service.name}</h3>
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-3.5">
        <div className="field">
          <label>Nom complet <span style={{ color: "var(--ruby)" }}>*</span></label>
          <input name="fullName" required placeholder="Ex. Awa Diallo" />
        </div>
        <div className="field">
          <label>Email <span style={{ color: "var(--ruby)" }}>*</span></label>
          <input name="email" type="email" required placeholder="vous@email.com" />
        </div>
        <div className="field">
          <label>Message (optionnel)</label>
          <textarea name="message" placeholder="Précisez votre situation..." />
        </div>
        <button className="btn btn-primary w-full" type="submit" disabled={submitting}>{submitting ? "Envoi…" : "Envoyer la demande"}</button>
        <p className="text-xs" style={{ color: "var(--slate-light)" }}>Un conseiller GPI vous répond sous 24h ouvrées.</p>
      </form>
    </div>
  );
}
