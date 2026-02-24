/**
 * 內容讀取層：依環境變數選擇從 Sanity 或本地 JSON 讀取
 */
import type { Product, Article, AboutContent, SiteSettings, InstagramPost, ProductCategoryItem } from "@/types";
import { isSanityConfigured } from "./sanity";
import {
  getSiteSettingsFromSanity,
  getCategoriesFromSanity,
  getProductsFromSanity,
  getProductBySlugFromSanity,
  getFeaturedProductsFromSanity,
  getFeaturedArticlesFromSanity,
  getArticlesFromSanity,
  getArticleBySlugFromSanity,
  getAboutFromSanity,
  getInstagramPostsFromSanity,
} from "./cms-sanity";

import settingsData from "@/content/settings.json";
import productsData from "@/content/products.json";
import articlesData from "@/content/articles.json";
import aboutData from "@/content/about.json";
import categoriesData from "@/content/categories.json";

const localSettings = settingsData as SiteSettings;
const localProducts = productsData as Product[];
const localArticles = articlesData as Article[];
const localAbout = aboutData as AboutContent;
const localCategories = categoriesData as ProductCategoryItem[];

export async function getSiteSettings(): Promise<SiteSettings> {
  if (isSanityConfigured()) {
    const fromSanity = await getSiteSettingsFromSanity();
    if (fromSanity) return fromSanity;
  }
  return localSettings;
}

/** 取得產品分類列表（Shop 子分類導覽與篩選用；Sanity 可新增/編輯） */
export async function getCategories(): Promise<ProductCategoryItem[]> {
  if (isSanityConfigured()) {
    const list = await getCategoriesFromSanity();
    if (list.length > 0) return list;
  }
  return [...localCategories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** 依 slug 取得分類顯示名稱 */
export async function getCategoryName(slug: string): Promise<string> {
  const categories = await getCategories();
  const found = categories.find((c) => c.slug === slug);
  return found?.name ?? slug;
}

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  if (isSanityConfigured()) {
    const list = await getProductsFromSanity(categorySlug);
    if (list.length > 0) return list;
  }
  const products = [...localProducts].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  if (!categorySlug || categorySlug === "all") return products;
  return products.filter((p) => p.category === categorySlug);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (isSanityConfigured()) {
    const p = await getProductBySlugFromSanity(slug);
    if (p) return p;
  }
  return localProducts.find((p) => p.slug === slug);
}

/** 首頁 Selected Products：回傳有勾選「首頁精選」的產品；若無則 fallback 前 4 筆 */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  if (isSanityConfigured()) {
    const list = await getFeaturedProductsFromSanity(limit);
    if (list.length > 0) return list;
  }
  const featured = localProducts
    .filter((p) => p.featured === true)
    .sort((a, b) => (a.homepageOrder ?? 999) - (b.homepageOrder ?? 999))
    .slice(0, limit);
  if (featured.length > 0) return featured;
  return [...localProducts].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, 4);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  return all
    .filter((p) => p.id !== product.id && (p.category === product.category || Math.random() > 0.5))
    .slice(0, limit);
}

/** 首頁 From the Journal：回傳有勾選精選的文章；若無則 fallback 前 3 篇 */
export async function getFeaturedArticles(limit = 6): Promise<Article[]> {
  if (isSanityConfigured()) {
    const list = await getFeaturedArticlesFromSanity(limit);
    if (list.length > 0) return list;
  }
  const featured = localArticles
    .filter((a) => a.featured === true)
    .sort((a, b) => (a.homepageOrder ?? 999) - (b.homepageOrder ?? 999))
    .slice(0, limit);
  if (featured.length > 0) return featured;
  return [...localArticles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);
}

export async function getArticles(limit?: number): Promise<Article[]> {
  if (isSanityConfigured()) {
    const list = await getArticlesFromSanity(limit);
    if (list.length > 0) return list;
  }
  const sorted = [...localArticles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  if (isSanityConfigured()) {
    const a = await getArticleBySlugFromSanity(slug);
    if (a) return a;
  }
  return localArticles.find((a) => a.slug === slug);
}

export async function getArticlePrevNext(
  slug: string
): Promise<{ prev: Article | null; next: Article | null }> {
  const sorted = await getArticles();
  const index = sorted.findIndex((a) => a.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? sorted[index - 1]! : null,
    next: index < sorted.length - 1 && index >= 0 ? sorted[index + 1]! : null,
  };
}

export async function getAboutContent(): Promise<AboutContent> {
  if (isSanityConfigured()) {
    const fromSanity = await getAboutFromSanity();
    if (fromSanity) return fromSanity;
  }
  return localAbout;
}

export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  if (isSanityConfigured()) {
    const list = await getInstagramPostsFromSanity(limit);
    if (list.length > 0) return list;
  }
  return [];
}
