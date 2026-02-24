import { getProducts, getCategories } from "@/lib/cms";
import ProductCard from "@/components/ProductCard";
import ShopCategoryNav from "./ShopCategoryNav";

export const metadata = {
  title: "Shop — Eg. Bali Lifestyle",
  description: "Curated essentials for mindful living. Skincare, body care, fragrance, and home.",
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function ShopPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const categories = await getCategories();
  const validSlugs = new Set(categories.map((c) => c.slug));
  const categorySlug =
    category && (category === "all" || validSlugs.has(category)) ? category : "all";
  const products = await getProducts(categorySlug === "all" ? undefined : categorySlug);

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-8">Shop</h1>
      <ShopCategoryNav categories={categories} currentCategory={categorySlug} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
