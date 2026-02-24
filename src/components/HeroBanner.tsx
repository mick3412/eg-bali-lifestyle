"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export interface BannerImage {
  url: string;
  link?: string;
  alt?: string;
  order?: number;
}

const ROTATE_MS = 5000;

type Props = {
  images: BannerImage[];
  tagline: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function HeroBanner({ images, tagline, ctaLabel = "Explore Shop", ctaHref = "/shop" }: Props) {
  const [index, setIndex] = useState(0);
  const list = images.length > 0 ? images : [{ url: "/images/placeholder.svg", alt: "" }];
  const current = list[index]!;

  useEffect(() => {
    if (list.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % list.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [list.length]);

  const content = (
    <div className="relative min-h-[70vh] flex items-center justify-center bg-[var(--border)] overflow-hidden">
      {list.map((img, i) => (
        <div
          key={i}
          aria-hidden={i !== index}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === index ? 1 : 0, zIndex: i === index ? 1 : 0 }}
        >
          <Image
            src={img.url}
            alt={i === index ? (img.alt ?? "") : ""}
            fill
            className="object-cover"
            sizes="100vw"
            priority={i === 0}
            loading={i === 0 ? undefined : "lazy"}
            unoptimized={img.url.startsWith("http")}
          />
        </div>
      ))}
      <div className="relative z-10 text-center px-5 py-16">
        <p className="typo-heroTitle text-white tracking-wide max-w-2xl mx-auto">
          {tagline}
        </p>
        {ctaHref && (
          <Link href={ctaHref} className="typo-button cta-link mt-6 inline-flex link-arrow">
            {ctaLabel}
          </Link>
        )}
      </div>
      {list.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2">
          {list.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`切換至第 ${i + 1} 張`}
              className={`w-2 h-2 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/50"}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (current.link) {
    return (
      <section>
        <a href={current.link} target="_blank" rel="noopener noreferrer" className="block">
          {content}
        </a>
      </section>
    );
  }
  return <section>{content}</section>;
}
