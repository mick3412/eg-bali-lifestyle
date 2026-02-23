"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/cms";
import type { ProductCategory } from "@/types";

const CATEGORIES: (ProductCategory | "all")[] = ["all", "skincare", "body-care", "fragrance", "home"];

export default function ShopCategoryNav() {
  const searchParams = useSearchParams();
  const current = (searchParams.get("category") as ProductCategory | null) || "all";

  return (
    <nav className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-4">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat}
          href={cat === "all" ? "/shop" : `/shop?category=${cat}`}
          className={`text-sm tracking-widest uppercase px-3 py-1.5 transition-colors ${
            current === cat
              ? "text-foreground font-medium border-b-2 border-foreground -mb-[9px]"
              : "text-[var(--muted)] hover:text-foreground"
          }`}
        >
          {CATEGORY_LABELS[cat]}
        </Link>
      ))}
    </nav>
  );
}
