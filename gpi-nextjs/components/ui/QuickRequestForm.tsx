"use client";

import { showToast } from "@/lib/toast";
import { Service } from "@/lib/data";

export default function QuickRequestForm({ service }: { service: Service }) {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    showToast("Demande envoyée — un conseiller GPI vous contacte sous 24h ✓");
    e.currentTarget.reset();
  }

  return (
    <div className="card">
      <h3 className="mb-4 text-[17px]">Demande rapide — {service.name}</h3>
      <form onSubmit={onSubmit} className="space-y-3.5">
        <div className="field">
          <label>Nom complet <span style={{ color: "var(--ruby)" }}>*</span></label>
          <input required placeholder="Ex. Awa Diallo" />
        </div>
        <div className="field">
          <label>Email <span style={{ color: "var(--ruby)" }}>*</span></label>
          <input type="email" required placeholder="vous@email.com" />
        </div>
        <div className="field">
          <label>Message (optionnel)</label>
          <textarea placeholder="Précisez votre situation..." />
        </div>
        <button className="btn btn-primary w-full" type="submit">Envoyer la demande</button>
        <p className="text-xs" style={{ color: "var(--slate-light)" }}>Un conseiller GPI vous répond sous 24h ouvrées.</p>
      </form>
    </div>
  );
}
