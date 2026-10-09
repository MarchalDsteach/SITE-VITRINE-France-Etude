"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { showToast } from "@/lib/toast";

export default function ContactForm() {
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
          subject: values.get("subject"),
          message: values.get("message"),
          source: "CONTACT_FORM",
        }),
      });
      form.reset();
      showToast("Message envoyé, merci de nous avoir contactés ✓");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Envoi du message impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card">
      <h3 className="mb-4.5 text-lg">Envoyez-nous un message</h3>
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="field">
            <label>Nom <span style={{ color: "var(--ruby)" }}>*</span></label>
            <input name="fullName" required placeholder="Votre nom" />
          </div>
          <div className="field">
            <label>Email <span style={{ color: "var(--ruby)" }}>*</span></label>
            <input name="email" type="email" required placeholder="vous@email.com" />
          </div>
        </div>
        <div className="field">
          <label>Sujet</label>
          <select name="subject">
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
          <textarea name="message" required placeholder="Décrivez votre besoin..." />
        </div>
        <button className="btn btn-primary w-full" type="submit" disabled={submitting}>{submitting ? "Envoi…" : "Envoyer le message"}</button>
      </form>
    </div>
  );
}
