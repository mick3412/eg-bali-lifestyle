import { getProducts, getCategories } from "@/lib/cms";
import ProductCard from "@/components/ProductCard";
import ShopCategoryNav from "./ShopCategoryNav";

export const metadata = {
  title: "Shop — Eg. Bali Lifestyle",
  description: "Curated essentials for mindful living. Skincare, body care, fragrance, and home.",
};

type Props = { searchParams: Promise<{ category?: string | string[]; sub?: string | string[] }> };

function normalizeParam(param: string | string[] | undefined): string | undefined {
  if (param == null) return undefined;
  const value = Array.isArray(param) ? param[0] : param;
  return typeof value === "string" ? value.trim() : undefined;
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const categoryParam = normalizeParam(params.category);
  const subParam = normalizeParam(params.sub);

  const categories = await getCategories();

  const slugByLower = new Map(
    categories.map((c) => {
      const s = (c.slug || "").trim();
      return [s.toLowerCase(), s];
    })
  );
  const categorySlug =
    categoryParam === "all" || !categoryParam
      ? "all"
      : slugByLower.get(categoryParam.toLowerCase()) ?? "all";

  const products = await getProducts(categorySlug === "all" ? undefined : categorySlug);

  const filtered = subParam
    ? products.filter((p) =>
      p.subcategory?.some((s) => s.toLowerCase() === subParam.toLowerCase())
    )
    : products;

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
      <h1 className="typo-sectionTitle font-semibold text-foreground mb-10">Shop</h1>

      {/* Two-column layout: left sidebar + right product grid */}
      <div className="flex gap-4 md:gap-14 items-start">
        {/* Left sidebar */}
        <aside className="shrink-0 w-[100px] md:w-36 sticky top-20 md:top-24">
          <ShopCategoryNav
            categories={categories}
            currentCategory={categorySlug}
            currentSubcategory={subParam}
          />
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-full typo-body text-[var(--muted)] text-center py-12">
                暫無商品
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
