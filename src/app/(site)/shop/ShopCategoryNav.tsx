"use client";

import Link from "next/link";
import type { ProductCategoryItem } from "@/types";

type Props = {
  categories: ProductCategoryItem[];
  currentCategory: string;
  currentSubcategory?: string;
};

export default function ShopCategoryNav({ categories, currentCategory, currentSubcategory }: Props) {
  const isAll = currentCategory === "all" || !currentCategory;

  return (
    <nav className="flex flex-col gap-1 min-w-[140px]">
      {/* All Products */}
      <Link
        href="/shop"
        className={`typo-bodySmall tracking-widest uppercase py-1.5 transition-colors ${isAll
            ? "text-foreground font-semibold"
            : "text-[var(--muted)] hover:text-foreground"
          }`}
      >
        All
      </Link>

      {/* Main categories + subcategories */}
      {categories.map((cat) => {
        const isActive = currentCategory === cat.slug;
        const hasSubs = (cat.subcategories?.length ?? 0) > 0;

        return (
          <div key={cat.id} className="flex flex-col">
            <Link
              href={`/shop?category=${encodeURIComponent(cat.slug)}`}
              className={`typo-bodySmall tracking-widest uppercase py-1.5 transition-colors ${isActive
                  ? "text-foreground font-semibold"
                  : "text-[var(--muted)] hover:text-foreground"
                }`}
            >
              {cat.name}
            </Link>

            {/* Subcategories: always expanded when parent is active */}
            {isActive && hasSubs && (
              <div className="flex flex-col gap-0.5 pl-3 mt-0.5 mb-1 border-l border-[var(--border)]">
                <Link
                  href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                  className={`typo-caption tracking-wider uppercase py-1 transition-colors ${!currentSubcategory
                      ? "text-foreground font-medium"
                      : "text-[var(--muted)] hover:text-foreground"
                    }`}
                >
                  全部
                </Link>
                {cat.subcategories!.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/shop?category=${encodeURIComponent(cat.slug)}&sub=${encodeURIComponent(sub.slug)}`}
                    className={`typo-caption tracking-wider uppercase py-1 transition-colors ${currentSubcategory === sub.slug
                        ? "text-foreground font-medium"
                        : "text-[var(--muted)] hover:text-foreground"
                      }`}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
