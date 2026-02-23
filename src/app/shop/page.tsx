import { getProducts, CATEGORY_LABELS } from "@/lib/cms";
import type { ProductCategory } from "@/types";
import ProductCard from "@/components/ProductCard";
import ShopCategoryNav from "./ShopCategoryNav";

export const metadata = {
  title: "Shop — Eg. Bali Lifestyle",
  description: "Curated essentials for mindful living. Skincare, body care, fragrance, and home.",
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function ShopPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const categoryFilter = (category as ProductCategory) || undefined;
  const products = await getProducts(categoryFilter);

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-8">Shop</h1>
      <ShopCategoryNav />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
