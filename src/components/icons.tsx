import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function CartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.55L20.5 8H6" />
      <circle cx="9.5" cy="20" r="1.4" />
      <circle cx="17.5" cy="20" r="1.4" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 7h17M3.5 12h17M3.5 17h11" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m9.5 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5 13 4.5 4.5L19 7" />
    </svg>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 7.5h10v9h-10z" />
      <path d="M12.5 11h4l3 3v2.5h-7z" />
      <circle cx="6.5" cy="18" r="1.6" />
      <circle cx="16.5" cy="18" r="1.6" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 5 6v5.5c0 4.2 2.9 7.4 7 9 4.1-1.6 7-4.8 7-9V6z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </svg>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5l1.7 4.6 4.8 1.7-4.8 1.7L12 16.5l-1.7-5L5.5 9.8l4.8-1.7z" />
      <path d="M18.5 16.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
    </svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20 4v4.5h-4.5" />
    </svg>
  );
}

export function StarIcon({
  fillLevel = 1,
  ...props
}: IconProps & { fillLevel?: number }) {
  const gradientId = `star-grad-${Math.round(fillLevel * 100)}-${props.id ?? "x"}`;
  if (fillLevel >= 0.99 || fillLevel <= 0.01) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill={fillLevel >= 0.99 ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinejoin="round"
        {...props}
      >
        <path d="M12 3.6l2.6 5.4 5.9.8-4.3 4.1 1.05 5.8L12 17l-5.25 2.7L7.8 13.9 3.5 9.8l5.9-.8z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <defs>
        <linearGradient id={gradientId}>
          <stop offset={`${fillLevel * 100}%`} stopColor="currentColor" />
          <stop offset={`${fillLevel * 100}%`} stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M12 3.6l2.6 5.4 5.9.8-4.3 4.1 1.05 5.8L12 17l-5.25 2.7L7.8 13.9 3.5 9.8l5.9-.8z"
        fill={`url(#${gradientId})`}
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M7 12h10M10 17h4" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20s-6.5-4.1-6.5-8.6A3.6 3.6 0 0 1 12 8.9a3.6 3.6 0 0 1 6.5 2.5C18.5 15.9 12 20 12 20z" />
    </svg>
  );
}

export function QuoteIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9.6 5.4C6.3 6.9 4.2 9.8 4.2 13.2c0 3.1 1.9 5.4 4.6 5.4 2.3 0 4-1.7 4-3.9 0-2.1-1.5-3.7-3.5-3.7-.4 0-.8.1-1 .2.4-1.6 1.7-3.1 3.4-4zm9.2 0c-3.3 1.5-5.4 4.4-5.4 7.8 0 3.1 1.9 5.4 4.6 5.4 2.3 0 4-1.7 4-3.9 0-2.1-1.5-3.7-3.5-3.7-.4 0-.8.1-1 .2.4-1.6 1.7-3.1 3.4-4z" />
    </svg>
  );
}
