export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center gap-4">
      <p className="font-serif text-2xl text-brand-700 tracking-widest">
        Queens Dress Collection
      </p>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
``;
