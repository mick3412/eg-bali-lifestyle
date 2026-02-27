// 網站內容型別定義（供 CMS 與前端共用）

/** 產品分類 slug（固定列舉僅用於本地 fallback；Sanity 可動態管理） */
export type ProductCategory = "skincare" | "body-care" | "fragrance" | "home" | "all";

/** 單一分類項目（來自 CMS 或本地列表） */
export interface ProductCategoryItem {
  id: string;
  slug: string;
  name: string;
  order?: number;
  subcategories?: { id: string; slug: string; name: string }[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  /** 主分類（可複選） */
  category: string[];
  /** 子分類（可複選，依主分類決定可選項） */
  subcategory?: string[];
  price: number;
  originalPrice?: number;
  description: string;
  descriptionShort?: string;
  ingredients?: string;
  sizes?: string[];
  image: string;
  /** 產品頁輪播：圖片與影片依 CMS 排列順序，可為空（則僅顯示主圖） */
  gallery?: { type: "image" | "video"; url: string }[];
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
  category: string[];
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
  /** 純文字（舊資料）或 Portable Text 區塊（富文本：字型、超連結、圖片） */
  storyContent: ArticleContent;
  values?: { title: string; description: string }[];
  founderTitle?: string;
  founderName?: string;
  founderImage?: string;
  founderBio?: string;
}

/** 首頁橫幅單張 */
export interface BannerImage {
  url: string;
  link?: string;
  alt?: string;
  order?: number;
}

/** 單一文字分類樣式（CMS 可調字體、字級） */
export interface TypographyStyle {
  key: string;
  name?: string;
  fontFamily?: string;
  fontSize?: string;
}

export interface InstagramPostSlot {
  imageUrl: string;
  link: string;
}

export interface SiteSettings {
  bannerImages?: BannerImage[];
  siteName: string;
  tagline: string;
  taglineLong?: string;
  /** 首頁「精選產品」區塊標題，留空則用預設 "Selected Products" */
  selectedProductsTitle?: string;
  /** 首頁「精選文章」區塊標題，留空則用預設 "Selected Journal" */
  selectedJournalTitle?: string;
  /** 首頁 Instagram 區塊標題，留空則用預設 "Follow for More" */
  followForMoreTitle?: string;
  email: string;
  instagramHandle: string;
  instagramUrl: string;
  /** 首頁 Instagram 區塊使用的貼文（最多 4 則，含縮圖與連結） */
  instagramPosts?: InstagramPostSlot[];
  copyright: string;
  /** Google Tag (GA4 / Google Ads) ID，例如 G-XXXXXXXXXX 或 AW-XXXXXXXXXX */
  googleTagId?: string;
  /** Meta (Facebook) 像素 ID */
  metaPixelId?: string;
}

/** 全站字體設定（Typography 文件） */
export interface TypographySettings {
  styles: TypographyStyle[];
}
