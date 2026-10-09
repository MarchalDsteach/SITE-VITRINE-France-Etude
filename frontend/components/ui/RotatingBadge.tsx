export default function RotatingBadge() {
  const text = "GPI • AUTHENTIQUE • VÉRIFIÉ • ";
  return (
    <div className="pointer-events-none absolute -right-5 -top-5 z-10 h-[92px] w-[92px]">
      <div className="relative h-full w-full animate-spin" style={{ animationDuration: "14s" }}>
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {text.split("").map((c, i) => {
            const angle = (360 / text.length) * i;
            return (
              <text
                key={i}
                x="50"
                y="50"
                fill="var(--red-2)"
                fontSize="8.2"
                fontFamily="var(--font-jetbrains), monospace"
                fontWeight="600"
                textAnchor="middle"
                transform={`rotate(${angle} 50 50) translate(0 -40)`}
              >
                {c}
              </text>
            );
          })}
        </svg>
      </div>
      <div
        className="absolute inset-0 m-auto flex h-9 w-9 items-center justify-center rounded-full text-[15px]"
        style={{ background: "var(--ink)", border: "1px solid var(--red-2)" }}
      >
        ✓
      </div>
    </div>
  );
}
