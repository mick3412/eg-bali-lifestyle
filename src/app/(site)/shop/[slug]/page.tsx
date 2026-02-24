import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getCategoryName } from "@/lib/cms";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";

function formatPrice(n: number) {
  return `NT$ ${n.toLocaleString()}`;
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product — Eg. Bali Lifestyle" };
  const displayName = (product.name?.trim() || product.nameEn) ?? product.name ?? "";
  return {
    title: `${displayName} — Eg. Bali Lifestyle`,
    description: product.descriptionShort ?? product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, categoryName] = await Promise.all([
    getRelatedProducts(product, 4),
    getCategoryName(product.category),
  ]);

  const galleryItems = [
    { type: "image" as const, url: product.image },
    ...(product.gallery ?? []),
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
      <nav className="typo-bodySmall text-[var(--muted)] mb-6">
        <Link href="/" className="hover:text-foreground">首頁</Link>
        <span className="mx-1">/</span>
        <Link href="/shop" className="hover:text-foreground">Shop</Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">{(product.name?.trim() || product.nameEn) ?? product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        <ProductGallery items={galleryItems} alt={(product.name?.trim() || product.nameEn) ?? product.name ?? ""} />
        <div>
          <p className="typo-caption tracking-widest uppercase text-[var(--muted)] mb-1">
            {categoryName}
          </p>
          <h1 className="typo-sectionTitle font-semibold text-foreground mb-3">
            {(product.name?.trim() || product.nameEn) ?? product.name}
          </h1>
          <p className="typo-body text-[var(--muted)] leading-relaxed mb-6">
            {product.description}
          </p>
          {product.ingredients && (
            <div className="mb-6">
              <h3 className="typo-caption font-medium uppercase tracking-widest text-foreground mb-2">成分</h3>
              <p className="typo-bodySmall text-[var(--muted)]">{product.ingredients}</p>
            </div>
          )}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="typo-caption font-medium uppercase tracking-widest text-foreground mb-2">尺寸</h3>
              <p className="typo-bodySmall text-[var(--muted)]">{product.sizes.join("、")}</p>
            </div>
          )}
          <div className="mt-6 mb-4">
            <p className="typo-price text-foreground mb-1">
              {formatPrice(product.price)}
              {product.originalPrice != null && (
                <span className="ml-2 typo-bodySmall text-[var(--muted)] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </p>
            {product.stockStatus && (
              <p className="typo-caption tracking-widest uppercase text-[var(--muted)]">
                {product.stockStatus === "in_stock" && "有庫存"}
                {product.stockStatus === "out_of_stock" && "暫無庫存"}
                {product.stockStatus === "preorder" && "可預訂"}
              </p>
            )}
          </div>
          {product.buyUrl ? (
            <a
              href={product.buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="typo-button inline-flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-3 tracking-widest uppercase hover:opacity-90 transition-opacity"
            >
              前往購買
              <span aria-hidden>→</span>
            </a>
          ) : (
            <span className="typo-button inline-flex items-center gap-2 bg-[var(--border)] text-[var(--muted)] px-6 py-3 cursor-not-allowed">
              前往購買（請在 CMS 設定連結）
            </span>
          )}
          <p className="mt-4">
            <Link href="/shop" className="typo-bodySmall text-[var(--muted)] hover:text-foreground transition-colors">
              ← 返回商店
            </Link>
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 md:mt-24 pt-14 border-t border-[var(--border)]">
          <h2 className="typo-sectionTitle font-semibold text-foreground mb-6">相關產品</h2>
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
