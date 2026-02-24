/**
 * 從 Sanity 讀取內容的實作
 * 當 NEXT_PUBLIC_SANITY_PROJECT_ID 已設定時，cms.ts 會改用此模組的資料
 */
import { client, isSanityConfigured } from "./sanity";
import type { Product, Article, AboutContent, SiteSettings, InstagramPost, ProductCategoryItem, PortableTextBlock } from "@/types";
import imageUrlBuilder from "@sanity/image-url";

const getClient = () => (client ?? (null as never));

function urlFor(source: { _type?: string; asset?: { _ref: string; _id?: string } } | string | undefined): string {
  if (typeof source === "string") return source;
  if (!source || !client) return "/images/placeholder.svg";
  const img = { ...source, _type: source._type ?? "image" };
  const ref = source.asset?._ref ?? (source.asset as { _id?: string })?._id;
  if (ref) (img as { asset?: { _ref: string } }).asset = { _ref: ref };
  try {
    const url = imageUrlBuilder(client).image(img).auto("format").url();
    return url && url.startsWith("http") ? url : "/images/placeholder.svg";
  } catch {
    return "/images/placeholder.svg";
  }
}

/** 從 GROQ 取得圖片 URL（展開 asset->url 最穩定，避免前端破圖） */
const productImageProjection = '"image": image.asset->url';
const articleImageProjection = '"image": image.asset->url';

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

/** 取得產品分類列表（Studio 可新增/編輯） */
export async function getCategoriesFromSanity(): Promise<ProductCategoryItem[]> {
  if (!isSanityConfigured()) return [];
  const list = await getClient().fetch<
    Array<{ _id: string; slug: { current: string } | null; name: string; order?: number }>
  >(`*[_type == "productCategory"] | order(order asc) { _id, slug, name, order }`);
  return list
    .filter((c) => c.slug?.current)
    .map((c) => ({
      id: c._id,
      slug: c.slug!.current,
      name: c.name,
      order: c.order,
    }));
}

export async function getProductsFromSanity(categorySlug?: string): Promise<Product[]> {
  if (!isSanityConfigured()) return [];
  const filter = categorySlug && categorySlug !== "all" ? `&& category->slug.current == $categorySlug` : "";
  const list = await getClient().fetch<
    Array<{
      _id: string;
      slug: { current: string };
      name: string;
      nameEn?: string;
      category: { _id: string; slug: { current: string } | null; name?: string } | null;
      price: number;
      originalPrice?: number;
      description: string;
      descriptionShort?: string;
      ingredients?: string;
      sizes?: string[];
      image?: string | null;
      buyUrl?: string;
      order?: number;
      featured?: boolean;
      homepageOrder?: number;
      stockStatus?: string;
    }>
  >(
    `*[_type == "product"]${filter} | order(order asc) {
      _id, slug, name, nameEn, "category": category->{ _id, slug, name },
      price, originalPrice, description, descriptionShort, ingredients, sizes, ${productImageProjection}, buyUrl, order, featured, homepageOrder, stockStatus
    }`,
    { categorySlug }
  );
  return list.map((p) => ({
    id: p._id,
    slug: p.slug?.current ?? p._id,
    name: p.name,
    nameEn: p.nameEn,
    category: p.category?.slug?.current ?? "",
    price: p.price,
    originalPrice: p.originalPrice,
    description: p.description,
    descriptionShort: p.descriptionShort,
    ingredients: p.ingredients,
    sizes: p.sizes,
    image: p.image && p.image.startsWith("http") ? p.image : "/images/placeholder.svg",
    buyUrl: p.buyUrl,
    order: p.order,
    featured: p.featured,
    homepageOrder: p.homepageOrder,
    stockStatus: p.stockStatus === "in_stock" || p.stockStatus === "out_of_stock" || p.stockStatus === "preorder" ? p.stockStatus : undefined,
  }));
}

