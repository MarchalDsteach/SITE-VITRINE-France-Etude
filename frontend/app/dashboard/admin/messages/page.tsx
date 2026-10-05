"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, InboxMessage, StudentProfile } from "@/lib/api";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [users, setUsers] = useState<StudentProfile[]>([]);
  const [recipientId, setRecipientId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const [messagesData, usersData] = await Promise.all([
        api.get<InboxMessage[]>("/admin/messages"),
        api.get<StudentProfile[]>("/admin/users"),
      ]);
      setMessages(messagesData);
      setUsers(usersData.filter((user) => user.role === "STUDENT"));
      setRecipientId((current) => current || usersData.find((user) => user.role === "STUDENT")?.id || "");
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let current = true;
    Promise.all([api.get<InboxMessage[]>("/admin/messages"), api.get<StudentProfile[]>("/admin/users")])
      .then(([messagesData, usersData]) => {
        if (!current) return;
        setMessages(messagesData);
        const students = usersData.filter((user) => user.role === "STUDENT");
        setUsers(students);
        setRecipientId(students[0]?.id ?? "");
      })
      .catch((reason: Error) => { if (current) setError(reason.message); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, []);

  async function send(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      await api.post(`/admin/users/${recipientId}/messages`, { subject, body });
      setSubject("");
      setBody("");
      setNotice("Message envoyé.");
      await load();
    } catch (reason) {
      setError((reason as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Messages</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Centre de communication</h1>
      </div>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</p>}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Nouveau message</h2>
        <form onSubmit={send} className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Étudiant
            <select required value={recipientId} onChange={(event) => setRecipientId(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3">
              <option value="">Choisir un étudiant</option>
              {users.map((user) => <option key={user.id} value={user.id}>{user.firstName} {user.lastName} · {user.email}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">Objet
            <input required maxLength={160} value={subject} onChange={(event) => setSubject(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3" />
          </label>
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">Message
            <textarea required maxLength={10000} rows={4} value={body} onChange={(event) => setBody(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3" />
          </label>
          <button disabled={!recipientId} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 sm:col-span-2 sm:justify-self-start">Envoyer</button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Historique</h2>
        {loading ? <p className="text-sm text-slate-500">Chargement des messages…</p> : messages.length === 0 ? <p className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">Aucun message enregistré.</p> : messages.map((message) => (
          <article key={message.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">{message.sender?.firstName} {message.sender?.lastName} → {message.recipient?.firstName} {message.recipient?.lastName}</p>
                <h3 className="mt-1 font-semibold text-slate-900">{message.subject}</h3>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${message.isRead ? "bg-slate-100 text-slate-600" : "bg-amber-100 text-amber-800"}`}>{message.isRead ? "Lu" : "Non lu"}</span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{message.body}</p>
            <p className="mt-3 text-xs text-slate-400">{new Date(message.createdAt).toLocaleString("fr-FR")}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
