"use client";

import { useEffect, useState } from "react";
import { api, getCurrentUser } from "@/lib/api";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "STUDENT" | "ADVISOR" | "ADMIN";
  status: "PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED";
  emailVerified: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const currentUser = getCurrentUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const loadUsers = async () => {
    try {
      const data = await api.get<User[]>("/admin/users");
      setUsers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get<User[]>("/admin/users")
      .then(setUsers)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (userId: string, status: User["status"]) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { status });
      await loadUsers();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const updateRole = async (userId: string, role: User["role"]) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role });
      await loadUsers();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const deleteUser = async (user: User) => {
    const confirmation = window.prompt(`Cette action supprimera le compte ${user.email} et ses dossiers. Saisis exactement son adresse email pour confirmer.`);
    if (confirmation !== user.email) return;
    setDeletingId(user.id);
    setError("");
    try {
      await api.delete(`/admin/users/${user.id}`);
      await loadUsers();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Utilisateurs</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Comptes et accès</h1>
      </div>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-slate-500">Chargement des utilisateurs…</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase">
              <tr>
                <th className="px-5 py-3">Nom</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Email vérifié</th>
                <th className="px-5 py-3">Rôle</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-900">{user.firstName} {user.lastName}</td>
                  <td className="px-5 py-4 text-slate-600">{user.email}</td>
                  <td className="px-5 py-4 text-slate-600">{user.emailVerified ? "Oui" : "Non"}</td>
                  <td className="px-5 py-4">
                    {currentUser?.id === user.id ? <span className="text-xs font-semibold text-slate-600">Admin connecté</span> : (
                      <select value={user.role} onChange={(event) => updateRole(user.id, event.target.value as User["role"])} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700">
                        <option value="STUDENT">Étudiant</option>
                        <option value="ADVISOR">Conseiller</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {user.status !== "ACTIVE" && <button onClick={() => updateStatus(user.id, "ACTIVE")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">Activer</button>}
                      {user.status !== "REJECTED" && <button onClick={() => updateStatus(user.id, "REJECTED")} className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600">Refuser</button>}
                      {user.status === "ACTIVE" && currentUser?.id !== user.id && <button onClick={() => updateStatus(user.id, "SUSPENDED")} className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800">Suspendre</button>}
                      {user.role !== "ADMIN" && <button disabled={deletingId === user.id} onClick={() => deleteUser(user)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">{deletingId === user.id ? "Suppression…" : "Supprimer"}</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function statusClass(status: User["status"]) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700";
    case "PENDING":
      return "bg-amber-50 text-amber-700";
    case "REJECTED":
      return "bg-red-50 text-red-700";
    default:
      return "bg-slate-200 text-slate-700";
  }
}