/** 首頁 Selected Products：只回傳有勾選「首頁精選」的產品，依 homepageOrder 排序 */
export async function getFeaturedProductsFromSanity(limit = 8): Promise<Product[]> {
  if (!isSanityConfigured()) return [];
  const list = await getClient().fetch<
    Array<{
      _id: string;
      slug: { current: string };
      name: string;
      nameEn?: string;
      category: { slug: { current: string } | null } | null;
      price: number;
      originalPrice?: number;
      description: string;
      descriptionShort?: string;
      ingredients?: string;
      sizes?: string[];
      image?: string | null;
      buyUrl?: string;
      order?: number;
      featured?: boolean;
      homepageOrder?: number;
      stockStatus?: string;
    }>
  >(
    `*[_type == "product" && featured == true] | order(homepageOrder asc, order asc) [0...$limit] {
      _id, slug, name, nameEn, "category": category->{ "slug": slug },
      price, originalPrice, description, descriptionShort, ingredients, sizes, ${productImageProjection}, buyUrl, order, featured, homepageOrder, stockStatus
    }`,
    { limit }
  );
  return list.map((p) => ({
    id: p._id,
    slug: p.slug?.current ?? p._id,
    name: p.name,
    nameEn: p.nameEn,
    category: p.category?.slug?.current ?? "",
    price: p.price,
    originalPrice: p.originalPrice,
    description: p.description,
    descriptionShort: p.descriptionShort,
    ingredients: p.ingredients,
    sizes: p.sizes,
    image: p.image && p.image.startsWith("http") ? p.image : "/images/placeholder.svg",
    buyUrl: p.buyUrl,
    order: p.order,
    featured: p.featured,
    homepageOrder: p.homepageOrder,
    stockStatus: p.stockStatus === "in_stock" || p.stockStatus === "out_of_stock" || p.stockStatus === "preorder" ? p.stockStatus : undefined,
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
      category: { slug: { current: string } | null } | null;
      price: number;
      originalPrice?: number;
      description: string;
      descriptionShort?: string;
      ingredients?: string;
      sizes?: string[];
      image?: string | null;
      buyUrl?: string;
      order?: number;
      featured?: boolean;
      homepageOrder?: number;
      stockStatus?: string;
    } | null
  >(`*[_type == "product" && slug.current == $slug][0]{ _id, slug, name, nameEn, "category": category->{ "slug": slug }, price, originalPrice, description, descriptionShort, ingredients, sizes, ${productImageProjection}, buyUrl, order, featured, homepageOrder, stockStatus }`, {
    slug,
  });
  if (!p) return null;
  return {
    id: p._id,
    slug: p.slug?.current ?? p._id,
    name: p.name,
    nameEn: p.nameEn,
    category: p.category?.slug?.current ?? "",
    price: p.price,
    originalPrice: p.originalPrice,
    description: p.description,
    descriptionShort: p.descriptionShort,
    ingredients: p.ingredients,
    sizes: p.sizes,
    image: p.image && p.image.startsWith("http") ? p.image : "/images/placeholder.svg",
    buyUrl: p.buyUrl,
    order: p.order,
    featured: p.featured,
    homepageOrder: p.homepageOrder,
    stockStatus: p.stockStatus === "in_stock" || p.stockStatus === "out_of_stock" || p.stockStatus === "preorder" ? p.stockStatus : undefined,
  };
}

/** 首頁 From the Journal：只回傳有勾選精選的文章 */
export async function getFeaturedArticlesFromSanity(limit = 6): Promise<Article[]> {
  if (!isSanityConfigured()) return [];
  const list = await getClient().fetch<
    Array<{
      _id: string;
      slug: { current: string };
      title: string;
      category: string;
      excerpt: string;
      content: unknown;
      image?: string | null;
      publishedAt: string;
      order?: number;
      featured?: boolean;
      homepageOrder?: number;
    }>
  >(
    `*[_type == "article" && featured == true] | order(homepageOrder asc, publishedAt desc) [0...$limit] {
      _id, slug, title, category, excerpt, content, ${articleImageProjection}, publishedAt, order, featured, homepageOrder
    }`,
    { limit }
  );
  return list.map((a) => mapArticleFromSanity(a, undefined));
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
      content: unknown;
      image?: string | null;
      publishedAt: string;
      order?: number;
      featured?: boolean;
      homepageOrder?: number;
    }>
  >(`*[_type == "article"] | order(publishedAt desc) { _id, slug, title, category, excerpt, content, ${articleImageProjection}, publishedAt, order, featured, homepageOrder }`);
  const mapped = list.map((a) => mapArticleFromSanity(a, undefined));
  return limit ? mapped.slice(0, limit) : mapped;
}

function mapArticleFromSanity(
  a: {
    _id: string;
    slug: { current: string };
    title: string;
    category: string;
    excerpt: string;
    content: unknown;
    image?: string | null;
    publishedAt: string;
    order?: number;
    featured?: boolean;
    homepageOrder?: number;
  },
  relatedProducts?: Product[]
): Article {
  const content: Article["content"] = Array.isArray(a.content) ? (a.content as PortableTextBlock[]) : (a.content as string) ?? "";
  return {
    id: a._id,
    slug: a.slug?.current ?? a._id,
    title: a.title,
    category: a.category,
    excerpt: a.excerpt,
    content,
    image: a.image && a.image.startsWith("http") ? a.image : "/images/placeholder.svg",
    publishedAt: a.publishedAt,
    order: a.order,
    featured: a.featured,
    homepageOrder: a.homepageOrder,
    relatedProducts,
  };
}

function mapSanityProductToProduct(p: {
  _id: string;
  slug: { current: string };
  name: string;
  nameEn?: string;
  category: { slug: { current: string } | null } | null;
  price: number;
  originalPrice?: number;
  description: string;
  descriptionShort?: string;
  ingredients?: string;
  sizes?: string[];
  image?: string | null;
  buyUrl?: string;
  order?: number;
  featured?: boolean;
  homepageOrder?: number;
  stockStatus?: string;
}): Product {
  return {
    id: p._id,
    slug: p.slug?.current ?? p._id,
    name: p.name,
    nameEn: p.nameEn,
    category: p.category?.slug?.current ?? "",
    price: p.price,
    originalPrice: p.originalPrice,
    description: p.description,
    descriptionShort: p.descriptionShort,
    ingredients: p.ingredients,
    sizes: p.sizes,
    image: p.image && p.image.startsWith("http") ? p.image : "/images/placeholder.svg",
    buyUrl: p.buyUrl,
    order: p.order,
    featured: p.featured,
    homepageOrder: p.homepageOrder,
    stockStatus: p.stockStatus === "in_stock" || p.stockStatus === "out_of_stock" || p.stockStatus === "preorder" ? p.stockStatus : undefined,
  };
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
      content: unknown;
      image?: string | null;
      publishedAt: string;
      order?: number;
      featured?: boolean;
      homepageOrder?: number;
      relatedProducts?: Array<{
        _id: string;
        slug: { current: string };
        name: string;
        nameEn?: string;
        category: { slug: { current: string } | null } | null;
        price: number;
        originalPrice?: number;
        description: string;
        descriptionShort?: string;
        ingredients?: string;
        sizes?: string[];
        image?: string | null;
        buyUrl?: string;
        order?: number;
        featured?: boolean;
        homepageOrder?: number;
        stockStatus?: string;
      } | null>;
    } | null
  >(
    `*[_type == "article" && slug.current == $slug][0]{
      _id, slug, title, category, excerpt, content, ${articleImageProjection}, publishedAt, order, featured, homepageOrder,
      "relatedProducts": relatedProducts[]->{ _id, slug, name, nameEn, "category": category->{ "slug": slug }, price, originalPrice, description, descriptionShort, ingredients, sizes, "image": image.asset->url, buyUrl, order, featured, homepageOrder, stockStatus }
    }`,
    { slug }
  );
  if (!a) return null;
  const relatedProducts = (a.relatedProducts ?? [])
    .filter((r): r is NonNullable<typeof r> => r != null)
    .map((r) => mapSanityProductToProduct(r));
  return mapArticleFromSanity(a, relatedProducts);
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
