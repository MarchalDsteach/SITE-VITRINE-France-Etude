import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GPI Voyages — Études et mobilité internationale",
  description: "Accompagnement étudiant pour les études, voyages et opportunités à l’international.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
