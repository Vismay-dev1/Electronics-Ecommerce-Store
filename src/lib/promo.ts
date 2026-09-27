export const PROMO_CODES: Record<string, { label: string; percent: number }> = {
  LOYAL10: { label: "10% off your order", percent: 10 },
  FAMILY15: { label: "15% off family orders", percent: 15 },
  STUDENT20: { label: "20% student discount", percent: 20 },
};

export function normaliseCode(value: string): string {
  return value.trim().toUpperCase().slice(0, 16);
}

export function lookupPromo(value: string) {
  const code = normaliseCode(value);
  if (!code) return null;
  return PROMO_CODES[code] ?? null;
}

export function discountFor(code: string, subtotalCents: number): number {
  const promo = lookupPromo(code);
  if (!promo || subtotalCents <= 0) return 0;
  return Math.round((subtotalCents * promo.percent) / 100);
}
