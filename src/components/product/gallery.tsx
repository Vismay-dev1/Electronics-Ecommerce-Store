"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronRight } from "@/components/icons";

export function ProductGallery({
  images,
  name,
  badge,
}: {
  images: { url: string; alt: string }[];
  name: string;
  badge?: string | null;
}) {
  const [active, setActive] = useState(0);
  const safeImages =
    images.length > 0 ? images : [{ url: "", alt: name }];
  const current = safeImages[Math.min(active, safeImages.length - 1)];

  const go = (direction: 1 | -1) => {
    setActive((prev) => {
      const next = prev + direction;
      if (next < 0) return safeImages.length - 1;
      if (next >= safeImages.length) return 0;
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="group relative aspect-square w-full overflow-hidden rounded-3xl bg-cream-100">
        {current.url && (
          <Image
            key={current.url}
            src={current.url}
            alt={current.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="animate-fade-in object-cover"
          />
        )}
        {badge && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-900 backdrop-blur">
            {badge}
          </span>
        )}

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink-900 opacity-0 shadow-card backdrop-blur transition-all duration-300 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 max-md:opacity-100"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink-900 opacity-0 shadow-card backdrop-blur transition-all duration-300 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 max-md:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
          {safeImages.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-400 ${
                index === active
                  ? "w-7 bg-ink-900"
                  : "w-1.5 bg-ink-900/25 hover:bg-ink-900/50"
              }`}
            />
          ))}
        </div>
      </div>

      {safeImages.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {safeImages.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActive(index)}
              className={`relative aspect-square overflow-hidden rounded-xl transition-all duration-300 ${
                index === active
                  ? "ring-2 ring-ink-900 ring-offset-2 ring-offset-cream-50"
                  : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`View ${image.alt}`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
