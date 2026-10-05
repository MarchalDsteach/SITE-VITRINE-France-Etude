"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearToken, getCurrentUser, isAuthenticated } from "@/lib/api";

const navItems = [
  { href: "/dashboard/etudiant", label: "Mon espace", icon: "⌂" },
  { href: "/dashboard/etudiant/demandes", label: "Mes démarches", icon: "◫" },
  { href: "/dashboard/etudiant/nouveau", label: "Nouvelle demande", icon: "+" },
  { href: "/dashboard/etudiant/documents", label: "Mes documents", icon: "▣" },
  { href: "/dashboard/etudiant/messages", label: "Messages", icon: "✉" },
  { href: "/dashboard/etudiant/campus-france", label: "Campus France", icon: "✦" },
  { href: "/dashboard/etudiant/paiements", label: "Paiements", icon: "€" },
];

export default function EtudiantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const router = useRouter();
  const [session, setSession] = useState({ ready: false, name: "Étudiant" });
  useEffect(() => { const user = getCurrentUser(); if (!isAuthenticated() || !user) { router.replace("/login"); return; } if (user.role === "ADMIN") { router.replace("/gestion"); return; } if (user.role === "ADVISOR") { router.replace("/dashboard/conseiller"); return; } // Session state is hydrated from localStorage after the client mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession({ ready: true, name: `${user.firstName} ${user.lastName}` }); }, [router]);
  if (!session.ready) return <div className="grid min-h-screen place-items-center bg-slate-950 text-sm text-slate-300">Préparation de votre espace…</div>;
  return <div className="min-h-screen bg-[#f7f5f1] lg:flex"><aside className="bg-slate-950 text-white lg:fixed lg:inset-y-0 lg:w-72"><div className="flex items-center justify-between border-b border-white/10 px-6 py-6"><Link href="/" className="font-bold tracking-tight"><span className="text-amber-400">GPI</span> Voyages</Link><span className="rounded-full border border-white/15 px-2 py-1 text-[10px] font-semibold tracking-wider text-slate-300">ÉTUDIANT</span></div><div className="px-4 py-6"><p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Mon parcours</p><nav className="mt-3 space-y-1">{navItems.map((item) => <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${pathname === item.href ? "bg-amber-400 text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><span className="grid size-5 place-items-center text-base">{item.icon}</span>{item.label}</Link>)}</nav><p className="mt-7 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Opportunités</p><Link href="/offres" className="mt-3 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"><span>↗</span>Offres & carrières</Link></div><div className="border-t border-white/10 px-6 py-5 lg:absolute lg:bottom-0 lg:w-full"><Link href="/dashboard/etudiant/profil" className="block truncate text-sm font-semibold text-white">{session.name}</Link><button onClick={() => { clearToken(); router.push("/login"); }} className="mt-2 text-xs text-slate-400 hover:text-amber-300">Se déconnecter</button></div></aside><main className="min-w-0 flex-1 p-5 sm:p-8 lg:ml-72 lg:p-10">{children}</main></div>;
}
