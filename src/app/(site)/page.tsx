import Link from "next/link";
import Image from "next/image";
import { getSiteSettings, getFeaturedProducts, getFeaturedArticles, getArticles } from "@/lib/cms";
import ProductCard from "@/components/ProductCard";
import ArticleCard from "@/components/ArticleCard";
import HeroBanner from "@/components/HeroBanner";
import JournalCategoryNav from "@/app/(site)/journal/JournalCategoryNav";

/** 首頁每 60 秒可重新向 Sanity 取數，讓發布/精選的內容能同步顯示 */
export const revalidate = 60;

function getUniqueCategories(articles: { category: string }[]): string[] {
  const set = new Set<string>();
  for (const a of articles) {
    const c = (a.category ?? "").trim();
    if (c) set.add(c);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

type Props = { searchParams: Promise<{ journalCategory?: string | string[] }> };

function normalizeJournalCategory(param: string | string[] | undefined): string | undefined {
  if (param == null) return undefined;
  const value = Array.isArray(param) ? param[0] : param;
  return typeof value === "string" ? value.trim() : undefined;
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const journalCategoryParam = normalizeJournalCategory(params.journalCategory);
  const [settings, featuredProducts, featuredArticles, allArticles] = await Promise.all([
    getSiteSettings(),
    getFeaturedProducts(8),
    getFeaturedArticles(6),
    getArticles(),
  ]);
  const instagramPosts = (settings.instagramPosts ?? []).slice(0, 4);
  const journalCategories = getUniqueCategories(allArticles);
  const journalFiltered =
    !journalCategoryParam || journalCategoryParam === "all"
      ? featuredArticles
      : featuredArticles.filter(
          (a) =>
            (a.category ?? "").trim().toLowerCase() === journalCategoryParam.trim().toLowerCase()
        );
  const journalCurrentCategory = journalCategoryParam ?? "all";

  return (
    <div>
      {/* Hero Banner（最多 3 張輪播，CMS 設定） */}
      <HeroBanner
        images={settings.bannerImages ?? []}
        tagline={settings.tagline}
        ctaLabel="Explore Shop"
        ctaHref="/shop"
      />

      {/* Selected Products（僅在有精選產品時顯示） */}
      {featuredProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 py-14 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <h2 className="typo-sectionTitle font-semibold text-foreground">Selected Products</h2>
            <Link href="/shop" className="typo-sectionLink tracking-widest uppercase text-foreground hover:text-[var(--accent)] transition-colors link-arrow">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* From the Journal（僅在有精選文章時顯示） */}
      {featuredArticles.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 py-14 md:py-20 border-t border-[var(--border)]">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <h2 className="typo-sectionTitle font-semibold text-foreground">From the Journal</h2>
            <Link href="/journal" className="typo-sectionLink tracking-widest uppercase text-foreground hover:text-[var(--accent)] transition-colors link-arrow">
              Read More
            </Link>
          </div>
          <JournalCategoryNav
            categories={journalCategories}
            currentCategory={journalCurrentCategory}
            basePath="/"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {journalFiltered.length > 0 ? (
              journalFiltered.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <p className="col-span-full typo-body text-[var(--muted)] text-center py-12">
                暫無文章
              </p>
            )}
          </div>
        </section>
      )}

      {/* Instagram - Follow Along */}
      <section className="max-w-6xl mx-auto px-5 py-14 md:py-20 border-t border-[var(--border)]">
        <h2 className="typo-sectionTitle font-semibold text-foreground mb-2">Follow Along</h2>
        <p className="typo-bodySmall text-[var(--muted)] mb-8">
          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-[var(--accent)] transition-colors"
          >
            {settings.instagramHandle} on Instagram
          </a>
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => {
            const post = instagramPosts[i];
            return post ? (
              <a
                key={i}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square relative bg-[var(--border)] overflow-hidden group"
              >
                <Image
                  src={post.imageUrl}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </a>
            ) : (
              <div
                key={i}
                className="typo-bodySmall aspect-square bg-[var(--border)] flex items-center justify-center text-[var(--muted)]"
              >
                Instagram 貼文預留
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
