import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticlePrevNext } from "@/lib/cms";
import ArticleContent from "@/components/ArticleContent";
import ProductCard from "@/components/ProductCard";

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" });
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Journal — Eg. Bali Lifestyle" };
  return {
    title: `${article.title} — Eg. Bali Lifestyle`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const { prev, next } = await getArticlePrevNext(slug);

  return (
    <article className="max-w-3xl mx-auto px-5 py-10 md:py-14">
      <nav className="text-sm text-[var(--muted)] mb-6">
        <Link href="/" className="hover:text-foreground">首頁</Link>
        <span className="mx-1">/</span>
        <Link href="/journal" className="hover:text-foreground">Journal</Link>
        <span className="mx-1">/</span>
        <span className="text-foreground line-clamp-1">{article.title}</span>
      </nav>

      <div className="aspect-[2/1] relative bg-[var(--border)] overflow-hidden mb-8">
        <Image
          src={article.image}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 896px"
          priority
        />
      </div>

      <p className="text-xs tracking-widest uppercase text-[var(--accent)] mb-2">{article.category}</p>
      <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-2">{article.title}</h1>
      <p className="text-sm text-[var(--muted)] mb-8">{formatDate(article.publishedAt)}</p>

      <ArticleContent content={article.content} />

      {article.relatedProducts && article.relatedProducts.length > 0 && (
        <section className="mt-12 pt-10 border-t border-[var(--border)]">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-6">相關產品</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {article.relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <nav className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between gap-4">
        {prev ? (
          <Link
            href={`/journal/${prev.slug}`}
            className="text-sm text-[var(--muted)] hover:text-foreground transition-colors"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        <Link href="/journal" className="text-sm text-[var(--muted)] hover:text-foreground transition-colors order-first sm:order-none">
          返回 Journal
        </Link>
        {next ? (
          <Link
            href={`/journal/${next.slug}`}
            className="text-sm text-[var(--muted)] hover:text-foreground transition-colors text-right"
          >
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
