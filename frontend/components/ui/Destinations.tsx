"use client";

type Destination = {
  name: string;
  image: string;
};

const DESTINATIONS: Destination[] = [
  { name: "France", image: "/image/France.jpg" },
  { name: "Canada", image: "/image/Canada.jpg" },
  { name: "Roumanie", image: "/image/Roumanie.jpg" },
  { name: "Espagne", image: "/image/Espagne.jpg" },
  { name: "Maroc", image: "/image/maroc.jpg" },
];

export default function Destinations() {
  return (
    <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3">
      {DESTINATIONS.map((d, i) => (
        <div
          key={d.name}
          className="group relative aspect-square overflow-hidden"
          style={{
            borderRadius:
              i % 3 === 0
                ? "42% 58% 65% 35% / 45% 40% 60% 55%"
                : i % 3 === 1
                ? "58% 42% 35% 65% / 40% 55% 45% 60%"
                : "35% 65% 55% 45% / 60% 45% 55% 40%",
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out group-hover:scale-110"
            style={{
              backgroundImage: `url('${d.image}')`,
              filter: "grayscale(0.15) saturate(1.05)",
            }}
          />
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              backgroundImage: `url('${d.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(15,27,51,0.15) 0%, rgba(15,27,51,0.55) 100%)" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-2xl font-bold uppercase tracking-wide text-white drop-shadow-lg">
              {d.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
