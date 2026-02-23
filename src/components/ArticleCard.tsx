import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured";
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  if (variant === "featured") {
    return (
      <Link href={`/journal/${article.slug}`} className="group block">
        <div className="aspect-[2/1] md:aspect-[3/1] relative bg-[var(--border)] overflow-hidden mb-4">
          <Image
            src={article.image}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="100vw"
          />
        </div>
        <p className="text-xs tracking-widest uppercase text-[var(--accent)] mb-1">{article.category}</p>
        <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground group-hover:text-[var(--accent)] transition-colors">
          {article.title}
        </h2>
        <p className="text-sm text-[var(--muted)] mt-1 line-clamp-2">{article.excerpt}</p>
        <p className="text-xs text-[var(--muted)] mt-2">{formatDate(article.publishedAt)}</p>
      </Link>
    );
  }

  return (
    <Link href={`/journal/${article.slug}`} className="group block">
      <div className="aspect-[4/3] relative bg-[var(--border)] overflow-hidden mb-3">
        <Image
          src={article.image}
          alt=""
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <p className="text-xs tracking-widest uppercase text-[var(--accent)] mb-1">{article.category}</p>
      <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-[var(--accent)] transition-colors">
        {article.title}
      </h3>
      <p className="text-sm text-[var(--muted)] mt-1 line-clamp-2">{article.excerpt}</p>
      <p className="text-xs text-[var(--muted)] mt-2">{formatDate(article.publishedAt)}</p>
    </Link>
  );
}
