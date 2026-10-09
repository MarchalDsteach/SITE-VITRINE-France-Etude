import Image from "next/image";

export default function ImpactBanner() {
  return (
    <section className="relative isolate overflow-hidden py-28 sm:py-36">
      <Image
        src="https://images.pexels.com/photos/16255363/pexels-photo-16255363.jpeg?auto=compress&cs=tinysrgb&w=1600"
        alt="Étudiants célébrant leur réussite académique"
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority={false}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(10,18,36,0.88) 0%, rgba(15,27,51,0.75) 45%, rgba(181,21,29,0.55) 100%)" }}
      />
      <div className="grain absolute inset-0 opacity-40" />

      <div className="container-gpi relative text-center">
        <span className="kicker justify-center" style={{ color: "var(--red-2)" }}>Notre impact</span>
        <h2 className="mx-auto mt-3 max-w-[720px] text-[clamp(26px,4.2vw,44px)] text-white">
          Plus de 1000 étudiants ont concrétisé leur rêve d&apos;études en France grâce à GPI
        </h2>
        <div className="mx-auto mt-10 grid max-w-[720px] grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            ["1000+", "Étudiants accompagnés"],
            ["98%", "Dossiers acceptés"],
            ["10+", "Écoles partenaires"],
            ["8", "Pays couverts"],
          ].map(([num, label]) => (
            <div key={label}>
              <div className="font-display text-[28px] text-white">{num}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-white/60">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
