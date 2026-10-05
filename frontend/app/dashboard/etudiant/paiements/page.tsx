"use client";

import { useEffect, useState } from "react";
import { api, type Application } from "@/lib/api";

type Payment = {
  id: string;
  applicationId: string;
  amount: number;
  currency: string;
  provider: string;
  status: "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";
  createdAt: string;
};

export default function PaiementsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [amount, setAmount] = useState(149);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [applicationsResponse, paymentsResponse] = await Promise.all([
          api.get<Application[]>("/applications"),
          api.get<Payment[]>("/payments"),
        ]);

        setApplications(applicationsResponse);
        setPayments(paymentsResponse);

        if (applicationsResponse[0]) {
          setSelectedApplicationId(applicationsResponse[0].id);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedApplicationId) {
      setError("Sélectionnez d’abord un dossier à payer.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await api.post("/payments", {
        applicationId: selectedApplicationId,
        amount: Number(amount),
        currency: "EUR",
        provider: "manual",
        description: "Frais de dossier",
      });

      const nextPayments = await api.get<Payment[]>("/payments");
      setPayments(nextPayments);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Paiements</h1>
        <p className="mt-1 text-sm text-slate-500">Régler les frais de dossier ou les services demandés.</p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Dossier</label>
            <select
              value={selectedApplicationId}
              onChange={(event) => setSelectedApplicationId(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
            >
              {applications.length === 0 ? (
                <option value="">Aucun dossier disponible</option>
              ) : (
                applications.map((application) => (
                  <option key={application.id} value={application.id}>
                    {application.reference || application.type}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Montant</label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="text-sm text-slate-500">Montant estimé : {Number(amount || 0).toFixed(2)} €</div>
          <button
            type="submit"
            disabled={submitting || loading || applications.length === 0}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting ? "Paiement en cours..." : "Payer"}
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Historique</h2>
        </div>

        {loading ? (
          <p className="p-5 text-sm text-slate-500">Chargement...</p>
        ) : payments.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">Aucun paiement enregistré pour le moment.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Dossier</th>
                <th className="px-5 py-3 font-medium">Montant</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 text-slate-800">{payment.applicationId}</td>
                  <td className="px-5 py-3 text-slate-800">{payment.amount} {payment.currency}</td>
                  <td className="px-5 py-3"><PaymentBadge status={payment.status} /></td>
                  <td className="px-5 py-3 text-slate-500">{new Date(payment.createdAt).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function PaymentBadge({ status }: { status: Payment["status"] }) {
  const styles: Record<Payment["status"], string> = {
    PENDING: "bg-amber-50 text-amber-700",
    SUCCEEDED: "bg-green-50 text-green-700",
    FAILED: "bg-red-50 text-red-700",
    REFUNDED: "bg-slate-200 text-slate-700",
  };

  const labels: Record<Payment["status"], string> = {
    PENDING: "En attente",
    SUCCEEDED: "Payé",
    FAILED: "Échoué",
    REFUNDED: "Remboursé",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
