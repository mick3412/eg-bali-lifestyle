// 網站內容型別定義（供 CMS 與前端共用）

/** 產品分類 slug（固定列舉僅用於本地 fallback；Sanity 可動態管理） */
export type ProductCategory = "skincare" | "body-care" | "fragrance" | "home" | "all";

/** 單一分類項目（來自 CMS 或本地列表） */
export interface ProductCategoryItem {
  id: string;
  slug: string;
  name: string;
  order?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  /** 分類 slug，與 ProductCategoryItem.slug 對應 */
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  descriptionShort?: string;
  ingredients?: string;
  sizes?: string[];
  image: string;
  images?: string[];
  buyUrl?: string;
  order?: number;
  /** 是否在首頁 Selected Products 區塊顯示 */
  featured?: boolean;
  /** 首頁精選區的排序（數字愈小愈前面） */
  homepageOrder?: number;
  /** 庫存狀態：有庫存、暫無庫存、可預訂 */
  stockStatus?: "in_stock" | "out_of_stock" | "preorder";
}

/** 文章內文：純文字（本地）或 Portable Text 區塊（Sanity） */
export type ArticleContent = string | PortableTextBlock[];

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: ArticleContent;
  image: string;
  publishedAt: string;
  order?: number;
  /** 是否在首頁 From the Journal 區塊顯示 */
  featured?: boolean;
  /** 首頁精選排序（數字愈小愈前） */
  homepageOrder?: number;
  /** 文章底部展示的相關產品（CMS 挑選） */
  relatedProducts?: Product[];
}

/** Portable Text 區塊（簡化型，供 Sanity block content 使用） */
export interface PortableTextBlock {
  _type: string;
  _key?: string;
  children?: { _type: string; _key?: string; text?: string; marks?: string[] }[];
  markDefs?: { _type: string; _key: string; href?: string }[];
  asset?: { _ref?: string };
  link?: string;
}

export interface AboutContent {
  storyTitle: string;
  storyContent: string[];
  values?: { title: string; description: string }[];
  founderTitle?: string;
  founderName?: string;
  founderImage?: string;
  founderBio?: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  taglineLong?: string;
  email: string;
  instagramHandle: string;
  instagramUrl: string;
  copyright: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  link: string;
  order?: number;
}
