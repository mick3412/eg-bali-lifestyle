import Image from "next/image";
import { getAboutContent, getSiteSettings } from "@/lib/cms";

export const metadata = {
  title: "About — Eg. Bali Lifestyle",
  description: "Our story, values, and the intention behind Eg. Bali Lifestyle.",
};

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAboutContent(), getSiteSettings()]);

  return (
    <div className="max-w-3xl mx-auto px-5 py-10 md:py-14">
      <h1 className="typo-sectionTitle font-semibold text-foreground mb-10">
        {about.storyTitle}
      </h1>

      <div className="space-y-6 typo-body text-[var(--foreground)] leading-relaxed mb-14">
        {about.storyContent.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {about.values && about.values.length > 0 && (
        <section className="mb-14">
          <h2 className="typo-sectionTitle font-semibold text-foreground mb-8 text-center">
            What We Stand For
          </h2>
          <div className="space-y-10">
            {about.values.map((value) => (
              <div key={value.title} className="text-center">
                <h3 className="typo-cardTitle font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="typo-body text-[var(--muted)] max-w-xl mx-auto">{value.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-[var(--border)] pt-14">
        <p className="typo-sectionTitle font-semibold text-foreground mb-2">{settings.siteName}</p>
        <p className="typo-bodySmall text-[var(--muted)] mb-2">
          {settings.tagline}. {settings.taglineLong}
        </p>
        {(about.founderTitle || about.founderName || about.founderImage || about.founderBio) && (
          <div className="mt-8">
            {about.founderImage && about.founderImage.startsWith("http") && (
              <div className="aspect-square max-w-[280px] relative rounded-full overflow-hidden mb-4">
                <Image
                  src={about.founderImage}
                  alt={about.founderName ?? "創辦人"}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
            )}
            {about.founderTitle && (
              <p className="typo-caption tracking-widest uppercase text-[var(--muted)]">
                {about.founderTitle}
              </p>
            )}
            {about.founderName && (
              <p className="typo-sectionTitle font-semibold text-foreground mt-1">{about.founderName}</p>
            )}
            {about.founderBio && (
              <p className="typo-bodySmall text-[var(--muted)] mt-2">{about.founderBio}</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
