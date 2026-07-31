"use client";

import { useRef, useState } from "react";
import { Testimonial } from "@/lib/data";

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function Testimonials({ items }: { items: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  function move(dir: number) {
    const track = trackRef.current;
    if (!track || !track.firstElementChild) return;
    const cardWidth = (track.firstElementChild as HTMLElement).offsetWidth + 20;
    const maxIndex = Math.max(0, items.length - Math.floor(track.parentElement!.offsetWidth / cardWidth));
    const next = Math.min(Math.max(0, index + dir), maxIndex);
    setIndex(next);
    track.style.transform = `translateX(-${next * cardWidth}px)`;
  }

  return (
    <>
      <div className="relative mt-10 overflow-hidden">
        <div ref={trackRef} className="flex gap-5 transition-transform duration-500">
          {items.map((t) => (
            <div key={t.nom} className="card w-[320px] flex-none sm:w-[320px]">
              <div className="mb-3 text-sm" style={{ color: "var(--red)" }}>{"★".repeat(t.note)}</div>
              <p className="mb-4 text-[14.5px]" style={{ color: "var(--slate)" }}>&quot;{t.texte}&quot;</p>
              <div className="flex items-center gap-2.5">
                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-ink font-display text-sm font-bold" style={{ color: "var(--red-2)" }}>
                  {initials(t.nom)}
                </div>
                <div>
                  <b className="block text-[13.5px]">{t.nom}</b>
                  <span className="text-[11.5px]" style={{ color: "var(--slate-light)" }}>{t.role} · {t.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5.5 flex gap-2.5">
        <button onClick={() => move(-1)} className="flex h-[38px] w-[38px] items-center justify-center rounded-full border hover:bg-paper2" style={{ borderColor: "var(--line)" }} aria-label="Précédent">←</button>
        <button onClick={() => move(1)} className="flex h-[38px] w-[38px] items-center justify-center rounded-full border hover:bg-paper2" style={{ borderColor: "var(--line)" }} aria-label="Suivant">→</button>
      </div>
    </>
  );
}
