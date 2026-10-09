"use client";

import { showToast } from "@/lib/toast";

export default function ContactForm() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    showToast("Message envoyé, merci de nous avoir contactés ✓");
    e.currentTarget.reset();
  }

  return (
    <div className="card">
      <h3 className="mb-4.5 text-lg">Envoyez-nous un message</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="field">
            <label>Nom <span style={{ color: "var(--ruby)" }}>*</span></label>
            <input required placeholder="Votre nom" />
          </div>
          <div className="field">
            <label>Email <span style={{ color: "var(--ruby)" }}>*</span></label>
            <input type="email" required placeholder="vous@email.com" />
          </div>
        </div>
        <div className="field">
          <label>Sujet</label>
          <select>
            <option>Question générale</option>
            <option>AVI</option>
            <option>ADL</option>
            <option>Campus France</option>
            <option>Bourses</option>
            <option>Alternance / Stage</option>
            <option>Partenariat</option>
          </select>
        </div>
        <div className="field">
          <label>Message <span style={{ color: "var(--ruby)" }}>*</span></label>
          <textarea required placeholder="Décrivez votre besoin..." />
        </div>
        <button className="btn btn-primary w-full" type="submit">Envoyer le message</button>
      </form>
    </div>
  );
}
