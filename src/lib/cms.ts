/**
 * 內容讀取層：依環境變數選擇從 Sanity 或本地 JSON 讀取
 */
import type { Product, Article, AboutContent, SiteSettings, InstagramPost, ProductCategory } from "@/types";
import { isSanityConfigured } from "./sanity";
import {
  getSiteSettingsFromSanity,
  getProductsFromSanity,
  getProductBySlugFromSanity,
  getArticlesFromSanity,
  getArticleBySlugFromSanity,
  getAboutFromSanity,
  getInstagramPostsFromSanity,
} from "./cms-sanity";

import settingsData from "@/content/settings.json";
import productsData from "@/content/products.json";
import articlesData from "@/content/articles.json";
import aboutData from "@/content/about.json";

const localSettings = settingsData as SiteSettings;
const localProducts = productsData as Product[];
const localArticles = articlesData as Article[];
const localAbout = aboutData as AboutContent;

export const CATEGORY_LABELS: Record<ProductCategory | "all", string> = {
  all: "All Products",
  skincare: "Skincare",
  "body-care": "Body Care",
  fragrance: "Fragrance",
  home: "Home",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  if (isSanityConfigured()) {
    const fromSanity = await getSiteSettingsFromSanity();
    if (fromSanity) return fromSanity;
  }
  return localSettings;
}

export async function getProducts(category?: ProductCategory): Promise<Product[]> {
  if (isSanityConfigured()) {
    const list = await getProductsFromSanity(category);
    if (list.length > 0) return list;
  }
  const products = [...localProducts].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  if (!category || category === "all") return products;
  return products.filter((p) => p.category === category);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (isSanityConfigured()) {
    const p = await getProductBySlugFromSanity(slug);
    if (p) return p;
  }
  return localProducts.find((p) => p.slug === slug);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  return all
    .filter((p) => p.id !== product.id && (p.category === product.category || Math.random() > 0.5))
    .slice(0, limit);
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
