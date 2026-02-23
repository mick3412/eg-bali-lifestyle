// 網站內容型別定義（供 CMS 與前端共用）

export type ProductCategory = "skincare" | "body-care" | "fragrance" | "home" | "all";

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  category: ProductCategory;
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
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  publishedAt: string;
  order?: number;
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
