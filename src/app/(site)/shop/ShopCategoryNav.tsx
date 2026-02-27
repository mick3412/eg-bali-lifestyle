"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ProductCategoryItem } from "@/types";

type Props = {
  categories: ProductCategoryItem[];
  currentCategory: string;
  currentSubcategory?: string;
};

export default function ShopCategoryNav({ categories, currentCategory, currentSubcategory }: Props) {
  const isAll = currentCategory === "all" || !currentCategory;

  // Track which accordion is open; default to the active category (if it has subcats)
  const [openSlug, setOpenSlug] = useState<string | null>(() => {
    const active = categories.find((c) => c.slug === currentCategory);
    return active && (active.subcategories?.length ?? 0) > 0 ? active.slug : null;
  });

  // Sync open state when URL category changes (e.g. browser back/forward)
  useEffect(() => {
    const active = categories.find((c) => c.slug === currentCategory);
    setOpenSlug(active && (active.subcategories?.length ?? 0) > 0 ? active.slug : null);
  }, [currentCategory, categories]);

  function handleMainCatClick(cat: ProductCategoryItem) {
    const hasSubs = (cat.subcategories?.length ?? 0) > 0;
    if (!hasSubs) {
      setOpenSlug(null);
      return;
    }
    setOpenSlug((prev) => (prev === cat.slug ? null : cat.slug));
  }

  return (
    <nav className="border-b border-[var(--border)] pb-4">
      {/* Single row: main categories */}
      <div className="scrollbar-hide flex flex-nowrap gap-2 overflow-x-auto overflow-y-hidden pr-2 -mb-px">
        <Link
          href="/shop"
          className={`typo-sectionLink tracking-widest uppercase px-3 py-1.5 transition-colors whitespace-nowrap shrink-0 ${isAll
              ? "text-foreground font-medium border-b-2 border-foreground"
              : "text-[var(--muted)] hover:text-foreground"
            }`}
          onClick={() => setOpenSlug(null)}
        >
          All Products
        </Link>
        {categories.map((cat) => {
          const isActive = currentCategory === cat.slug;
          const hasSubs = (cat.subcategories?.length ?? 0) > 0;
          const isOpen = openSlug === cat.slug;

          return (
            <Link
              key={cat.id}
              href={`/shop?category=${encodeURIComponent(cat.slug)}`}
              className={`typo-sectionLink tracking-widest uppercase px-3 py-1.5 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${isActive
                  ? "text-foreground font-medium border-b-2 border-foreground"
                  : "text-[var(--muted)] hover:text-foreground"
                }`}
              onClick={(e) => {
                if (hasSubs) {
                  // If already on this category, just toggle accordion without navigating
                  if (isActive) {
                    e.preventDefault();
                    handleMainCatClick(cat);
                  } else {
                    handleMainCatClick(cat);
                  }
                } else {
                  setOpenSlug(null);
                }
              }}
            >
              {cat.name}
              {hasSubs && (
                <span
                  className="text-[10px] leading-none transition-transform duration-200"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block" }}
                >
                  ▾
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Accordion: subcategory row */}
      {openSlug && (() => {
        const activeCat = categories.find((c) => c.slug === openSlug);
        const subs = activeCat?.subcategories ?? [];
        if (subs.length === 0) return null;
        return (
          <div className="scrollbar-hide flex flex-nowrap gap-2 overflow-x-auto overflow-y-hidden pr-2 pt-3 pl-1 animate-fade-in">
            <Link
              href={`/shop?category=${encodeURIComponent(openSlug)}`}
              className={`typo-bodySmall tracking-wider uppercase px-3 py-1 rounded-full transition-colors whitespace-nowrap shrink-0 border ${!currentSubcategory && currentCategory === openSlug
                  ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                  : "text-[var(--muted)] hover:text-foreground border-[var(--border)]"
                }`}
            >
              全部
            </Link>
            {subs.map((sub) => (
              <Link
                key={sub.id}
                href={`/shop?category=${encodeURIComponent(openSlug)}&sub=${encodeURIComponent(sub.slug)}`}
                className={`typo-bodySmall tracking-wider uppercase px-3 py-1 rounded-full transition-colors whitespace-nowrap shrink-0 border ${currentSubcategory === sub.slug
                    ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                    : "text-[var(--muted)] hover:text-foreground border-[var(--border)]"
                  }`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        );
      })()}
    </nav>
  );
}
