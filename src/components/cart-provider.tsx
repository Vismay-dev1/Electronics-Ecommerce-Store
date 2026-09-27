"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CartLine } from "@/lib/types";

const STORAGE_KEY = "loyal-electronics-cart-v1";

type AddPayload = {
  productId: number;
  slug: string;
  name: string;
  imageUrl: string;
  unitPriceCents: number;
  color?: string | null;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  isOpen: boolean;
  hydrated: boolean;
  lastAddedSlug: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (payload: AddPayload, quantity?: number) => void;
  setQuantity: (productId: number, color: string | null, quantity: number) => void;
  removeItem: (productId: number, color: string | null) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (line) =>
          Number.isSafeInteger(line?.productId) && line.productId > 0 &&
          Number.isSafeInteger(line?.unitPriceCents) && line.unitPriceCents >= 0 &&
          Number.isSafeInteger(line?.quantity) &&
          line.quantity > 0,
      )
      .map((line) => ({
        productId: line.productId,
        slug: String(line.slug ?? ""),
        name: String(line.name ?? "Loyal product"),
        imageUrl: String(line.imageUrl ?? ""),
        unitPriceCents: line.unitPriceCents,
        quantity: Math.min(20, Math.round(line.quantity)),
        color: typeof line.color === "string" ? line.color : null,
      }));
  } catch {
    return [];
  }
}

const sameLine = (line: CartLine, productId: number, color: string | null) =>
  line.productId === productId && (line.color ?? null) === (color ?? null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [lastAddedSlug, setLastAddedSlug] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setLines(readStoredCart());
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
      } catch {
        /* storage unavailable — cart stays in memory */
      }
    }, 120);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [lines, hydrated]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const addItem = useCallback(
    (payload: AddPayload, quantity = 1) => {
      if (!Number.isSafeInteger(quantity) || quantity < 1) return;
      const color = payload.color ?? null;
      setLines((current) => {
        const index = current.findIndex((line) =>
          sameLine(line, payload.productId, color),
        );
        if (index === -1) {
          return [
            ...current,
            {
              productId: payload.productId,
              slug: payload.slug,
              name: payload.name,
              imageUrl: payload.imageUrl,
              unitPriceCents: payload.unitPriceCents,
              quantity: Math.max(1, Math.min(20, quantity)),
              color,
            },
          ];
        }
        const next = [...current];
        next[index] = {
          ...next[index],
          quantity: Math.min(20, next[index].quantity + quantity),
        };
        return next;
      });
      setLastAddedSlug(payload.slug);
      setIsOpen(true);
    },
    [],
  );

  const setQuantity = useCallback(
    (productId: number, color: string | null, quantity: number) => {
      if (!Number.isSafeInteger(quantity)) return;
      setLines((current) => {
        if (quantity <= 0) {
          return current.filter((line) => !sameLine(line, productId, color));
        }
        return current.map((line) =>
          sameLine(line, productId, color)
            ? { ...line, quantity: Math.min(20, quantity) }
            : line,
        );
      });
    },
    [],
  );

  const removeItem = useCallback(
    (productId: number, color: string | null) => {
      setLines((current) =>
        current.filter((line) => !sameLine(line, productId, color)),
      );
    },
    [],
  );

  const clearCart = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((total, line) => total + line.quantity, 0);
    const subtotalCents = lines.reduce(
      (total, line) => total + line.unitPriceCents * line.quantity,
      0,
    );
    return {
      lines,
      count,
      subtotalCents,
      isOpen,
      hydrated,
      lastAddedSlug,
      openCart,
      closeCart,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    };
  }, [
    lines,
    isOpen,
    hydrated,
    lastAddedSlug,
    openCart,
    closeCart,
    addItem,
    setQuantity,
    removeItem,
    clearCart,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return context;
}
