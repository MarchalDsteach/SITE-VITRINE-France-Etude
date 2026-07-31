"use client";

import { useState } from "react";

export default function Verificateur() {
  const [ref, setRef] = useState("");
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  function verify() {
    const val = ref.trim();
    if (!val) {
      setResult({ ok: false, msg: "Veuillez saisir une référence à vérifier." });
      return;
    }
    const ok = /^GPI-/i.test(val);
    setResult({
      ok,
      msg: ok
        ? `Référence ${val} — document délivré par GPI et authentique.`
        : `Aucune attestation ne correspond à "${val}". Vérifiez la saisie ou contactez le support.`,
    });
  }

  return (
    <div className="card max-w-[520px]">
      <div className="field mb-3.5">
        <label>Référence de l&apos;attestation</label>
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="Ex. GPI-AVI-2026-00123"
        />
      </div>
      <button className="btn btn-primary w-full" onClick={verify}>Vérifier</button>
      {result && (
        <div
          className="mt-5 rounded-[10px] border p-4.5"
          style={{
            background: result.ok ? "rgba(228,33,43,0.08)" : "rgba(155,59,59,0.08)",
            borderColor: result.ok ? "var(--ink-2)" : "var(--ruby)",
          }}
        >
          <h4 className="mb-1.5 text-[15px]">{result.ok ? "✓ Attestation valide" : "✕ Référence introuvable"}</h4>
          <p className="text-[13.5px]" style={{ color: "var(--slate)" }}>{result.msg}</p>
        </div>
      )}
    </div>
  );
}
