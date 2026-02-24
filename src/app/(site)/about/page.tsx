import { getAboutContent } from "@/lib/cms";
import ArticleContent from "@/components/ArticleContent";

export const metadata = {
  title: "About — Eg. Bali Lifestyle",
  description: "Our story and the intention behind Eg. Bali Lifestyle.",
};

export default async function AboutPage() {
  const about = await getAboutContent();

  return (
    <div className="max-w-3xl mx-auto px-5 py-10 md:py-14">
      <h1 className="typo-sectionTitle font-semibold text-foreground mb-10">
        {about.storyTitle}
      </h1>
      <ArticleContent content={about.storyContent} />
    </div>
  );
}
