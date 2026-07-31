"use client";

import { useState } from "react";
import Image from "next/image";

export default function Gallery({ images }: { images: string[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((src, i) => (
          <div
            key={src}
            onClick={() => setOpen(src)}
            className="group aspect-square cursor-pointer overflow-hidden rounded-[10px]"
          >
            <div className="relative h-full w-full">
              <Image
                src={src}
                alt={`Photo évènement GPI ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-[rgba(15,27,51,0.92)] p-8"
          onClick={() => setOpen(null)}
        >
          <button className="absolute right-8 top-6 text-2xl text-white" onClick={() => setOpen(null)} aria-label="Fermer">✕</button>
          <div className="relative h-[80vh] w-[min(880px,90vw)]">
            <Image src={open} alt="Aperçu" fill className="rounded-[10px] object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
