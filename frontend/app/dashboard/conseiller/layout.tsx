"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearToken, getCurrentUser, isAuthenticated } from "@/lib/api";

const links = [
  { href: "/dashboard/conseiller", label: "Vue d’ensemble" },
  { href: "/dashboard/conseiller/agenda", label: "Agenda" },
  { href: "/dashboard/conseiller/etudiants", label: "Étudiants" },
  { href: "/dashboard/conseiller/messages", label: "Messages" },
];

export default function ConseillerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState({ ready: false, name: "Conseiller" });

  useEffect(() => {
    const user = getCurrentUser();
    if (!isAuthenticated() || !user || !["ADVISOR", "ADMIN"].includes(user.role ?? "")) {
      router.replace(user?.role === "ADMIN" ? "/gestion" : "/login");
      return;
    }
    // Session state is hydrated from localStorage after the client mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession({ ready: true, name: `${user.firstName} ${user.lastName}` });
  }, [router]);

  if (!session.ready) return <div className="grid min-h-screen place-items-center bg-slate-950 text-slate-300">Préparation de votre espace…</div>;

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="w-full bg-[#111827] text-white lg:min-h-screen lg:w-72">
        <div className="border-b border-white/10 px-7 py-7">
          <div className="flex items-center gap-3">
            <Image src="/logo.png.jpeg" alt="Logo GPI" width={42} height={42} className="rounded-full bg-white object-contain" />
            <div><p className="text-lg font-black tracking-tight">GPI</p><p className="mt-1 text-sm text-slate-400">Espace conseiller</p></div>
          </div>
        </div>

        <nav className="space-y-1 px-4 py-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${pathname === link.href ? "bg-cyan-400 text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 px-7 py-5 text-sm text-slate-400 lg:absolute lg:bottom-0 lg:w-72">
          <p className="truncate font-semibold text-white">{session.name}</p>
          <button onClick={() => { clearToken(); router.push("/login"); }} className="mt-3 text-slate-400 hover:text-white">Se déconnecter</button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
