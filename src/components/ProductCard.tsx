import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

function formatPrice(n: number) {
  return `NT$ ${n.toLocaleString()}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="aspect-[3/4] relative bg-[var(--border)] overflow-hidden mb-3">
        <Image
          src={product.image}
          alt={(product.name?.trim() || product.nameEn) ?? product.name ?? ""}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </div>
      <p className="typo-cardTitle font-medium text-foreground group-hover:text-[var(--accent)] transition-colors">
        {(product.name?.trim() || product.nameEn) ?? product.name}
      </p>
      <p className="typo-price text-[var(--muted)] mt-0.5">
        {formatPrice(product.price)}
        {product.originalPrice != null && (
          <span className="ml-2 line-through">{formatPrice(product.originalPrice)}</span>
        )}
      </p>
    </Link>
  );
}
