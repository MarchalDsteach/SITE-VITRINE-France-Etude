"use client";

import { useState } from "react";
import { showToast } from "@/lib/toast";
import { SERVICES } from "@/lib/data";

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

type Tab = "apercu" | "avi" | "adl" | "notifs";

export default function Dashboard() {
  const [user, setUser] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("apercu");

  function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const name = email.split("@")[0].replace(/[.\-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    setUser(name);
    setTab("apercu");
    showToast(`Connexion réussie, bienvenue ${name} ✓`);
  }

  function quickRegister() {
    setUser("Nouvel Étudiant");
    setTab("apercu");
    showToast("Compte créé avec succès ✓");
  }

  function logout() {
    setUser(null);
    showToast("Vous êtes déconnecté");
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-[400px]">
        <div className="card">
          <h3 className="mb-1.5 text-lg">Se connecter</h3>
          <p className="mb-5 text-[13px]" style={{ color: "var(--slate-light)" }}>
            Démo interface — aucune donnée réelle n&apos;est envoyée.
          </p>
          <form onSubmit={login} className="space-y-3.5">
            <div className="field">
              <label>Email</label>
              <input name="email" type="email" required placeholder="vous@email.com" />
            </div>
            <div className="field">
              <label>Mot de passe</label>
              <input type="password" required placeholder="••••••••" />
            </div>
            <button className="btn btn-primary w-full" type="submit">Se connecter</button>
          </form>
          <p className="mt-4 text-center text-xs" style={{ color: "var(--slate-light)" }}>
            Pas encore de compte ?{" "}
            <button onClick={quickRegister} className="font-semibold" style={{ color: "var(--ink)" }}>
              Créer un compte
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid overflow-hidden rounded-[14px] border bg-white lg:grid-cols-[230px_1fr]" style={{ borderColor: "var(--line)" }}>
      <div className="bg-ink p-5 text-paper">
        <div className="mb-6.5 flex items-center gap-2.5">
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/10 font-display text-sm font-bold" style={{ color: "var(--red-2)" }}>
            {initials(user)}
          </div>
          <div>
            <b className="block text-sm">{user}</b>
            <span className="text-[11.5px] text-white/50">Étudiant GPI</span>
          </div>
        </div>
        {[
          { id: "apercu" as Tab, label: "📋 Aperçu" },
          { id: "avi" as Tab, label: "✈ Demande AVI" },
          { id: "adl" as Tab, label: "🏠 Demande ADL" },
          { id: "notifs" as Tab, label: "🔔 Notifications" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`mb-1 block w-full rounded-[9px] px-3 py-2.5 text-left text-sm ${
              tab === t.id ? "font-semibold" : "text-white/72 hover:bg-white/[0.06]"
            }`}
            style={tab === t.id ? { background: "var(--red)", color: "#fff" } : undefined}
          >
            {t.label}
          </button>
        ))}
        <button onClick={logout} className="mt-5 block text-sm" style={{ color: "var(--red-2)" }}>
          ↩ Déconnexion
        </button>
      </div>

      <div className="p-8">
        {tab === "apercu" && <Apercu onNew={setTab} />}
        {tab === "avi" && <RequestForm type="avi" userName={user} onDone={() => setTab("apercu")} />}
        {tab === "adl" && <RequestForm type="adl" userName={user} onDone={() => setTab("apercu")} />}
        {tab === "notifs" && <Notifs />}
      </div>
    </div>
  );
}

function Apercu({ onNew }: { onNew: (t: Tab) => void }) {
  return (
    <div>
      <h3 className="mb-4 text-lg">Mes dossiers</h3>
      <div className="mb-4 rounded-xl border p-5" style={{ borderColor: "var(--line)" }}>
        <div className="mb-1.5 flex items-center justify-between">
          <b>Attestation de Virement (AVI)</b>
          <span className="status-pill status-done">Délivré</span>
        </div>
        <Stepper steps={["Demande", "Paiement", "Délivré"]} current={3} />
      </div>
      <div className="rounded-xl border p-5" style={{ borderColor: "var(--line)" }}>
        <div className="mb-1.5 flex items-center justify-between">
          <b>Attestation de Logement (ADL)</b>
          <span className="status-pill status-pay">Paiement</span>
        </div>
        <Stepper steps={["Demande", "Paiement", "Délivré"]} current={2} />
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button className="btn btn-primary btn-sm" onClick={() => onNew("avi")}>+ Nouvelle demande AVI</button>
        <button className="btn btn-outline btn-sm" onClick={() => onNew("adl")}>+ Nouvelle demande ADL</button>
      </div>
    </div>
  );
}

function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="mt-3.5 flex items-center">
      {steps.map((s, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div key={s} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-bold"
                style={{
                  background: done || active ? (done ? "var(--ink)" : "var(--red)") : "var(--paper-2)",
                  color: done ? "#fff" : active ? "#fff" : "var(--slate)",
                }}
              >
                {done ? "✓" : n}
              </div>
              <span className="text-[12.5px]" style={{ color: done || active ? "var(--ink)" : "var(--slate)" }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className="mx-1.5 h-px w-8" style={{ background: "var(--line)" }} />}
          </div>
        );
      })}
    </div>
  );
}

function Notifs() {
  const items = [
    { title: "Votre AVI a été validée.", time: "Il y a 2 heures" },
    { title: "Paiement ADL en attente de confirmation.", time: "Hier" },
    { title: "Nouvelle offre d'alternance correspondant à votre profil.", time: "Il y a 3 jours" },
  ];
  return (
    <div>
      <h3 className="mb-4 text-lg">Notifications</h3>
      {items.map((n) => (
        <div key={n.title} className="mb-3.5 rounded-xl border p-5" style={{ borderColor: "var(--line)" }}>
          <b>{n.title}</b>
          <p className="mt-1 text-[13px]" style={{ color: "var(--slate)" }}>{n.time}</p>
        </div>
      ))}
    </div>
  );
}

function RequestForm({ type, userName, onDone }: { type: "avi" | "adl"; userName: string; onDone: () => void }) {
  const s = SERVICES[type];
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    showToast(`Demande ${type.toUpperCase()} soumise avec succès ✓`);
    onDone();
  }
  return (
    <div>
      <h3 className="mb-1 text-lg">Nouvelle demande — {s.name}</h3>
      <p className="mb-5 text-[13px]" style={{ color: "var(--slate-light)" }}>{s.duration} · {s.price}</p>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="field">
            <label>Nom complet <span style={{ color: "var(--ruby)" }}>*</span></label>
            <input required defaultValue={userName} />
          </div>
          <div className="field">
            <label>Numéro de dossier</label>
            <input placeholder="Généré automatiquement" disabled />
          </div>
        </div>
        <div className="field">
          <label>Pièce jointe (justificatif)</label>
          <input type="file" />
        </div>
        <div className="field">
          <label>Remarque</label>
          <textarea placeholder="Précisions utiles pour le traitement..." />
        </div>
        <button className="btn btn-primary" type="submit">Soumettre la demande</button>
      </form>
    </div>
  );
}
