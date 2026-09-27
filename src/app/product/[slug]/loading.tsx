export default function ProductLoading() {
  return (
    <div className="animate-fade-in">
      <div className="border-b border-ink-900/10 bg-cream-100">
        <div className="mx-auto h-12 w-full max-w-[1400px] px-5 md:px-10" />
      </div>
      <section className="mx-auto w-full max-w-[1400px] px-5 py-10 md:px-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <div className="aspect-square w-full rounded-3xl bg-ink-900/[0.07]" />
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-xl bg-ink-900/[0.07]"
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="h-3 w-28 rounded-full bg-ink-900/10" />
            <div className="h-11 w-4/5 rounded-xl bg-ink-900/10" />
            <div className="h-4 w-3/5 rounded-full bg-ink-900/10" />
            <div className="h-16 w-2/5 rounded-lg bg-ink-900/10" />
            <div className="mt-6 h-14 w-full rounded-full bg-ink-900/10" />
            <div className="h-14 w-full rounded-full bg-ink-900/10" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-3 w-full rounded-full bg-ink-900/10"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
