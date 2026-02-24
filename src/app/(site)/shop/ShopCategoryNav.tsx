"use client";

import Link from "next/link";
import type { ProductCategoryItem } from "@/types";

type Props = {
  categories: ProductCategoryItem[];
  currentCategory: string;
};

export default function ShopCategoryNav({ categories, currentCategory }: Props) {
  return (
    <nav className="border-b border-[var(--border)] pb-4">
      <div className="scrollbar-hide flex flex-nowrap gap-2 overflow-x-auto overflow-y-hidden pr-2 -mb-px">
        <Link
          href="/shop"
          className={`typo-sectionLink tracking-widest uppercase px-3 py-1.5 transition-colors whitespace-nowrap shrink-0 ${
            currentCategory === "all"
              ? "text-foreground font-medium border-b-2 border-foreground -mb-[9px]"
              : "text-[var(--muted)] hover:text-foreground"
          }`}
        >
          All Products
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${encodeURIComponent(cat.slug)}`}
            className={`typo-sectionLink tracking-widest uppercase px-3 py-1.5 transition-colors whitespace-nowrap shrink-0 ${
              currentCategory === cat.slug
                ? "text-foreground font-medium border-b-2 border-foreground -mb-[9px]"
                : "text-[var(--muted)] hover:text-foreground"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
