"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, InboxMessage, Lead } from "@/lib/api";

export default function ConseillerMessagesPage() {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [recipientId, setRecipientId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    try {
      const [messageData, leadData] = await Promise.all([
        api.get<InboxMessage[]>("/auth/messages"),
        api.get<Lead[]>("/advisor/leads"),
      ]);
      setMessages(messageData);
      setLeads(leadData.filter((lead) => lead.user));
      setRecipientId((current) => current || leadData.find((lead) => lead.user)?.user?.id || "");
    } catch (reason) {
      setError((reason as Error).message);
    }
  }

  useEffect(() => {
    Promise.all([api.get<InboxMessage[]>("/auth/messages"), api.get<Lead[]>("/advisor/leads")])
      .then(([messageData, leadData]) => {
        setMessages(messageData);
        const assignedLeads = leadData.filter((lead) => lead.user);
        setLeads(assignedLeads);
        setRecipientId(assignedLeads[0]?.user?.id ?? "");
      })
      .catch((reason: Error) => setError(reason.message));
  }, []);

  async function send(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      await api.post(`/advisor/students/${recipientId}/messages`, { subject, body });
      setSubject("");
      setBody("");
      setNotice("Message envoyé.");
      await load();
    } catch (reason) {
      setError((reason as Error).message);
    }
  }

  async function markRead(messageId: string) {
    try {
      await api.patch(`/auth/messages/${messageId}/read`);
      await load();
    } catch (reason) {
      setError((reason as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">Messages</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Boîte de réception</h1>
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</p>}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Écrire à un étudiant suivi</h2>
        <form onSubmit={send} className="mt-4 grid gap-4">
          <select required value={recipientId} onChange={(event) => setRecipientId(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-3 text-sm">
            <option value="">Choisir un étudiant</option>
            {leads.map((lead) => <option key={lead.id} value={lead.user!.id}>{lead.user!.firstName} {lead.user!.lastName} · {lead.user!.email}</option>)}
          </select>
          <input required maxLength={160} value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Objet" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
          <textarea required maxLength={10000} rows={4} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Votre message" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
          <button disabled={!recipientId} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 sm:justify-self-start">Envoyer</button>
        </form>
      </section>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Boîte de réception</h2>
        {messages.map((message) => (
          <article key={message.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{message.sender?.firstName} {message.sender?.lastName}</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">{message.subject}</h2>
              </div>
              {!message.isRead && <button onClick={() => markRead(message.id)} className="text-xs font-semibold text-cyan-800">Marquer comme lu</button>}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{message.body}</p>
            <p className="mt-3 text-xs text-slate-400">{new Date(message.createdAt).toLocaleString("fr-FR")}</p>
          </article>
        ))}
        {messages.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">Aucun message reçu.</p>}
      </div>
    </div>
  );
}
