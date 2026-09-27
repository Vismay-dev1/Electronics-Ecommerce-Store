export default function ShopLoading() {
  return (
    <div className="animate-fade-in">
      <section className="border-b border-ink-900/10 bg-cream-100">
        <div className="mx-auto w-full max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
          <div className="h-3 w-40 rounded-full bg-ink-900/10" />
          <div className="mt-6 h-10 w-72 rounded-xl bg-ink-900/10 md:h-12" />
        </div>
      </section>
      <section className="mx-auto w-full max-w-[1400px] px-5 py-10 md:px-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
          <div className="hidden flex-col gap-4 lg:flex">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-9 rounded-lg bg-ink-900/[0.07]"
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-4">
                <div className="aspect-square w-full rounded-2xl bg-ink-900/[0.07]" />
                <div className="h-3 w-1/3 rounded-full bg-ink-900/10" />
                <div className="h-5 w-3/4 rounded-lg bg-ink-900/10" />
                <div className="h-3 w-1/2 rounded-full bg-ink-900/10" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
