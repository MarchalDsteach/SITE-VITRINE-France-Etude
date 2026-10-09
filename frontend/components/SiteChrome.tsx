"use client";

import { usePathname } from "next/navigation";
import CursorGlow from "@/components/CursorGlow";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollProgress from "@/components/ScrollProgress";

const standaloneRoutes = [
  "/dashboard",
  "/gestion",
  "/login",
  "/register",
  "/reset-password",
  "/verify-email",
  "/espace",
  "/conseiller",
];

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStandalone = standaloneRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isStandalone) return children;

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <CursorGlow />
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
