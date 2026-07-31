import PageHero from "@/components/ui/PageHero";
import CTA from "@/components/ui/CTA";
import StatsStrip from "@/components/ui/StatsStrip";

export default function AboutPage() {
  return (
    <>
      <PageHero crumb="À propos" eyebrow="Notre mission" title="Relier l'Afrique à l'Europe par l'éducation" />

      <section className="py-24">
        <div className="container-gpi grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Mot du promoteur</span>
            <h2 className="mt-3 text-[28px]">
              Rendre les études supérieures en Europe accessibles à chaque étudiant ambitieux
            </h2>
            <p className="mt-4" style={{ color: "var(--slate)" }}>
              Chers étudiants, bienvenue sur GPI. Depuis notre création, nous accompagnons des milliers d&apos;étudiants dans leurs démarches administratives. Chaque dossier bénéficie d&apos;un suivi rigoureux et personnalisé, de la première demande d&apos;attestation jusqu&apos;à l&apos;installation en France.
            </p>
            <p className="mt-3" style={{ color: "var(--slate)" }}>
              L&apos;éducation transforme des vies. C&apos;est notre conviction et notre engagement quotidien.
            </p>
            <div className="mt-5.5 flex items-center gap-2.5">
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-ink font-display text-[17px] font-bold" style={{ color: "var(--red-2)" }}>
                GP
              </div>
              <div>
                <b className="block text-[15px]">Équipe GPI</b>
                <span className="text-[12.5px]" style={{ color: "var(--slate-light)" }}>Fondateurs &amp; promoteurs</span>
              </div>
            </div>
          </div>
          <div className="rounded-[18px] bg-ink p-8.5">
            <StatsStrip />
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: "var(--paper-2)" }}>
        <div className="container-gpi">
          <div className="mb-2 max-w-[620px]">
            <span className="eyebrow">Valeurs</span>
            <h2 className="mt-3 text-[28px]">Ce qui nous guide</h2>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[11px] bg-ink text-[19px]">🤝</div>
              <h3 className="mb-2 text-lg">Confiance</h3>
              <p className="text-sm" style={{ color: "var(--slate)" }}>Un suivi transparent, des références vérifiables, un interlocuteur unique à chaque étape.</p>
            </div>
            <div className="card">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[11px] bg-ink text-[19px]">⚡</div>
              <h3 className="mb-2 text-lg">Réactivité</h3>
              <p className="text-sm" style={{ color: "var(--slate)" }}>Des délais annoncés et tenus, du dépôt du dossier jusqu&apos;à la délivrance de l&apos;attestation.</p>
            </div>
            <div className="card">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[11px] bg-ink text-[19px]">🌍</div>
              <h3 className="mb-2 text-lg">Ouverture</h3>
              <p className="text-sm" style={{ color: "var(--slate)" }}>Une équipe qui connaît aussi bien les réalités africaines que les exigences administratives françaises.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-gpi">
          <CTA title="Une question sur votre projet d'études ?" text="Notre équipe vous répond sous 24h ouvrées." label="Nous contacter" href="/contact" />
        </div>
      </section>
    </>
  );
}
