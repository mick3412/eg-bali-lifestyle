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
  const activeCategory = categories.find((c) => c.slug === currentCategory);
  const subcategories = activeCategory?.subcategories ?? [];

  return (
    <nav className="border-b border-[var(--border)]">
      {/* Row 1: Main categories — bold, underline when active */}
      <div className="scrollbar-hide flex flex-nowrap gap-4 overflow-x-auto overflow-y-hidden pr-2 pb-3">
        <Link
          href="/shop"
          className={`typo-sectionLink font-bold tracking-widest uppercase py-1.5 transition-colors whitespace-nowrap shrink-0 ${isAll
              ? "text-foreground border-b-2 border-foreground -mb-[1px]"
              : "text-[var(--muted)] hover:text-foreground"
            }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${encodeURIComponent(cat.slug)}`}
            className={`typo-sectionLink font-bold tracking-widest uppercase py-1.5 transition-colors whitespace-nowrap shrink-0 ${currentCategory === cat.slug
                ? "text-foreground border-b-2 border-foreground -mb-[1px]"
                : "text-[var(--muted)] hover:text-foreground"
              }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Row 2: Subcategories — no border, underline when active */}
      {!isAll && subcategories.length > 0 && (
        <div className="scrollbar-hide flex flex-nowrap gap-4 overflow-x-auto overflow-y-hidden pr-2 pb-4 pt-0.5">
          <Link
            href={`/shop?category=${encodeURIComponent(currentCategory)}`}
            className={`typo-bodySmall tracking-wider uppercase py-1 transition-colors whitespace-nowrap shrink-0 ${!currentSubcategory
                ? "text-foreground border-b border-foreground"
                : "text-[var(--muted)] hover:text-foreground"
              }`}
          >
            All
          </Link>
          {subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/shop?category=${encodeURIComponent(currentCategory)}&sub=${encodeURIComponent(sub.slug)}`}
              className={`typo-bodySmall tracking-wider uppercase py-1 transition-colors whitespace-nowrap shrink-0 ${currentSubcategory === sub.slug
                  ? "text-foreground border-b border-foreground"
                  : "text-[var(--muted)] hover:text-foreground"
                }`}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
