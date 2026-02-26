import { getArticles, getArticleCategories } from "@/lib/cms";
import ArticleCard from "@/components/ArticleCard";
import JournalCategoryNav from "./JournalCategoryNav";

export const metadata = {
  title: "Journal — Eg. Bali Lifestyle",
  description: "Stories, wellness, and mindful living from Eg. Bali Lifestyle.",
};

/** 與首頁一致，定期向 Sanity 取最新文章列表 */
export const revalidate = 60;

type Props = { searchParams: Promise<{ category?: string | string[] }> };

function normalizeCategory(param: string | string[] | undefined): string | undefined {
  if (param == null) return undefined;
  const value = Array.isArray(param) ? param[0] : param;
  return typeof value === "string" ? value.trim() : undefined;
}

export default async function JournalPage({ searchParams }: Props) {
  const params = await searchParams;
  const categoryParam = normalizeCategory(params.category);
  const [allArticles, categories] = await Promise.all([getArticles(), getArticleCategories()]);
  const currentCategory = categoryParam ?? "all";
  const filtered =
    !categoryParam || categoryParam === "all"
      ? allArticles
      : allArticles.filter(
        (a) => (a.category ?? "").trim().toLowerCase() === categoryParam.trim().toLowerCase()
      );

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
      <h1 className="typo-sectionTitle font-semibold text-foreground mb-8">Journal</h1>
      <JournalCategoryNav
        categories={categories}
        currentCategory={currentCategory}
        basePath="/journal"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-8">
        {filtered.length > 0 ? (
          filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p className="col-span-full typo-body text-[var(--muted)] text-center py-12">
            暫無文章
          </p>
        )}
      </div>
    </div>
  );
}
