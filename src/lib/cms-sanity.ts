/**
 * 從 Sanity 讀取內容的實作
 * 當 NEXT_PUBLIC_SANITY_PROJECT_ID 已設定時，cms.ts 會改用此模組的資料
 */
import { client, isSanityConfigured } from "./sanity";
import type { Product, Article, AboutContent, SiteSettings, InstagramPost, ProductCategory } from "@/types";
import imageUrlBuilder from "@sanity/image-url";

const getClient = () => (client ?? (null as never));

function urlFor(source: { _type?: string; asset?: { _ref: string } } | string): string {
  if (typeof source === "string") return source;
  if (!client) return "/images/placeholder.svg";
  return imageUrlBuilder(client).image({ ...source, _type: source._type ?? "image" }).auto("format").url();
}

export async function getSiteSettingsFromSanity(): Promise<SiteSettings | null> {
  if (!isSanityConfigured()) return null;
  const doc = await getClient().fetch<Record<string, unknown> | null>(
    `*[_type == "siteSettings"][0]`
  );
  if (!doc) return null;
  return {
    siteName: (doc.siteName as string) ?? "Eg. Bali Lifestyle",
    tagline: (doc.tagline as string) ?? "",
    taglineLong: (doc.taglineLong as string) ?? "",
    email: (doc.email as string) ?? "",
    instagramHandle: (doc.instagramHandle as string) ?? "",
    instagramUrl: (doc.instagramUrl as string) ?? "",
    copyright: (doc.copyright as string) ?? "",
  };
}

export async function getProductsFromSanity(category?: ProductCategory): Promise<Product[]> {
  if (!isSanityConfigured()) return [];
  const filter = category && category !== "all" ? `&& category == $category` : "";
  const list = await getClient().fetch<
    Array<{
      _id: string;
      slug: { current: string };
      name: string;
      nameEn?: string;
      category: string;
      price: number;
      originalPrice?: number;
      description: string;
      descriptionShort?: string;
      ingredients?: string;
      sizes?: string[];
      image?: { asset?: { _ref: string } };
      buyUrl?: string;
      order?: number;
    }>
  >(`*[_type == "product"]${filter} | order(order asc) { _id, slug, name, nameEn, category, price, originalPrice, description, descriptionShort, ingredients, sizes, image, buyUrl, order }`, {
    category,
  });
  return list.map((p) => ({
    id: p._id,
    slug: p.slug?.current ?? p._id,
    name: p.name,
    nameEn: p.nameEn,
    category: p.category as ProductCategory,
    price: p.price,
    originalPrice: p.originalPrice,
    description: p.description,
    descriptionShort: p.descriptionShort,
    ingredients: p.ingredients,
    sizes: p.sizes,
    image: p.image ? urlFor({ ...p.image, _type: "image" }) : "/images/placeholder.svg",
    buyUrl: p.buyUrl,
    order: p.order,
  }));
}

export async function getProductBySlugFromSanity(slug: string): Promise<Product | null> {
  if (!isSanityConfigured()) return null;
  const p = await getClient().fetch<
    {
      _id: string;
      slug: { current: string };
      name: string;
      nameEn?: string;
      category: string;
      price: number;
      originalPrice?: number;
      description: string;
      descriptionShort?: string;
      ingredients?: string;
      sizes?: string[];
      image?: { asset?: { _ref: string } };
      buyUrl?: string;
      order?: number;
    } | null
  >(`*[_type == "product" && slug.current == $slug][0]`, { slug });
  if (!p) return null;
  return {
    id: p._id,
    slug: p.slug?.current ?? p._id,
    name: p.name,
    nameEn: p.nameEn,
    category: p.category as ProductCategory,
    price: p.price,
    originalPrice: p.originalPrice,
    description: p.description,
    descriptionShort: p.descriptionShort,
    ingredients: p.ingredients,
    sizes: p.sizes,
    image: p.image ? urlFor({ ...p.image, _type: "image" }) : "/images/placeholder.svg",
    buyUrl: p.buyUrl,
    order: p.order,
  };
}

export async function getArticlesFromSanity(limit?: number): Promise<Article[]> {
  if (!isSanityConfigured()) return [];
  const list = await getClient().fetch<
    Array<{
      _id: string;
      slug: { current: string };
      title: string;
      category: string;
      excerpt: string;
      content: string;
      image?: { asset?: { _ref: string } };
      publishedAt: string;
      order?: number;
    }>
  >(`*[_type == "article"] | order(publishedAt desc) { _id, slug, title, category, excerpt, content, image, publishedAt, order }`);
  const mapped = list.map((a) => ({
    id: a._id,
    slug: a.slug?.current ?? a._id,
    title: a.title,
    category: a.category,
    excerpt: a.excerpt,
    content: a.content,
    image: a.image ? urlFor({ ...a.image, _type: "image" }) : "/images/placeholder.svg",
    publishedAt: a.publishedAt,
    order: a.order,
  }));
  return limit ? mapped.slice(0, limit) : mapped;
}

export async function getArticleBySlugFromSanity(slug: string): Promise<Article | null> {
  if (!isSanityConfigured()) return null;
  const a = await getClient().fetch<
    {
      _id: string;
      slug: { current: string };
      title: string;
      category: string;
      excerpt: string;
      content: string;
      image?: { asset?: { _ref: string } };
      publishedAt: string;
      order?: number;
    } | null
  >(`*[_type == "article" && slug.current == $slug][0]`, { slug });
  if (!a) return null;
  return {
    id: a._id,
    slug: a.slug?.current ?? a._id,
    title: a.title,
    category: a.category,
    excerpt: a.excerpt,
    content: a.content,
    image: a.image ? urlFor({ ...a.image, _type: "image" }) : "/images/placeholder.svg",
    publishedAt: a.publishedAt,
    order: a.order,
  };
}

export async function getAboutFromSanity(): Promise<AboutContent | null> {
  if (!isSanityConfigured()) return null;
  const doc = await getClient().fetch<{
    storyTitle?: string;
    storyContent?: string[];
    values?: { title: string; description: string }[];
    founderTitle?: string;
    founderName?: string;
    founderImage?: { asset?: { _ref: string } };
    founderBio?: string;
  } | null>(`*[_type == "about"][0]`);
  if (!doc) return null;
  return {
    storyTitle: doc.storyTitle ?? "Our Story",
    storyContent: doc.storyContent ?? [],
    values: doc.values,
    founderTitle: doc.founderTitle,
    founderName: doc.founderName,
    founderImage: doc.founderImage ? urlFor({ ...doc.founderImage, _type: "image" }) : undefined,
    founderBio: doc.founderBio,
  };
}

export async function getInstagramPostsFromSanity(limit = 6): Promise<InstagramPost[]> {
  if (!isSanityConfigured()) return [];
  const list = await getClient().fetch<
    Array<{ _id: string; imageUrl: string; link: string; order?: number }>
  >(`*[_type == "instagramPost"] | order(order asc) [0...${limit}] { _id, imageUrl, link, order }`);
  return list.map((p) => ({
    id: p._id,
    imageUrl: p.imageUrl,
    link: p.link,
    order: p.order,
  }));
}
