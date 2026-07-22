'use client'
import { useEffect, useState } from 'react'
import { applications } from '@/lib/api'

const statusLabel: any = {
  PENDING: { label: 'En attente', class: 'bg-amber-50 text-amber-700' },
  PROCESSING: { label: 'En cours', class: 'bg-blue-50 text-blue-700' },
  DELIVERED: { label: 'Livré', class: 'bg-green-50 text-green-700' },
  REJECTED: { label: 'Rejeté', class: 'bg-red-50 text-red-700' },
}

export default function DemandesPage() {
  const [dossiers, setDossiers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    applications.list()
      .then(res => setDossiers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#0f1e3c]">Mes demandes</h1>
        <p className="text-gray-400 text-sm mt-1">Suivez l'état de tous vos dossiers</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Chargement...</div>
        ) : dossiers.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">📂</div>
            <div className="text-gray-500 font-medium mb-1">Aucune demande</div>
            <div className="text-gray-400 text-sm">Vous n'avez pas encore soumis de dossier</div>
            <a href="/dashboard/etudiant/nouveau" className="mt-4 inline-block bg-[#C9962B] text-white text-sm px-5 py-2.5 rounded-lg hover:bg-[#b8852a] transition-colors">
              Créer une demande
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">TYPE</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">STATUT</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">DATE</th>
                <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {dossiers.map((d: any) => (
                <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#0f1e3c]">{d.type.replace('_', ' ')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusLabel[d.status]?.class}`}>
                      {statusLabel[d.status]?.label || d.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(d.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-[#C9962B] text-xs hover:underline">Voir détails</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}