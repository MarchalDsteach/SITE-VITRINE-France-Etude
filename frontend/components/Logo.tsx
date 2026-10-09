import Image from "next/image";

/**
 * Logo GPI : toujours parfaitement rond.
 * L'image `logo-round.png` est déjà détourée en cercle ; le conteneur
 * (rounded-full + overflow-hidden) garantit en plus qu'aucun bout carré ne dépasse.
 */
export default function Logo({ size = 40, ring = true }: { size?: number; ring?: boolean }) {
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-full bg-white ${
        ring ? "shadow-[0_2px_10px_rgba(0,0,0,0.35)] ring-1 ring-white/20" : ""
      }`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo-round.png"
        alt="Logo GPI — Groupe Projet International"
        width={size * 2}
        height={size * 2}
        className="h-full w-full rounded-full object-cover"
        priority
      />
    </span>
  );
}
