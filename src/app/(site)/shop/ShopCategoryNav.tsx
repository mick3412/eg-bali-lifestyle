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

  // Find subcategories for currently selected main category
  const activeCategory = categories.find((c) => c.slug === currentCategory);
  const subcategories = activeCategory?.subcategories ?? [];

  return (
    <nav className="border-b border-[var(--border)]">
      {/* Row 1: Main categories */}
      <div className="scrollbar-hide flex flex-nowrap gap-2 overflow-x-auto overflow-y-hidden pr-2 pb-3">
        <Link
          href="/shop"
          className={`typo-sectionLink tracking-widest uppercase px-3 py-1.5 transition-colors whitespace-nowrap shrink-0 ${isAll
              ? "text-foreground font-medium border-b-2 border-foreground -mb-[1px]"
              : "text-[var(--muted)] hover:text-foreground"
            }`}
        >
          All Products
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${encodeURIComponent(cat.slug)}`}
            className={`typo-sectionLink tracking-widest uppercase px-3 py-1.5 transition-colors whitespace-nowrap shrink-0 ${currentCategory === cat.slug
                ? "text-foreground font-medium border-b-2 border-foreground -mb-[1px]"
                : "text-[var(--muted)] hover:text-foreground"
              }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Row 2: Subcategories — only shown when a main category with subcategories is selected */}
      {!isAll && subcategories.length > 0 && (
        <div className="scrollbar-hide flex flex-nowrap gap-2 overflow-x-auto overflow-y-hidden pr-2 pb-4 pt-1 pl-2">
          <Link
            href={`/shop?category=${encodeURIComponent(currentCategory)}`}
            className={`typo-bodySmall tracking-wider uppercase px-2.5 py-1 rounded-full transition-colors whitespace-nowrap shrink-0 ${!currentSubcategory
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "text-[var(--muted)] hover:text-foreground border border-[var(--border)]"
              }`}
          >
            All
          </Link>
          {subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/shop?category=${encodeURIComponent(currentCategory)}&sub=${encodeURIComponent(sub.slug)}`}
              className={`typo-bodySmall tracking-wider uppercase px-2.5 py-1 rounded-full transition-colors whitespace-nowrap shrink-0 ${currentSubcategory === sub.slug
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "text-[var(--muted)] hover:text-foreground border border-[var(--border)]"
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
