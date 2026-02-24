import Link from "next/link";
import Image from "next/image";
import { getSiteSettings, getFeaturedProducts, getFeaturedArticles, getInstagramPosts } from "@/lib/cms";
import ProductCard from "@/components/ProductCard";
import ArticleCard from "@/components/ArticleCard";

export default async function HomePage() {
  const [settings, featuredProducts, featuredArticles, instagramPosts] = await Promise.all([
    getSiteSettings(),
    getFeaturedProducts(8),
    getFeaturedArticles(6),
    getInstagramPosts(6),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-[var(--border)]">
        <Image
          src="/images/placeholder.svg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 text-center px-5 py-16">
          <p className="font-serif text-2xl md:text-4xl text-white tracking-wide max-w-2xl mx-auto">
            {settings.tagline}
          </p>
          <Link href="/shop" className="cta-link mt-6 inline-flex link-arrow">
            Explore Shop
          </Link>
        </div>
      </section>

      {/* Selected Products（僅在有精選產品時顯示） */}
      {featuredProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 py-14 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">Selected Products</h2>
            <Link href="/shop" className="text-sm tracking-widest uppercase text-foreground hover:text-[var(--accent)] transition-colors link-arrow">
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
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">From the Journal</h2>
            <Link href="/journal" className="text-sm tracking-widest uppercase text-foreground hover:text-[var(--accent)] transition-colors link-arrow">
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

      {/* Instagram - Follow Along */}
      <section className="max-w-6xl mx-auto px-5 py-14 md:py-20 border-t border-[var(--border)]">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-2">Follow Along</h2>
        <p className="text-sm text-[var(--muted)] mb-8">
          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-[var(--accent)] transition-colors"
          >
            {settings.instagramHandle} on Instagram
          </a>
        </p>
        {instagramPosts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {instagramPosts.map((post) => (
              <a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square relative bg-[var(--border)] overflow-hidden group"
              >
                <Image src={post.imageUrl} alt="" fill className="object-cover group-hover:scale-105 transition-transform" />
              </a>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-[var(--border)] flex items-center justify-center text-[var(--muted)] text-sm">
                Instagram 貼文預留
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
