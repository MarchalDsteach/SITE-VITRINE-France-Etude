export default function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-2" style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}>
      <div className="marquee-track flex w-max gap-4">
        {doubled.map((p, i) => (
          <div
            key={p + i}
            className="flex min-w-[170px] items-center justify-center rounded-[12px] border bg-white px-6 py-4 font-display text-[15px] font-semibold transition-colors hover:border-transparent hover:shadow-gpi"
            style={{ borderColor: "var(--line)", color: "var(--slate)" }}
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}
