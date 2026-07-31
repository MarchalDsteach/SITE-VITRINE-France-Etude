import Image from "next/image";

export default function Logo({ size = 40, ring = true }: { size?: number; ring?: boolean }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full bg-white ${
        ring ? "shadow-[0_2px_10px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.06]" : ""
      }`}
      style={{ width: size, height: size }}
    >
      <span className="relative" style={{ width: size * 0.82, height: size * 0.82 }}>
        <Image
          src="/logo-icon.png"
          alt="Logo GPI — Groupe Projet International"
          fill
          sizes={`${size}px`}
          className="object-contain"
          priority
        />
      </span>
    </span>
  );
}
