/**
 * 從 Sanity 讀取內容的實作
 * 當 NEXT_PUBLIC_SANITY_PROJECT_ID 已設定時，cms.ts 會改用此模組的資料
 */
import { client, isSanityConfigured } from "./sanity";
import type { Product, Article, AboutContent, SiteSettings, ProductCategoryItem, PortableTextBlock, TypographySettings } from "@/types";
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
/** 文章縮圖：保留 image 物件由 urlFor 建 URL，較穩定 */
const articleImageSelect = 'image';

type SanityImageSource = { _type?: string; asset?: { _ref: string; _id?: string } } | string | null | undefined;

export async function getSiteSettingsFromSanity(): Promise<SiteSettings | null> {
  if (!isSanityConfigured()) return null;
  const doc = await getClient().fetch<{
    siteName?: string;
    tagline?: string;
    taglineLong?: string;
    email?: string;
    instagramHandle?: string;
    instagramUrl?: string;
    instagramPosts?: Array<{ imageUrl?: string | null; url?: string | null }>;
    copyright?: string;
    googleTagId?: string;
    metaPixelId?: string;
    bannerImages?: Array<{ url?: string; link?: string; alt?: string; order?: number }>;
  } | null>(
    `*[_type == "siteSettings"][0] {
      siteName, tagline, taglineLong, email, instagramHandle, instagramUrl,
      "instagramPosts": instagramPosts[] {
        "imageUrl": image.asset->url,
        url
      },
      copyright, googleTagId, metaPixelId,
      "bannerImages": bannerImages[] {
        "url": image.asset->url,
        link,
        alt,
        order
      }
    }`
  );
  if (!doc) return null;
  const bannerImages = (doc.bannerImages ?? [])
    .filter((b) => b.url && b.url.startsWith("http"))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 3)
    .map((b) => ({ url: b.url!, link: b.link, alt: b.alt, order: b.order }));
  const instagramPosts =
    (doc.instagramPosts ?? [])
      .filter((p): p is { imageUrl: string; url: string } => !!p.imageUrl && !!p.url && p.imageUrl.startsWith("http") && p.url.startsWith("http"))
      .slice(0, 4)
      .map((p) => ({ imageUrl: p.imageUrl, link: p.url }));
  return {
    bannerImages: bannerImages.length > 0 ? bannerImages : undefined,
    siteName: doc.siteName ?? "Eg. Bali Lifestyle",
    tagline: doc.tagline ?? "",
    taglineLong: doc.taglineLong ?? "",
    email: doc.email ?? "",
    instagramHandle: doc.instagramHandle ?? "",
    instagramUrl: doc.instagramUrl ?? "",
    instagramPosts: instagramPosts.length > 0 ? instagramPosts : undefined,
    copyright: doc.copyright ?? "",
    googleTagId: doc.googleTagId && doc.googleTagId.trim() ? doc.googleTagId.trim() : undefined,
    metaPixelId: doc.metaPixelId && doc.metaPixelId.trim() ? doc.metaPixelId.trim() : undefined,
  };
}

export async function getTypographyFromSanity(): Promise<TypographySettings | null> {
  if (!isSanityConfigured()) return null;
  const doc = await getClient().fetch<{ styles?: Array<{ key?: string; name?: string; fontFamily?: string; fontSize?: string }> } | null>(
    `*[_type == "typographySettings"][0] { "styles": styles[] { key, name, fontFamily, fontSize } }`
  );
  if (!doc?.styles?.length) return null;
  return {
    styles: doc.styles
      .filter((s) => s.key)
      .map((s) => ({ key: s.key!, name: s.name, fontFamily: s.fontFamily, fontSize: s.fontSize })),
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
      slug: (c.slug!.current || "").trim(),
      name: c.name,
      order: c.order,
    }));
}

