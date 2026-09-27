export function StarRating({
  value,
  size = 14,
  className = "",
  showValue = false,
  count,
}: {
  value: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  count?: number;
}) {
  const clamped = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="flex items-center gap-0.5 text-brand-400">
        {[0, 1, 2, 3, 4].map((index) => {
          const fillLevel = Math.max(
            0,
            Math.min(1, clamped - index),
          );
          return (
            <svg
              key={index}
              viewBox="0 0 24 24"
              style={{ width: size, height: size }}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={`star-${index}-${Math.round(fillLevel * 100)}`}>
                  <stop offset={`${fillLevel * 100}%`} stopColor="currentColor" />
                  <stop offset={`${fillLevel * 100}%`} stopColor="transparent" />
                </linearGradient>
              </defs>
              <path
                d="M12 3.6l2.6 5.4 5.9.8-4.3 4.1 1.05 5.8L12 17l-5.25 2.7L7.8 13.9 3.5 9.8l5.9-.8z"
                fill={
                  fillLevel >= 0.99
                    ? "currentColor"
                    : fillLevel <= 0.01
                      ? "none"
                      : `url(#star-${index}-${Math.round(fillLevel * 100)})`
                }
                stroke="currentColor"
                strokeWidth={1.4}
                strokeLinejoin="round"
              />
            </svg>
          );
        })}
      </span>
      {showValue && (
        <span className="text-xs font-medium text-ink-500">
          {clamped.toFixed(1)}
          {typeof count === "number" && (
            <span className="text-ink-400"> · {count} reviews</span>
          )}
        </span>
      )}
    </span>
  );
}

export function Badge({
  children,
  tone = "ink",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "ink" | "brand" | "electric" | "cream" | "success";
  className?: string;
}) {
  const tones: Record<string, string> = {
    ink: "bg-ink-900 text-cream-50",
    brand: "bg-brand-300 text-ink-900",
    electric: "bg-electric-500 text-white",
    cream: "bg-cream-200 text-ink-800",
    success: "bg-emerald-100 text-emerald-800",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
