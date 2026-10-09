"use client";

import { useState } from "react";

export default function VideoSection({
  youtubeId = "dQw4w9WgXcQ",
  title = "Découvrez GPI en vidéo",
}: {
  youtubeId?: string;
  title?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="relative mx-auto aspect-video w-full max-w-[900px] overflow-hidden rounded-[18px] border shadow-gpi"
      style={{ borderColor: "var(--line)" }}
    >
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 flex items-center justify-center"
          aria-label="Lancer la vidéo"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              const img = e.currentTarget;
              const fallback = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
              if (img.src !== fallback) img.src = fallback;
            }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(15,27,51,0.25) 0%, rgba(15,27,51,0.55) 100%)" }} />
          <span
            className="relative flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
            style={{ background: "linear-gradient(135deg,var(--red) 0%,var(--red-deep) 100%)", boxShadow: "var(--shadow-red)" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </button>
      )}
    </div>
  );
}
