"use client";

import Link from "next/link";

type Props = {
  categories: string[];
  currentCategory: string;
  basePath?: string;
};

function categoryMatch(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/** 用於 Journal 頁與首頁 From the Journal 區塊的分類捲軸 */
export default function JournalCategoryNav({
  categories,
  currentCategory,
  basePath = "/journal",
}: Props) {
  const ALL = "all";
  const isAll = currentCategory === ALL || !currentCategory.trim();
  return (
    <nav className="border-b border-[var(--border)] pb-4">
      <div className="scrollbar-hide flex flex-nowrap gap-2 overflow-x-auto overflow-y-hidden pr-2 -mb-px">
        <Link
          href={basePath === "/" ? "/" : "/journal"}
          className={`typo-sectionLink tracking-widest uppercase px-3 py-1.5 transition-colors whitespace-nowrap shrink-0 ${
            isAll
              ? "text-foreground font-medium border-b-2 border-foreground -mb-[9px]"
              : "text-[var(--muted)] hover:text-foreground"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => {
          const isActive = !isAll && categoryMatch(currentCategory, cat);
          const href =
            basePath === "/"
              ? `/?journalCategory=${encodeURIComponent(cat)}`
              : `/journal?category=${encodeURIComponent(cat)}`;
          return (
            <Link
              key={cat}
              href={href}
              className={`typo-sectionLink tracking-widest uppercase px-3 py-1.5 transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? "text-foreground font-medium border-b-2 border-foreground -mb-[9px]"
                  : "text-[var(--muted)] hover:text-foreground"
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
