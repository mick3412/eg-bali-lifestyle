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
    <div className="max-w-6xl mx-auto px-5 py-6 md:py-10">
      <h1 className="typo-sectionTitle font-semibold text-foreground mb-6 md:mb-8 md:text-center">Shop</h1>

      {/* Categories in standard top-down layout */}
      <ShopCategoryNav
        categories={categories}
        currentCategory={categorySlug}
        currentSubcategory={subParam}
      />

      {/* Product grid: 2 columns on mobile, 3/4 on larger screens, gap adjustments for mobile compactness */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-10 mt-4 md:mt-8">
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
  );
}
