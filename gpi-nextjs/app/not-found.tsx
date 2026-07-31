import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-24">
      <div className="container-gpi text-center">
        <span className="eyebrow justify-center">Erreur 404</span>
        <h1 className="mt-3.5">Cette page a quitté le tarmac</h1>
        <p className="mx-auto my-4 max-w-[420px]" style={{ color: "var(--slate)" }}>
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link href="/" className="btn btn-primary">Retour à l&apos;accueil</Link>
      </div>
    </section>
  );
}
