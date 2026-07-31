"use client";

import { useEffect, useState } from "react";

export default function Toaster() {
  const [msg, setMsg] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    function onToast(e: Event) {
      const detail = (e as CustomEvent<string>).detail;
      setMsg(detail);
      setShow(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShow(false), 3200);
    }
    window.addEventListener("gpi:toast", onToast);
    return () => {
      window.removeEventListener("gpi:toast", onToast);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[600] flex items-center gap-2.5 rounded-xl bg-ink px-5 py-3.5 text-sm text-white shadow-gpi transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0 pointer-events-none"
      }`}
    >
      <span className="font-bold" style={{ color: "var(--red-2)" }}>✓</span>
      <span>{msg}</span>
    </div>
  );
}
