/**
 * Sanity CMS Schema for Eg. Bali Lifestyle
 * 在 Sanity Studio 中可編輯產品、文章、關於我們、網站設定
 */
import { defineType, defineField, defineArrayMember } from "sanity";

/** 產品子分類：在 Studio 可新增/編輯，Shop 頁導覽與篩選依此列表 */
export const productCategory = defineType({
  name: "productCategory",
  title: "Product Category",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "網址用英文代碼，例如 skincare、body-care",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "name", title: "Display Name (e.g. Skincare)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "order", title: "Order (顯示順序，數字愈小愈前)", type: "number" }),
  ],
});

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", title: "產品名稱（中文）", type: "string", validation: (r) => r.required() }),
    defineField({ name: "nameEn", title: "Product Name (English)", type: "string" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "nameEn" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "productCategory" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "price", title: "Price (NT$)", type: "number", validation: (r) => r.required() }),
    defineField({ name: "originalPrice", title: "Original Price (NT$) - 原價", type: "number" }),
    defineField({ name: "description", title: "Description", type: "text", validation: (r) => r.required() }),
    defineField({ name: "descriptionShort", title: "Short Description", type: "string" }),
    defineField({ name: "ingredients", title: "Ingredients 成分", type: "string" }),
    defineField({
      name: "sizes",
      title: "Sizes 尺寸",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "image", title: "Main Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "images",
      title: "Additional Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "buyUrl", title: "Buy URL (外部電商連結)", type: "url" }),
    defineField({ name: "order", title: "Order", type: "number" }),
    defineField({
      name: "featured",
      title: "首頁精選 (Selected Products)",
      type: "boolean",
      description: "勾選後會出現在首頁「Selected Products」區塊",
      initialValue: false,
    }),
    defineField({
      name: "homepageOrder",
      title: "首頁精選排序",
      type: "number",
      description: "數字愈小愈前面顯示，可留空",
    }),
    defineField({
      name: "stockStatus",
      title: "庫存狀態",
      type: "string",
      options: {
        list: [
          { title: "有庫存", value: "in_stock" },
          { title: "暫無庫存", value: "out_of_stock" },
          { title: "可預訂", value: "preorder" },
        ],
      },
    }),
  ],
});

/** 文章內文：可選文字/圖片並加超連結 */
const articleContentBlock = defineArrayMember({
  type: "block",
  marks: {
    annotations: [
      {
        name: "link",
        type: "object",
        title: "超連結",
        fields: [{ name: "href", type: "url", title: "URL" }],
      },
    ],
  },
});

const articleImageBlock = defineArrayMember({
  type: "image",
  options: { hotspot: true },
  fields: [
    { name: "link", type: "url", title: "圖片連結（點擊後開啟）" },
    { name: "alt", type: "string", title: "Alt 文字" },
  ],
});

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", validation: (r) => r.required() }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [articleContentBlock, articleImageBlock],
      validation: (r) => r.required(),
    }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "publishedAt", title: "Published At", type: "date", validation: (r) => r.required() }),
    defineField({ name: "order", title: "Order", type: "number" }),
    defineField({
      name: "featured",
      title: "首頁精選 (From the Journal)",
      type: "boolean",
      description: "勾選後會出現在首頁「From the Journal」區塊",
      initialValue: false,
    }),
    defineField({
      name: "homepageOrder",
      title: "首頁精選排序",
      type: "number",
      description: "數字愈小愈前面顯示",
    }),
    defineField({
      name: "relatedProducts",
      title: "相關產品（文章底部展示）",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
  ],
});

export const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    defineField({ name: "storyTitle", title: "Story Title", type: "string" }),
    defineField({
      name: "storyContent",
      title: "Story Content",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "values",
      title: "Values",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "description", type: "text", title: "Description" },
          ],
        },
      ],
    }),
    defineField({ name: "founderTitle", title: "Founder Title", type: "string" }),
    defineField({ name: "founderName", title: "Founder Name", type: "string" }),
    defineField({ name: "founderImage", title: "Founder Image", type: "image" }),
    defineField({ name: "founderBio", title: "Founder Bio", type: "text" }),
  ],
});

const bannerImageMember = defineArrayMember({
  type: "object",
  name: "bannerImage",
  fields: [
    { name: "image", type: "image", title: "圖片", options: { hotspot: true }, validation: (r) => r.required() },
    { name: "link", type: "url", title: "點擊連結（選填）" },
    { name: "alt", type: "string", title: "Alt 文字" },
    { name: "order", type: "number", title: "順序（數字愈小愈前）" },
  ],
  preview: { select: { alt: "alt" }, prepare: ({ alt }) => ({ title: alt || "Banner 圖片" }) },
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "bannerImages",
      title: "首頁橫幅 Banner",
      type: "array",
      description: "最多 3 張圖片，會輪播顯示",
      validation: (r) => r.max(3),
      of: [bannerImageMember],
    }),
    defineField({ name: "siteName", title: "Site Name", type: "string" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "taglineLong", title: "Tagline Long", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "instagramHandle", title: "Instagram Handle", type: "string" }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url" }),
    defineField({ name: "copyright", title: "Copyright", type: "string" }),
  ],
});

/** 全站文字分類與字體/大小設定 */
const TYPOGRAPHY_KEYS = [
  { value: "heroTitle", title: "首頁主標（Hero 標語）" },
  { value: "sectionTitle", title: "區塊標題（Section Title）" },
  { value: "sectionLink", title: "區塊連結（View All 等）" },
  { value: "body", title: "內文（Body）" },
  { value: "bodySmall", title: "小內文（Body Small）" },
  { value: "caption", title: "說明文字（Caption）" },
  { value: "nav", title: "導覽列（Navigation）" },
  { value: "button", title: "按鈕（Button）" },
  { value: "price", title: "價格（Price）" },
  { value: "cardTitle", title: "卡片標題（產品/文章名）" },
  { value: "cardMeta", title: "卡片副資訊（日期、分類等）" },
] as const;

export const typographySettings = defineType({
  name: "typographySettings",
  title: "Typography 字體設定",
  type: "document",
  fields: [
    defineField({
      name: "styles",
      title: "文字分類與樣式",
      type: "array",
      of: [
        {
          type: "object",
          name: "typographyStyle",
          fields: [
            { name: "key", type: "string", title: "分類", options: { list: TYPOGRAPHY_KEYS }, validation: (r) => r.required() },
            { name: "name", type: "string", title: "顯示名稱（方便辨識）" },
            { name: "fontFamily", type: "string", title: "字體（font-family）", description: "例如：Georgia, serif 或 var(--font-serif)" },
            { name: "fontSize", type: "string", title: "字級（font-size）", description: "例如：1rem、18px、clamp(1rem, 2vw, 1.5rem)" },
          ],
          preview: { select: { key: "key", name: "name" }, prepare: ({ key, name }) => ({ title: name || key || "樣式" }) },
        },
      ],
    }),
  ],
});

export const instagramPost = defineType({
  name: "instagramPost",
  title: "Instagram Post",
  type: "document",
  fields: [
    defineField({ name: "imageUrl", title: "Image URL", type: "url" }),
    defineField({ name: "link", title: "Link", type: "url" }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
});
