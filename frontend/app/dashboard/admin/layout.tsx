"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearToken, getCurrentUser, isAuthenticated } from "@/lib/api";

const links = [
  { href: "/gestion", label: "Vue d’ensemble" },
  { href: "/gestion/utilisateurs", label: "Utilisateurs" },
  { href: "/gestion/dossiers", label: "Dossiers étudiants" },
  { href: "/gestion/demandes", label: "Demandes" },
  { href: "/gestion/messages", label: "Messages" },
  { href: "/gestion/offres", label: "Offres d’alternance" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState({ ready: false, name: "Administrateur" });

  useEffect(() => {
    const user = getCurrentUser();
    if (!isAuthenticated() || user?.role !== "ADMIN") {
      router.replace("/login");
      return;
    }
    // Session state is hydrated from localStorage after the client mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession({ ready: true, name: `${user.firstName} ${user.lastName}` });
  }, [router]);

  if (!session.ready) return <div className="grid min-h-screen place-items-center bg-slate-950 text-slate-300">Chargement de l’espace admin…</div>;

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="w-full bg-[#0f172a] text-white lg:min-h-screen lg:w-72">
        <div className="border-b border-white/10 px-7 py-7">
          <div className="flex items-center gap-3">
            <Image src="/logo.png.jpeg" alt="Logo GPI" width={42} height={42} className="rounded-full bg-white object-contain" />
            <div><p className="text-lg font-black tracking-tight">GPI</p><p className="mt-1 text-sm text-slate-400">Back-office administratif</p></div>
          </div>
        </div>

        <nav className="space-y-1 px-4 py-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${pathname === link.href ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 px-7 py-5 text-sm text-slate-400 lg:absolute lg:bottom-0 lg:w-72">
          <p className="truncate font-semibold text-white">{session.name}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-amber-300">Administrateur</p>
          <button
            onClick={() => {
              clearToken();
              router.push("/login");
            }}
            className="mt-3 text-slate-400 hover:text-white"
          >
            Se déconnecter
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
