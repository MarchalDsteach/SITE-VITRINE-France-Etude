"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, isAuthenticated } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const user = getCurrentUser();
    if (!isAuthenticated() || !user) {
      router.replace("/login");
      return;
    }
    router.replace(user.role === "ADMIN" ? "/gestion" : "/dashboard/etudiant");
  }, [router]);
  return <main className="grid min-h-screen place-items-center bg-slate-950 text-sm text-slate-300">Ouverture de votre espace GPI…</main>;
}
