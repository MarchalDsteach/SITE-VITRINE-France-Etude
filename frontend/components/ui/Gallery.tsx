"use client";

import { useState } from "react";
import Image from "next/image";
import { GalleryPhoto } from "@/lib/data";

const SPANS = [
  "sm:col-span-2 sm:row-span-2",
  "",
  "",
  "sm:row-span-2",
  "",
  "sm:col-span-2",
  "",
  "",
];

export default function Gallery({ images }: { images: GalleryPhoto[] }) {
  const [open, setOpen] = useState<GalleryPhoto | null>(null);

  return (
    <>
      <div className="mt-9 grid grid-cols-2 gap-3 sm:auto-rows-[140px] sm:grid-cols-4">
        {images.map((img, i) => (
          <div
            key={img.src}
            onClick={() => setOpen(img)}
            className={`group cursor-pointer overflow-hidden rounded-[14px] aspect-square sm:aspect-auto ${SPANS[i % SPANS.length]}`}
          >
            <div className="relative h-full w-full">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="absolute bottom-3 left-3 right-3 translate-y-2 text-[12px] font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {img.alt}
              </span>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-[rgba(15,27,51,0.92)] p-8"
          onClick={() => setOpen(null)}
        >
          <button className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl text-white transition-colors hover:bg-white/20" onClick={() => setOpen(null)} aria-label="Fermer">✕</button>
          <div className="flex max-w-[min(880px,90vw)] flex-col items-center gap-3">
            <div className="relative h-[70vh] w-[min(880px,90vw)]">
              <Image src={open.src} alt={open.alt} fill className="rounded-[10px] object-contain" />
            </div>
            <p className="text-center text-[13.5px] text-white/70">{open.alt}</p>
          </div>
        </div>
      )}
    </>
  );
}
