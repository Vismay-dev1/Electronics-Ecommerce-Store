"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ChevronDown, CloseIcon, FilterIcon } from "@/components/icons";
import { SORT_OPTIONS, isSortValue } from "@/lib/types";
import { StarRating } from "@/components/star-rating";

const FilterUiContext = createContext<{
  open: boolean;
  setOpen: (value: boolean) => void;
}>({ open: false, setOpen: () => {} });

export function FiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <FilterUiContext.Provider value={{ open, setOpen }}>
      {children}
    </FilterUiContext.Provider>
  );
}

export function FilterTrigger() {
  const { setOpen } = useContext(FilterUiContext);
  const searchParams = useSearchParams();
  const activeCount =
    ["category", "audience", "max", "rating", "deals", "q"].filter((key) =>
      searchParams.get(key),
    ).length;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex items-center gap-2 rounded-full border border-ink-900/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-800 lg:hidden"
    >
      <FilterIcon className="h-4 w-4" />
      Filters
      {activeCount > 0 && (
        <span className="rounded-full bg-brand-400 px-1.5 py-0.5 text-[10px] text-ink-900">
          {activeCount}
        </span>
      )}
    </button>
  );
}

function useParamTools() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const write = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      params.delete("page");
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return { searchParams, write };
}

function toggleValue(current: string, value: string) {
  const set = new Set(
    current
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
  if (set.has(value)) set.delete(value);
  else set.add(value);
  return Array.from(set).join(",");
}

export function FilterPanel({
  categories,
  audiences,
  minPriceCents,
  maxPriceCents,
  total,
}: {
  categories: { value: string; label: string; count: number }[];
  audiences: { value: string; label: string; count: number }[];
  minPriceCents: number;
  maxPriceCents: number;
  total: number;
}) {
  const { searchParams, write } = useParamTools();
  const { open: openMobile, setOpen: setOpenMobile } = useContext(FilterUiContext);

  const categoryParam = searchParams.get("category") ?? "";
  const audienceParam = searchParams.get("audience") ?? "";
  const maxParam = searchParams.get("max") ?? "";
  const ratingParam = searchParams.get("rating") ?? "";
  const dealsParam = searchParams.get("deals") ?? "";
  const queryParam = searchParams.get("q") ?? "";

  const selectedCategories = categoryParam.split(",").filter(Boolean);
  const selectedAudiences = audienceParam.split(",").filter(Boolean);

  const activeCount =
    selectedCategories.length +
    selectedAudiences.length +
    (maxParam ? 1 : 0) +
    (ratingParam ? 1 : 0) +
    (dealsParam ? 1 : 0) +
    (queryParam ? 1 : 0);

  const priceCeiling = useMemo(() => {
    const raw = Number(maxParam);
    if (!Number.isFinite(raw) || raw <= 0) return maxPriceCents;
    return Math.min(maxPriceCents, Math.round(raw * 100));
  }, [maxParam, maxPriceCents]);

  const clearAll = () =>
    write((params) => {
      ["category", "audience", "max", "rating", "deals", "q"].forEach((key) =>
        params.delete(key),
      );
    });

  const body = (
    <div className="flex flex-col gap-9">
      <div>
        <div className="flex items-baseline justify-between">
          <h3 className="eyebrow text-ink-400">Shop by category</h3>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-[11px] font-medium text-ink-400 underline decoration-ink-300 underline-offset-4 transition-colors hover:text-ink-900"
            >
              Clear all
            </button>
          )}
        </div>
        <ul className="mt-4 flex flex-col gap-1">
          {categories.map((category) => {
            const checked = selectedCategories.includes(category.value);
            return (
              <li key={category.value}>
                <button
                  type="button"
                  onClick={() =>
                    write((params) => {
                      const next = toggleValue(categoryParam, category.value);
                      if (next) params.set("category", next);
                      else params.delete("category");
                    })
                  }
                  className={`group flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                    checked
                      ? "bg-ink-900 text-cream-50"
                      : "text-ink-700 hover:bg-cream-200"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors ${
                        checked
                          ? "border-brand-400 bg-brand-400"
                          : "border-ink-300 group-hover:border-ink-500"
                      }`}
                    >
                      {checked && (
                        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5">
                          <path
                            d="m2.5 6.2 2.3 2.3L9.6 3.6"
                            fill="none"
                            stroke="#0e1116"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    {category.label}
                  </span>
                  <span
                    className={`text-xs tabular-nums ${
                      checked ? "text-cream-100/60" : "text-ink-400"
                    }`}
                  >
                    {category.count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h3 className="eyebrow text-ink-400">Who&apos;s it for</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {audiences.map((audience) => {
            const checked = selectedAudiences.includes(audience.value);
            return (
              <button
                key={audience.value}
                type="button"
                onClick={() =>
                  write((params) => {
                    const next = toggleValue(audienceParam, audience.value);
                    if (next) params.set("audience", next);
                    else params.delete("audience");
                  })
                }
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  checked
                    ? "border-brand-400 bg-brand-100 text-ink-900"
                    : "border-ink-900/15 text-ink-600 hover:border-ink-900/40"
                }`}
              >
                {audience.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <h3 className="eyebrow text-ink-400">Max price</h3>
          <span className="text-xs font-semibold text-ink-700">
            ${(priceCeiling / 100).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
        <input
          type="range"
          min={minPriceCents}
          max={maxPriceCents}
          step={500}
          value={priceCeiling}
          onChange={(event) => {
            const dollars = Math.round(Number(event.target.value) / 100);
            write((params) => {
              if (dollars * 100 >= maxPriceCents) params.delete("max");
              else params.set("max", String(dollars));
            });
          }}
          className="mt-4 w-full"
          aria-label="Maximum price"
        />
        <div className="mt-1.5 flex justify-between text-[11px] text-ink-400">
          <span>${Math.round(minPriceCents / 100)}</span>
          <span>${Math.round(maxPriceCents / 100)}</span>
        </div>
      </div>

      <div>
        <h3 className="eyebrow text-ink-400">Rating</h3>
        <ul className="mt-4 flex flex-col gap-2">
          {[4.5, 4, 3].map((rating) => (
            <li key={rating}>
              <button
                type="button"
                onClick={() =>
                  write((params) => {
                    if (ratingParam === String(rating)) params.delete("rating");
                    else params.set("rating", String(rating));
                  })
                }
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                  ratingParam === String(rating)
                    ? "bg-cream-200 text-ink-900"
                    : "text-ink-600 hover:bg-cream-100"
                }`}
              >
                <StarRating value={rating} size={13} />
                <span className="text-xs text-ink-500">&amp; up</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button
          type="button"
          onClick={() =>
            write((params) => {
              if (dealsParam) params.delete("deals");
              else params.set("deals", "true");
            })
          }
          className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
            dealsParam
              ? "border-brand-400 bg-brand-100 text-ink-900"
              : "border-ink-900/15 text-ink-700 hover:border-ink-900/40"
          }`}
        >
          On sale only
          <span
            className={`relative h-5 w-9 rounded-full transition-colors ${
              dealsParam ? "bg-brand-500" : "bg-ink-200"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-300 ${
                dealsParam ? "left-[1.15rem]" : "left-0.5"
              }`}
            />
          </span>
        </button>
      </div>

      <p className="text-xs leading-relaxed text-ink-400">
        Showing {total} products. Every order ships with a 3-year Loyal Care
        warranty and free returns for 30 days.
      </p>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-28">{body}</div>
      </aside>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          openMobile ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!openMobile}
      >
        <div
          className={`absolute inset-0 bg-ink-950/50 backdrop-blur-sm transition-opacity duration-300 ${
            openMobile ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpenMobile(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-cream-50 shadow-lift transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            openMobile ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <header className="flex items-center justify-between border-b border-ink-900/10 px-5 py-4">
            <span className="font-display text-xl text-ink-900">Filters</span>
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className="rounded-full p-2 text-ink-700 hover:bg-ink-900/5"
              aria-label="Close filters"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto px-5 py-6">{body}</div>
          <footer className="border-t border-ink-900/10 p-4">
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className="w-full rounded-full bg-ink-900 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-cream-50"
            >
              Show results
            </button>
          </footer>
        </div>
      </div>
    </>
  );
}

export function SortSelect() {
  const { searchParams, write } = useParamTools();
  const current = searchParams.get("sort") ?? "featured";
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Sort products</span>
      <select
        value={isSortValue(current) ? current : "featured"}
        onChange={(event) => {
          const value = event.target.value;
          write((params) => {
            if (value === "featured") params.delete("sort");
            else params.set("sort", value);
          });
        }}
        className="appearance-none rounded-full border border-ink-900/15 bg-cream-50 py-2.5 pl-4 pr-10 text-xs font-semibold uppercase tracking-[0.12em] text-ink-800 transition-colors hover:border-ink-900/40 focus:outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 h-4 w-4 text-ink-500" />
    </label>
  );
}

export function ActiveFilters({
  categories,
  audiences,
}: {
  categories: { value: string; label: string }[];
  audiences: { value: string; label: string }[];
}) {
  const { searchParams, write } = useParamTools();
  const chips: { label: string; onRemove: () => void }[] = [];

  const categoryParam = searchParams.get("category") ?? "";
  const audienceParam = searchParams.get("audience") ?? "";
  const maxParam = searchParams.get("max");
  const ratingParam = searchParams.get("rating");
  const dealsParam = searchParams.get("deals");
  const queryParam = searchParams.get("q");

  for (const value of categoryParam.split(",").filter(Boolean)) {
    const label = categories.find((item) => item.value === value)?.label ?? value;
    chips.push({
      label,
      onRemove: () =>
        write((params) => {
          const next = toggleValue(categoryParam, value);
          if (next) params.set("category", next);
          else params.delete("category");
        }),
    });
  }
  for (const value of audienceParam.split(",").filter(Boolean)) {
    const label = audiences.find((item) => item.value === value)?.label ?? value;
    chips.push({
      label,
      onRemove: () =>
        write((params) => {
          const next = toggleValue(audienceParam, value);
          if (next) params.set("audience", next);
          else params.delete("audience");
        }),
    });
  }
  if (maxParam) {
    chips.push({
      label: `Under $${Number(maxParam).toLocaleString("en-US")}`,
      onRemove: () => write((params) => params.delete("max")),
    });
  }
  if (ratingParam) {
    chips.push({
      label: `${ratingParam}★ & up`,
      onRemove: () => write((params) => params.delete("rating")),
    });
  }
  if (dealsParam) {
    chips.push({
      label: "On sale",
      onRemove: () => write((params) => params.delete("deals")),
    });
  }
  if (queryParam) {
    chips.push({
      label: `“${queryParam}”`,
      onRemove: () => write((params) => params.delete("q")),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.label}
          type="button"
          onClick={chip.onRemove}
          className="group inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-3 py-1.5 text-xs font-medium text-cream-50 transition-colors hover:bg-brand-500"
        >
          {chip.label}
          <CloseIcon className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100" />
        </button>
      ))}
    </div>
  );
}
