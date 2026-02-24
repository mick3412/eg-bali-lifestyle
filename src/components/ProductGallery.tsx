"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

export type GalleryItem = { type: "image" | "video"; url: string };

interface ProductGalleryProps {
  items: GalleryItem[];
  alt: string;
  className?: string;
}

export default function ProductGallery({ items, alt, className = "" }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const item = items[index];
  const hasMultiple = items.length > 1;
  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
  }, [items.length]);
  const goNext = useCallback(() => {
    setIndex((i) => (i >= items.length - 1 ? 0 : i + 1));
  }, [items.length]);

  if (!item) return null;

  return (
    <div className={`relative aspect-[3/4] bg-[var(--border)] overflow-hidden ${className}`}>
      {item.type === "image" ? (
        <Image
          src={item.url}
          alt={alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <video
          src={item.url}
          className="absolute inset-0 w-full h-full object-cover"
          controls
          playsInline
          muted
          loop
        />
      )}

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="上一張"
          >
            <span aria-hidden>←</span>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="下一張"
          >
            <span aria-hidden>→</span>
          </button>
          <p className="absolute bottom-2 left-1/2 -translate-x-1/2 typo-caption text-white/90 bg-black/40 px-2 py-1 rounded">
            {index + 1} / {items.length}
          </p>
        </>
      )}
    </div>
  );
}