function mapSanityProductToProduct(p: {
  _id: string;
  slug: { current: string };
  name: string;
  nameEn?: string;
  category: { _id?: string; slug: { current: string } | null; name?: string } | null;
  price: number;
  originalPrice?: number;
  description: string;
  descriptionShort?: string;
  ingredients?: string;
  sizes?: string[];
  image?: string | null;
  buyUrl?: string;
  featured?: boolean;
  homepageOrder?: number;
  stockStatus?: string;
}): Product {
  const categorySlug = (p.category?.slug?.current ?? "").trim();
  return {
    id: p._id,
    slug: p.slug?.current ?? p._id,
    name: p.name,
    nameEn: p.nameEn,
    category: categorySlug,
    price: p.price,
    originalPrice: p.originalPrice,
    description: p.description,
    descriptionShort: p.descriptionShort,
    ingredients: p.ingredients,
    sizes: p.sizes,
    image: p.image && p.image.startsWith("http") ? p.image : "/images/placeholder.svg",
    buyUrl: p.buyUrl,
    featured: p.featured,
    homepageOrder: p.homepageOrder,
    stockStatus: p.stockStatus === "in_stock" || p.stockStatus === "out_of_stock" || p.stockStatus === "preorder" ? p.stockStatus : undefined,
  };
}

/** 產品列表查詢用型別（含 category 展開） */
const productListProjection = `{
  _id, slug, name, nameEn, "category": category->{ _id, slug, name },
  price, originalPrice, description, descriptionShort, ingredients, sizes, ${productImageProjection}, buyUrl, featured, homepageOrder, stockStatus
}`;

function categorySlugMatches(productCategory: string, selectedSlug: string): boolean {
  const a = (productCategory ?? "").trim().toLowerCase();
  const b = (selectedSlug ?? "").trim().toLowerCase();
  return a.length > 0 && b.length > 0 && a === b;
}

