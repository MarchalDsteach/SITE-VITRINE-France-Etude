"use client";

import { useEffect, useRef, useState } from "react";
import { STATS } from "@/lib/data";

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const step = Math.max(1, Math.round(target / 40));
          let cur = 0;
          const id = setInterval(() => {
            cur += step;
            if (cur >= target) {
              cur = target;
              clearInterval(id);
            }
            setValue(cur);
          }, 22);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="block font-display text-[30px] text-white">
      {value}
      {suffix}
    </span>
  );
}

export default function StatsStrip({ dark = true }: { dark?: boolean }) {
  return (
    <div
      className={`mt-16 grid grid-cols-2 gap-y-6 border-t pt-9 sm:grid-cols-4 ${dark ? "border-white/10" : ""}`}
    >
      {STATS.map((s) => (
        <div key={s.label}>
          <Counter target={s.value} suffix={s.suffix} />
          <span className="font-mono text-[10.5px] uppercase tracking-wide text-white/55">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
