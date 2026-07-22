'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { label: 'Tableau de bord', href: '/dashboard/etudiant', icon: '⊞' },
  { label: 'Mes demandes', href: '/dashboard/etudiant/demandes', icon: '≡' },
  { label: 'Nouvelle demande', href: '/dashboard/etudiant/nouveau', icon: '✎' },
  { label: 'Campus France', href: '/dashboard/etudiant/campus-france', icon: '🎓' },
  { label: 'Mes documents', href: '/dashboard/etudiant/documents', icon: '📄' },
  { label: 'Mes paiements', href: '/dashboard/etudiant/paiements', icon: '💳' },
  { label: 'Mon profil', href: '/dashboard/etudiant/profil', icon: '👤' },
]

const bottomItems = [
  { label: 'Site public', href: '/', icon: '🏠' },
  { label: 'Vérifier un document', href: '/verifier', icon: '🛡️' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (!token) { router.push('/login'); return }
    if (u) setUser(JSON.parse(u))
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  const initials = user ? `${user.firstName?.[0]}${user.lastName?.[0]}` : 'ET'

  return (
    <div className="min-h-screen flex bg-[#f5f3ee]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f1e3c] flex flex-col min-h-screen fixed left-0 top-0 z-10">
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <img src="/logo.png.jpeg" alt="GPI" className="h-10 object-contain brightness-0 invert" />
          Groupe de projet international
        </div>

        {/* User info */}
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C9962B] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="overflow-hidden">
            <div className="text-white text-sm font-medium truncate">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-white/40 text-xs truncate">{user?.email}</div>
          </div>
        </div>

        {/* Nav principal */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-[#C9962B] text-white font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
              </Link>
            )
          })}
        </nav>

        {/* Nav bas */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          {bottomItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <span className="text-base">→</span>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="text-sm font-semibold text-[#0f1e3c]">
              {navItems.find(i => i.href === pathname)?.label || 'Dashboard'}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              GPI — Espace étudiant
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              🔔
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#C9962B] rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#C9962B] flex items-center justify-center text-white text-xs font-semibold">
              {initials}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}