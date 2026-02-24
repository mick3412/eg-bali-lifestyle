import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { ArticleContent as ArticleContentType, PortableTextBlock } from "@/types";
import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";

function urlFor(source: { _type?: string; asset?: { _ref: string } } | undefined): string {
  if (!source?.asset || !client) return "/images/placeholder.svg";
  return imageUrlBuilder(client).image(source).auto("format").url();
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="typo-body mb-4 text-[var(--foreground)] leading-relaxed">{children}</p>,
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--accent)] underline hover:opacity-80"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      const src = urlFor(value);
      const alt = (value?.alt as string) ?? "";
      const link = value?.link as string | undefined;
      const img = (
        <span className="my-6 block">
          <Image
            src={src}
            alt={alt}
            width={896}
            height={504}
            className="w-full aspect-[2/1] object-cover"
            unoptimized={src.startsWith("http")}
          />
        </span>
      );
      if (link) {
        return (
          <a href={link} target="_blank" rel="noopener noreferrer" className="block my-6">
            <Image
              src={src}
              alt={alt}
              width={896}
              height={504}
              className="w-full aspect-[2/1] object-cover hover:opacity-95"
              unoptimized={src.startsWith("http")}
            />
          </a>
        );
      }
      return img;
    },
  },
};

type Props = { content: ArticleContentType };

export default function ArticleContent({ content }: Props) {
  if (typeof content === "string") {
    return (
      <div className="prose prose-neutral max-w-none text-foreground">
        {content.split("\n\n").map((para, i) => (
          <p key={i} className="typo-body mb-4 text-[var(--foreground)] leading-relaxed">
            {para}
          </p>
        ))}
      </div>
    );
  }
  if (Array.isArray(content) && content.length > 0) {
    return (
      <div className="prose prose-neutral max-w-none text-foreground">
        <PortableText value={content as PortableTextBlock[]} components={portableTextComponents} />
      </div>
    );
  }
  return null;
}
