import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, CATEGORY_LABELS } from "@/lib/cms";
import ProductCard from "@/components/ProductCard";

function formatPrice(n: number) {
  return `NT$ ${n.toLocaleString()}`;
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product — Eg. Bali Lifestyle" };
  return {
    title: `${product.nameEn ?? product.name} — Eg. Bali Lifestyle`,
    description: product.descriptionShort ?? product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
      <nav className="text-sm text-[var(--muted)] mb-6">
        <Link href="/" className="hover:text-foreground">首頁</Link>
        <span className="mx-1">/</span>
        <Link href="/shop" className="hover:text-foreground">Shop</Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">{product.nameEn ?? product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        <div className="aspect-[3/4] relative bg-[var(--border)] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div>
          <p className="text-xs tracking-widest uppercase text-[var(--muted)] mb-1">
            {CATEGORY_LABELS[product.category]}
          </p>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-3">
            {product.nameEn ?? product.name}
          </h1>
          <p className="text-lg text-foreground mb-2">
            {formatPrice(product.price)}
            {product.originalPrice != null && (
              <span className="ml-2 text-sm text-[var(--muted)] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </p>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
            {product.description}
          </p>
          {product.ingredients && (
            <div className="mb-6">
              <h3 className="text-xs font-medium uppercase tracking-widest text-foreground mb-2">成分</h3>
              <p className="text-sm text-[var(--muted)]">{product.ingredients}</p>
            </div>
          )}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-medium uppercase tracking-widest text-foreground mb-2">尺寸</h3>
              <p className="text-sm text-[var(--muted)]">{product.sizes.join("、")}</p>
            </div>
          )}
          {product.buyUrl ? (
            <a
              href={product.buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-3 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
            >
              前往購買
              <span aria-hidden>→</span>
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 bg-[var(--border)] text-[var(--muted)] px-6 py-3 text-sm cursor-not-allowed">
              前往購買（請在 CMS 設定連結）
            </span>
          )}
          <p className="mt-4">
            <Link href="/shop" className="text-sm text-[var(--muted)] hover:text-foreground transition-colors">
              ← 返回商店
            </Link>
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 md:mt-24 pt-14 border-t border-[var(--border)]">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">相關產品</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