export async function getProductsFromSanity(categorySlug?: string): Promise<Product[]> {
  if (!isSanityConfigured()) return [];
  const raw = typeof categorySlug === "string" && categorySlug !== "all" ? categorySlug.trim() : "";
  const selectedSlug = raw || "";

  // 一律先取回全部產品，再在程式中依分類 slug 篩選，避免 GROQ reference/slug 比對差異
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
      featured?: boolean;
      homepageOrder?: number;
      stockStatus?: string;
    }>
  >(`*[_type == "product"] | order(order asc, _createdAt asc) ${productListProjection}`);

  const all = Array.isArray(list) ? list.map(mapSanityProductToProduct) : [];

  if (!selectedSlug) return all;

  return all.filter((p) => categorySlugMatches(p.category, selectedSlug));
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
      featured?: boolean;
      homepageOrder?: number;
      stockStatus?: string;
    }>
  >(
    `*[_type == "product" && featured == true] | order(homepageOrder asc, _createdAt asc) [0...$limit] {
      _id, slug, name, nameEn, "category": category->{ "slug": slug },
      price, originalPrice, description, descriptionShort, ingredients, sizes, ${productImageProjection}, buyUrl, featured, homepageOrder, stockStatus
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
    featured: p.featured,
    homepageOrder: p.homepageOrder,
    stockStatus: p.stockStatus === "in_stock" || p.stockStatus === "out_of_stock" || p.stockStatus === "preorder" ? p.stockStatus : undefined,
  }));
}

const productGalleryProjection = '"gallery": gallery[] { _type, "url": asset->url }';

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
      gallery?: Array<{ _type: string; url?: string | null }>;
      buyUrl?: string;
      featured?: boolean;
      homepageOrder?: number;
      stockStatus?: string;
    } | null
  >(`*[_type == "product" && slug.current == $slug][0]{ _id, slug, name, nameEn, "category": category->{ "slug": slug }, price, originalPrice, description, descriptionShort, ingredients, sizes, ${productImageProjection}, ${productGalleryProjection}, buyUrl, featured, homepageOrder, stockStatus }`, {
    slug,
  });
  if (!p) return null;
  const mainImage = p.image && p.image.startsWith("http") ? p.image : "/images/placeholder.svg";
  const galleryItems = (p.gallery ?? [])
    .filter((g): g is { _type: string; url: string } => !!g?.url && g.url.startsWith("http"))
    .map((g) => ({ type: (g._type === "file" ? "video" : "image") as "image" | "video", url: g.url }));
  const gallery = galleryItems.length > 0 ? galleryItems : undefined;
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
    image: mainImage,
    gallery,
    buyUrl: p.buyUrl,
    featured: p.featured,
    homepageOrder: p.homepageOrder,
    stockStatus: p.stockStatus === "in_stock" || p.stockStatus === "out_of_stock" || p.stockStatus === "preorder" ? p.stockStatus : undefined,
  };
}

/** 相關產品：依分類只取數筆，避免拉全量 */
export async function getRelatedProductsFromSanity(
  excludeId: string,
  categorySlug: string,
  limit: number
): Promise<Product[]> {
  if (!isSanityConfigured() || !categorySlug) return [];
  const filter = `&& _id != $excludeId && (
    (category->slug.current != null && lower(category->slug.current) == lower($categorySlug)) ||
    (category->name != null && lower(category->name) == lower($categorySlug))
  )`;
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
      featured?: boolean;
      homepageOrder?: number;
      stockStatus?: string;
    }>
  >(
    `*[_type == "product"]${filter} | order(_createdAt asc) [0...$limit] {
      _id, slug, name, nameEn, "category": category->{ _id, slug, name },
      price, originalPrice, description, descriptionShort, ingredients, sizes, ${productImageProjection}, buyUrl, featured, homepageOrder, stockStatus
    }`,
    { excludeId, categorySlug, limit }
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
    featured: p.featured,
    homepageOrder: p.homepageOrder,
    stockStatus: p.stockStatus === "in_stock" || p.stockStatus === "out_of_stock" || p.stockStatus === "preorder" ? p.stockStatus : undefined,
  }));
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
      image?: SanityImageSource;
      publishedAt: string;
      order?: number;
      featured?: boolean;
      homepageOrder?: number;
    }>
  >(
    `*[_type == "article" && featured == true] | order(homepageOrder asc, publishedAt desc) [0...$limit] {
      _id, slug, title, category, excerpt, content, ${articleImageSelect}, publishedAt, order, featured, homepageOrder
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
      image?: SanityImageSource;
      publishedAt: string;
      order?: number;
      featured?: boolean;
      homepageOrder?: number;
    }>
  >(`*[_type == "article"] | order(publishedAt desc) { _id, slug, title, category, excerpt, content, ${articleImageSelect}, publishedAt, order, featured, homepageOrder }`);
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
    image?: SanityImageSource;
    publishedAt: string;
    order?: number;
    featured?: boolean;
    homepageOrder?: number;
  },
  relatedProducts?: Product[]
): Article {
  const content: Article["content"] = Array.isArray(a.content) ? (a.content as PortableTextBlock[]) : (a.content as string) ?? "";
  const imageUrl = typeof a.image === "string" && a.image.startsWith("http") ? a.image : urlFor(a.image as { _type?: string; asset?: { _ref: string } } | undefined);
  return {
    id: a._id,
    slug: a.slug?.current ?? a._id,
    title: a.title,
    category: a.category,
    excerpt: a.excerpt,
    content,
    image: imageUrl || "/images/placeholder.svg",
    publishedAt: a.publishedAt,
    order: a.order,
    featured: a.featured,
    homepageOrder: a.homepageOrder,
    relatedProducts,
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
      image?: SanityImageSource;
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
      _id, slug, title, category, excerpt, content, ${articleImageSelect}, publishedAt, order, featured, homepageOrder,
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
    storyContent?: unknown;
    values?: { title: string; description: string }[];
    founderTitle?: string;
    founderName?: string;
    founderImage?: { asset?: { _ref: string } };
    founderBio?: string;
  } | null>(`*[_type == "about"][0]`);
  if (!doc) return null;
  const raw = doc.storyContent;
  let storyContent: AboutContent["storyContent"] = "";
  if (Array.isArray(raw) && raw.length > 0) {
    const first = raw[0];
    if (typeof first === "object" && first !== null && "_type" in first) {
      storyContent = raw as PortableTextBlock[];
    } else {
      storyContent = (raw as string[]).join("\n\n");
    }
  }
  return {
    storyTitle: doc.storyTitle ?? "Our Story",
    storyContent,
    values: doc.values,
    founderTitle: doc.founderTitle,
    founderName: doc.founderName,
    founderImage: doc.founderImage ? urlFor({ ...doc.founderImage, _type: "image" }) : undefined,
    founderBio: doc.founderBio,
  };
}

// 2026-02：Instagram 貼文改為由 Site Settings 的 instagramPosts 欄位管理，原本的 instagramPost 文件與此函式已不再使用。
