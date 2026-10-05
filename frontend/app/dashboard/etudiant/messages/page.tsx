"use client";

import { useEffect, useState } from "react";
import { api, InboxMessage } from "@/lib/api";

export default function StudentMessagesPage() {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setMessages(await api.get<InboxMessage[]>("/auth/messages"));
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    api.get<InboxMessage[]>("/auth/messages")
      .then(setMessages)
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  async function markRead(id: string) {
    try {
      await api.patch(`/auth/messages/${id}/read`);
      await load();
    } catch (reason) {
      setError((reason as Error).message);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">Messages</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Vos échanges avec l’équipe</h1>
      </div>
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {loading ? <p className="py-8 text-sm text-slate-500">Chargement des messages…</p> : messages.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">Aucun message pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <article key={message.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{message.sender?.firstName} {message.sender?.lastName}</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">{message.subject}</h2>
                </div>
                {!message.isRead && <button onClick={() => markRead(message.id)} className="text-sm font-semibold text-amber-800">Marquer comme lu</button>}
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{message.body}</p>
              <p className="mt-3 text-xs text-slate-400">{new Date(message.createdAt).toLocaleString("fr-FR")}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}