/**
 * 內容讀取層：依環境變數選擇從 Sanity 或本地 JSON 讀取
 * 使用 React cache() 在同一 request 內去重，避免 layout 與 page 重複請求
 */
import { cache } from "react";
import type { Product, Article, AboutContent, SiteSettings, ProductCategoryItem, TypographySettings } from "@/types";
import { isSanityConfigured } from "./sanity";
import {
  getSiteSettingsFromSanity,
  getTypographyFromSanity,
  getArticleCategoriesFromSanity,
  getCategoriesFromSanity,
  getProductsFromSanity,
  getProductBySlugFromSanity,
  getFeaturedProductsFromSanity,
  getFeaturedArticlesFromSanity,
  getArticlesFromSanity,
  getArticleBySlugFromSanity,
  getAboutFromSanity,
  getRelatedProductsFromSanity,
} from "./cms-sanity";

import settingsData from "@/content/settings.json";
import productsData from "@/content/products.json";
import articlesData from "@/content/articles.json";
import aboutData from "@/content/about.json";
import categoriesData from "@/content/categories.json";

const localSettings = settingsData as SiteSettings;
const localProducts = productsData as Product[];
const localArticles = articlesData as Article[];
const localAbout = aboutData as unknown as AboutContent;
const localCategories = categoriesData as ProductCategoryItem[];

async function getSiteSettingsUncached(): Promise<SiteSettings> {
  if (isSanityConfigured()) {
    try {
      const fromSanity = await getSiteSettingsFromSanity();
      if (fromSanity) return fromSanity;
    } catch {
      // Sanity 連線錯誤時改用本地設定，避免整站崩潰
    }
  }
  return localSettings;
}

export const getSiteSettings = cache(getSiteSettingsUncached);

/** 取得全站字體設定（Typography 分類與字體/字級） */
async function getTypographyUncached(): Promise<TypographySettings> {
  if (isSanityConfigured()) {
    const fromSanity = await getTypographyFromSanity();
    if (fromSanity?.styles?.length) return fromSanity;
  }
  return { styles: [] };
}

export const getTypography = cache(getTypographyUncached);

/** 取得產品分類列表（Shop 子分類導覽與篩選用；Sanity 可新增/編輯） */
async function getCategoriesUncached(): Promise<ProductCategoryItem[]> {
  if (isSanityConfigured()) {
    try {
      const list = await getCategoriesFromSanity();
      if (list.length > 0) return list;
    } catch {
      // Sanity 錯誤時改用本地分類，避免整頁崩潰
    }
  }
  return [...localCategories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export const getCategories = cache(getCategoriesUncached);

/**
 * 取得 Journal 文章分類列表（已依 order 排序）
 * - 優先使用 Sanity `articleCategory` 文件（在 Studio「文章分類」中管理）
 * - 若尚未建立任何分類文件，則 fallback：從文章推導 + journalCategoryOrder 排序
 */
async function getArticleCategoriesUncached(): Promise<string[]> {
  if (isSanityConfigured()) {
    try {
      const list = await getArticleCategoriesFromSanity();
      if (list.length > 0) return list.map((c) => c.name);
    } catch {
      // Sanity 連線失敗時 fallback
    }
  }
  // Fallback：從現有文章推導分類 + journalCategoryOrder 排序
  const [articles, settings] = await Promise.all([getArticles(), getSiteSettings()]);
  const set = new Set<string>();
  for (const a of articles) {
    const c = (a.category ?? "").trim();
    if (c) set.add(c);
  }
  const unique = Array.from(set);
  const order = settings.journalCategoryOrder;
  if (!order || order.length === 0) return unique.sort((a, b) => a.localeCompare(b));
  const normalized = order.map((o) => o.trim().toLowerCase());
  return unique.sort((a, b) => {
    const ia = normalized.findIndex((o) => o === a.trim().toLowerCase());
    const ib = normalized.findIndex((o) => o === b.trim().toLowerCase());
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

export const getArticleCategories = cache(getArticleCategoriesUncached);

/** 依 slug 取得分類顯示名稱 */
export async function getCategoryName(slug: string): Promise<string> {
  const categories = await getCategories();
  const found = categories.find((c) => c.slug === slug);
  return found?.name ?? slug;
}

async function getProductsUncached(categorySlug?: string): Promise<Product[]> {
  if (isSanityConfigured()) {
    try {
      return await getProductsFromSanity(categorySlug);
    } catch {
      // Sanity 錯誤時改回傳本地產品或空陣列，避免整頁崩潰
    }
  }
  const products = [...localProducts].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  if (!categorySlug || categorySlug === "all") return products;
  return products.filter((p) => p.category === categorySlug);
}

export const getProducts = cache(getProductsUncached);

async function getProductBySlugUncached(slug: string): Promise<Product | undefined> {
  if (isSanityConfigured()) {
    const p = await getProductBySlugFromSanity(slug);
    if (p) return p;
  }
  return localProducts.find((p) => p.slug === slug);
}

export const getProductBySlug = cache(getProductBySlugUncached);

/** 首頁 Selected Products：只回傳 CMS 中勾選「首頁精選」的產品，不再使用本地預設 */
async function getFeaturedProductsUncached(limit = 8): Promise<Product[]> {
  if (isSanityConfigured()) return getFeaturedProductsFromSanity(limit);
  return [];
}

export const getFeaturedProducts = cache(getFeaturedProductsUncached);

/** 相關產品：Sanity 時用專用查詢只取同分類數筆，避免拉全量產品 */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (isSanityConfigured()) {
    try {
      const list = await getRelatedProductsFromSanity(product.id, product.category, limit);
      if (list.length > 0) return list;
    } catch {
      // fallback 下用全量篩選
    }
  }
  const all = await getProducts();
  return all
    .filter((p) => p.id !== product.id && (p.category === product.category || Math.random() > 0.5))
    .slice(0, limit);
}

/** 首頁 From the Journal：只回傳 CMS 中勾選精選的文章，不再使用本地預設 */
async function getFeaturedArticlesUncached(limit = 6): Promise<Article[]> {
  if (isSanityConfigured()) return getFeaturedArticlesFromSanity(limit);
  return [];
}

export const getFeaturedArticles = cache(getFeaturedArticlesUncached);

async function getArticlesUncached(limit?: number): Promise<Article[]> {
  if (isSanityConfigured()) {
    const list = await getArticlesFromSanity(limit);
    if (list.length > 0) return list;
  }
  const sorted = [...localArticles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export const getArticles = cache(getArticlesUncached);

async function getArticleBySlugUncached(slug: string): Promise<Article | undefined> {
  if (isSanityConfigured()) {
    const a = await getArticleBySlugFromSanity(slug);
    if (a) return a;
  }
  return localArticles.find((a) => a.slug === slug);
}

export const getArticleBySlug = cache(getArticleBySlugUncached);

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

async function getAboutContentUncached(): Promise<AboutContent> {
  if (isSanityConfigured()) {
    const fromSanity = await getAboutFromSanity();
    if (fromSanity) return fromSanity;
  }
  const about = localAbout as AboutContent & { storyContent?: string[] | AboutContent["storyContent"] };
  const raw = about.storyContent;
  const storyContent: AboutContent["storyContent"] =
    Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "string"
      ? (raw as string[]).join("\n\n")
      : (raw ?? "");
  return { ...about, storyContent };
}

export const getAboutContent = cache(getAboutContentUncached);

// Instagram 貼文改由 Site Settings 的 instagramPosts 管理，故不再提供獨立列表 API。
