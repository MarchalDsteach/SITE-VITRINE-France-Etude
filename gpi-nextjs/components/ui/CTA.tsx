import Link from "next/link";

export default function CTA({
  title,
  text,
  label,
  href,
}: {
  title: string;
  text: string;
  label: string;
  href: string;
}) {
  return (
    <div className="relative flex flex-wrap items-center justify-between gap-7 overflow-hidden rounded-[20px] bg-ink p-10 text-white sm:p-13">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(251,248,242,0.07) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative">
        <h3 className="text-[26px] text-white">{title}</h3>
        <p className="mt-2 max-w-[420px] text-white/65">{text}</p>
      </div>
      <div className="relative">
        <Link href={href} className="btn btn-primary">{label}</Link>
      </div>
    </div>
  );
}
