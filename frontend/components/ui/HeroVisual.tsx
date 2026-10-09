"use client";

function Cloud({ style }: { style: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 120 60" className="absolute" style={style}>
      <ellipse cx="30" cy="38" rx="26" ry="16" fill="rgba(255,255,255,0.14)" />
      <ellipse cx="60" cy="28" rx="30" ry="20" fill="rgba(255,255,255,0.18)" />
      <ellipse cx="90" cy="38" rx="24" ry="15" fill="rgba(255,255,255,0.14)" />
    </svg>
  );
}

function Plane({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute" style={style}>
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" style={{ transform: "rotate(-38deg)" }}>
        <path
          d="M2 16l7-2 4-9 2 1-2 8 5-1 3-4 2 1-2 5 2 2-1 2-3-1-4 3-6 1-1-2 4-3-6-1z"
          fill="var(--red-2)"
        />
      </svg>
      <svg width="90" height="34" viewBox="0 0 90 34" style={{ position: "absolute", right: 30, top: 12 }}>
        <path d="M85 4 L4 30" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="1 5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function HeroVisual() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Cloud style={{ left: "4%", top: "58%", width: 150, animation: "cloudDrift 22s linear infinite" }} />
      <Cloud style={{ left: "-10%", top: "20%", width: 110, animation: "cloudDrift 28s linear infinite 4s" }} />
      <Cloud style={{ left: "-16%", top: "78%", width: 90, animation: "cloudDrift 18s linear infinite 9s" }} />

      <Plane style={{ left: "-8%", top: "70%", animation: "planeTakeoff 9s ease-in infinite" }} />
      <Plane style={{ left: "-8%", top: "40%", animation: "planeTakeoff 11s ease-in infinite 4.5s" }} />

      <div
        className="absolute right-[8%] top-[14%] h-60 w-60 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(228,33,43,0.2) 0%, transparent 70%)",
          animation: "heroHaloPulse 5s ease-in-out infinite",
        }}
      />

      <style>{`
        @keyframes cloudDrift{
          from{ transform:translateX(0); }
          to{ transform:translateX(340px); }
        }
        @keyframes planeTakeoff{
          0%{ transform:translate(0,0); opacity:0; }
          8%{ opacity:1; }
          70%{ transform:translate(480px,-220px); opacity:1; }
          85%{ opacity:0; }
          100%{ transform:translate(480px,-220px); opacity:0; }
        }
        @keyframes heroHaloPulse{
          0%,100%{ opacity:0.6; transform:scale(1); }
          50%{ opacity:1; transform:scale(1.15); }
        }
      `}</style>
    </div>
  );
}
