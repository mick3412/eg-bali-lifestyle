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
    <nav className="w-full mb-6 relative">
      {/* Row 1: Main categories */}
      {/* 依使用者要求：主分類粗體，選中時底部加底線 */}
      <div className="scrollbar-hide flex flex-nowrap items-center gap-5 md:gap-8 overflow-x-auto overflow-y-hidden pb-3 border-b border-[var(--border)]">
        <Link
          href="/shop"
          className={`shrink-0 transition-colors pb-1 border-b-2 ${isAll
              ? "text-foreground font-bold border-foreground"
              : "text-foreground font-bold border-transparent hover:border-foreground/30 opacity-70 hover:opacity-100"
            } text-[15px] md:text-base tracking-widest`}
        >
          ALL
        </Link>
        {categories.map((cat) => {
          const isActive = currentCategory === cat.slug;
          return (
            <Link
              key={cat.id}
              href={`/shop?category=${encodeURIComponent(cat.slug)}`}
              className={`shrink-0 transition-colors pb-1 border-b-2 ${isActive
                  ? "text-foreground font-bold border-foreground"
                  : "text-foreground font-bold border-transparent hover:border-foreground/30 opacity-70 hover:opacity-100"
                } text-[15px] md:text-base tracking-widest`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Row 2: Subcategories */}
      {/* 依使用者要求：子分類不加框，選中時底部加底線 */}
      {!isAll && subcategories.length > 0 && (
        <div className="scrollbar-hide flex flex-nowrap items-center gap-5 md:gap-8 overflow-x-auto overflow-y-hidden pt-3 pb-1">
          <Link
            href={`/shop?category=${encodeURIComponent(currentCategory)}`}
            className={`shrink-0 transition-colors pb-1 border-b ${!currentSubcategory
                ? "text-foreground font-medium border-foreground"
                : "text-[var(--muted)] border-transparent hover:text-foreground hover:border-foreground/30"
              } text-[13px] md:text-[14px] tracking-wider`}
          >
            全部
          </Link>
          {subcategories.map((sub) => {
            const isActive = currentSubcategory === sub.slug;
            return (
              <Link
                key={sub.id}
                href={`/shop?category=${encodeURIComponent(currentCategory)}&sub=${encodeURIComponent(sub.slug)}`}
                className={`shrink-0 transition-colors pb-1 border-b ${isActive
                    ? "text-foreground font-medium border-foreground"
                    : "text-[var(--muted)] border-transparent hover:text-foreground hover:border-foreground/30"
                  } text-[13px] md:text-[14px] tracking-wider`}
              >
                {sub.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
