export default function MarqueeStrip({
  settings,
}: {
  settings: Record<string, string>;
}) {
  const items: string[] = settings.marqueeItems
    ? JSON.parse(settings.marqueeItems)
    : [
        "New Arrivals",
        "Summer 2026",
        "Free Returns",
        "Exclusively For Her",
        "Queens Dress Collection",
      ];

  const doubled = [...items, ...items];

  return (
    <div className="bg-brand-900 py-3 overflow-hidden flex">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-brand-400 text-[10px] tracking-[0.25em] uppercase mx-8"
          >
            {item}
            <span className="ml-8 text-brand-600">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
