import Link from "next/link";
import { getArticles } from "@/lib/cms";
import ArticleCard from "@/components/ArticleCard";

export const metadata = {
  title: "Journal — Eg. Bali Lifestyle",
  description: "Stories, wellness, and mindful living from Eg. Bali Lifestyle.",
};

export default async function JournalPage() {
  const articles = await getArticles();

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-10">Journal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
