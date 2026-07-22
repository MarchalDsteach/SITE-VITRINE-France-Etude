'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { applications } from '@/lib/api'

export default function DashboardEtudiant() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [dossiers, setDossiers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    if (u) setUser(JSON.parse(u))
    applications.list()
      .then(res => setDossiers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f3ee]">
      {/* Header */}
      <div className="bg-[#0f1e3c] px-6 py-4 flex items-center justify-between">
        <img src="/logo.png" alt="GPI" className="h-10 object-contain" />
        <div className="flex items-center gap-4">
          <span className="text-white/70 text-sm">
            {user?.firstName} {user?.lastName}
          </span>
          <button
            onClick={() => { localStorage.clear(); router.push('/login') }}
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Bienvenue */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#0f1e3c]">
            Bonjour, {user?.firstName} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Bienvenue sur votre espace étudiant GPI
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="text-2xl font-semibold text-[#0f1e3c]">{dossiers.length}</div>
            <div className="text-sm text-gray-500 mt-1">Dossiers créés</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="text-2xl font-semibold text-green-600">
              {dossiers.filter((d: any) => d.status === 'DELIVERED').length}
            </div>
            <div className="text-sm text-gray-500 mt-1">Dossiers livrés</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="text-2xl font-semibold text-[#C9962B]">
              {dossiers.filter((d: any) => d.status === 'PENDING').length}
            </div>
            <div className="text-sm text-gray-500 mt-1">En attente</div>
          </div>
        </div>

        {/* Mes dossiers */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-medium text-[#0f1e3c]">Mes dossiers</h2>
            <button
              onClick={() => router.push('/dashboard/etudiant/nouveau')}
              className="bg-[#C9962B] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#b8852a] transition-colors"
            >
              + Nouveau dossier
            </button>
          </div>

          {loading ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">Chargement...</div>
          ) : dossiers.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <div className="text-gray-400 text-sm mb-3">Vous n'avez pas encore de dossier</div>
              <button
                onClick={() => router.push('/dashboard/etudiant/nouveau')}
                className="text-[#C9962B] text-sm font-medium hover:underline"
              >
                Créer mon premier dossier →
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs text-gray-400 font-normal">TYPE</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-400 font-normal">STATUT</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-400 font-normal">DATE</th>
                </tr>
              </thead>
              <tbody>
                {dossiers.map((d: any) => (
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-[#0f1e3c]">{d.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        d.status === 'DELIVERED' ? 'bg-green-50 text-green-700' :
                        d.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(d.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Services disponibles */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-medium text-[#0f1e3c]">Services disponibles</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 p-6">
            {['AVI', 'ADL', 'CAMPUS_FRANCE'].map((service) => (
              <div key={service} className="border border-gray-100 rounded-xl p-4 hover:border-[#C9962B] transition-colors cursor-pointer">
                <div className="font-medium text-[#0f1e3c] text-sm mb-1">{service.replace('_', ' ')}</div>
                <div className="text-xs text-gray-400">Faire une demande</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}