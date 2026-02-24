"use client";

import Link from "next/link";
import type { ProductCategoryItem } from "@/types";

type Props = {
  categories: ProductCategoryItem[];
  currentCategory: string;
};

export default function ShopCategoryNav({ categories, currentCategory }: Props) {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-4">
      <Link
        href="/shop"
        className={`text-sm tracking-widest uppercase px-3 py-1.5 transition-colors ${
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
          className={`text-sm tracking-widest uppercase px-3 py-1.5 transition-colors ${
            currentCategory === cat.slug
              ? "text-foreground font-medium border-b-2 border-foreground -mb-[9px]"
              : "text-[var(--muted)] hover:text-foreground"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </nav>
  );
}
