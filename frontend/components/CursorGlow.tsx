"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let active = false;

    function onMove(e: MouseEvent) {
      tx = e.clientX;
      ty = e.clientY;
      if (!active) {
        active = true;
        const el = ref.current;
        if (el) el.style.opacity = "1";
      }
    }

    function loop() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      const el = ref.current;
      if (el) el.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[2] h-[420px] w-[420px] rounded-full opacity-0 transition-opacity duration-500"
      style={{
        background: "radial-gradient(circle, rgba(228,33,43,0.10) 0%, rgba(228,33,43,0.04) 40%, transparent 72%)",
        mixBlendMode: "plus-lighter",
      }}
    />
  );
}
