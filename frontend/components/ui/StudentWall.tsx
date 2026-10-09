import Link from "next/link";
import Image from "next/image";
import { GalleryPhoto } from "@/lib/data";

type Placement = {
  className: string;
  rotate: number;
  z: number;
};

const LAYOUT: Placement[] = [
  { className: "left-[2%] top-[6%] w-[30%] sm:w-[19%] aspect-[4/5]", rotate: -6, z: 3 },
  { className: "left-[24%] top-[0%] w-[26%] sm:w-[16%] aspect-square", rotate: 4, z: 2 },
  { className: "left-[42%] top-[14%] w-[28%] sm:w-[18%] aspect-[4/5]", rotate: -3, z: 4 },
  { className: "right-[20%] top-[2%] w-[27%] sm:w-[17%] aspect-square", rotate: 7, z: 2 },
  { className: "right-[1%] top-[16%] w-[28%] sm:w-[18%] aspect-[4/5]", rotate: -5, z: 3 },
  { className: "left-[10%] bottom-[3%] w-[26%] sm:w-[16%] aspect-square", rotate: 5, z: 2 },
  { className: "right-[9%] bottom-[0%] w-[27%] sm:w-[17%] aspect-[4/5]", rotate: -4, z: 3 },
];

export default function StudentWall({ photos }: { photos: GalleryPhoto[] }) {
  const picks = photos.slice(0, LAYOUT.length);

  return (
    <section className="relative overflow-hidden" style={{ background: "var(--ink-3)" }}>
      <div className="relative h-[420px] sm:h-[520px]">
        {picks.map((p, i) => {
          const pl = LAYOUT[i];
          return (
            <div
              key={p.src}
              className={`absolute overflow-hidden rounded-[14px] shadow-[0_20px_40px_-14px_rgba(0,0,0,0.6)] ring-4 ring-[rgba(251,248,242,0.06)] transition-transform duration-500 hover:!scale-[1.06] hover:!rotate-0 ${pl.className}`}
              style={{ transform: `rotate(${pl.rotate}deg)`, zIndex: pl.z }}
            >
              <Image src={p.src} alt={p.alt} fill sizes="220px" className="object-cover" />
            </div>
          );
        })}

        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(60% 60% at 50% 50%, rgba(10,18,36,0.35) 0%, var(--ink-3) 88%)" }}
        />

        <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
          <div className="glass max-w-[480px] rounded-[20px] p-7 sm:p-9">
            <span className="kicker justify-center" style={{ color: "var(--red-2)" }}>Notre communauté</span>
            <h2 className="mt-3 text-[clamp(22px,3vw,32px)] text-white">
              Des centaines d&apos;étudiants africains, une même réussite
            </h2>
            <p className="mt-3 text-[14.5px] text-white/65">
              Découvrez les visages et les histoires de ceux qui ont concrétisé leur projet d&apos;études en France avec GPI.
            </p>
            <Link href="/mediatheque" className="btn btn-primary btn-sm mt-5 inline-flex">Voir la médiathèque</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
