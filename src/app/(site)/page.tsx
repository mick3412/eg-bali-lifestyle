import Link from "next/link";
import Image from "next/image";
import { getSiteSettings, getFeaturedProducts, getFeaturedArticles } from "@/lib/cms";
import ProductCard from "@/components/ProductCard";
import ArticleCard from "@/components/ArticleCard";
import HeroBanner from "@/components/HeroBanner";

/** 首頁每 60 秒可重新向 Sanity 取數，讓發布/精選的內容能同步顯示 */
export const revalidate = 60;

export default async function HomePage() {
  const [settings, featuredProducts, featuredArticles] = await Promise.all([
    getSiteSettings(),
    getFeaturedProducts(8),
    getFeaturedArticles(6),
  ]);
  const instagramPosts = settings.instagramPosts ?? [];

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
            <h2 className="typo-sectionTitle font-semibold text-foreground">{settings.selectedProductsTitle?.trim() || "Selected Products"}</h2>
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

      {/* Selected Journal（僅在有精選文章時顯示，邏輯同 Selected Products，無子分類捲軸） */}
      {featuredArticles.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 py-14 md:py-20 border-t border-[var(--border)]">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <h2 className="typo-sectionTitle font-semibold text-foreground">{settings.selectedJournalTitle?.trim() || "Selected Journal"}</h2>
            <Link href="/journal" className="typo-sectionLink tracking-widest uppercase text-foreground hover:text-[var(--accent)] transition-colors link-arrow">
              Read More
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Instagram - 僅在 CMS 有上傳貼文時顯示 */}
      {instagramPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 py-14 md:py-20 border-t border-[var(--border)]">
          <h2 className="typo-sectionTitle font-semibold text-foreground mb-2">{settings.followForMoreTitle?.trim() || "Follow for More"}</h2>
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
            {instagramPosts.map((post, i) => (
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
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
