/**
 * Sanity CMS Schema for Eg. Bali Lifestyle
 * 在 Sanity Studio 中可編輯產品、文章、關於我們、網站設定
 */
import { defineType, defineField, defineArrayMember } from "sanity";

export const product = defineType({
  name: "product",
  title: "產品",
  type: "document",
  fields: [
    defineField({ name: "name", title: "產品名稱（中文）", type: "string", validation: (r) => r.required() }),
    defineField({ name: "nameEn", title: "產品名稱（英文）", type: "string" }),
    defineField({
      name: "slug",
      title: "網址代碼（Slug）",
      type: "slug",
      description: "產品網址用英文字母，通常由英文名稱自動產生，可手動調整（需保持唯一）",
      options: { source: "nameEn" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "產品分類（Slug）",
      type: "string",
      description: "填入分類代碼（需與網站設定 → 產品分類中的 Slug 一致，例如 skincare）",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "price",
      title: "售價（NT$）",
      type: "number",
      description: "產品實際售價，會顯示在產品卡片與產品頁",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "originalPrice",
      title: "原價（NT$，可選）",
      type: "number",
      description: "如需顯示折扣，原價會以刪除線顯示在售價旁邊",
    }),
    defineField({
      name: "description",
      title: "產品說明（內文）",
      type: "text",
      description: "產品詳細描述，顯示在產品頁主內文位置",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "descriptionShort",
      title: "簡短說明（列表使用，可選）",
      type: "string",
      description: "可填一小段摘要，未來可用於列表或精選區塊顯示",
    }),
    defineField({
      name: "ingredients",
      title: "成分（Ingredients）",
      type: "string",
      description: "產品主要成分，會顯示在產品頁「成分」區塊",
    }),
    defineField({
      name: "sizes",
      title: "容量／尺寸列表",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "image",
      title: "主圖（列表與預設輪播）",
      type: "image",
      description: "產品主視覺圖片，會用於列表卡片與輪播預設顯示",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "產品圖/影片輪播",
      type: "array",
      description: "可上傳多張圖片或影片，拖曳項目可調整顯示順序；若為空則使用上方主圖。",
      of: [
        defineArrayMember({ type: "image", options: { hotspot: true } }),
        defineArrayMember({ type: "file", options: { accept: "video/*" } }),
      ],
    }),
    defineField({
      name: "buyUrl",
      title: "購買連結（外部電商）",
      type: "url",
      description: "導向外部電商或購物車的 URL，產品頁「前往購買」按鈕會連到此處",
    }),
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
        fields: [{ name: "href", type: "url", title: "網址" }],
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
  title: "文章",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "標題",
      type: "string",
      description: "文章主標題，會顯示在列表與文章頁上方",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "網址代碼（Slug）",
      type: "slug",
      description: "文章網址用英文字母，通常由標題自動產生，可手動調整（需保持唯一）",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "分類（文字）",
      type: "string",
      description: "文章分類名稱，會顯示在卡片與文章頁上方，可自由輸入文字",
    }),
    defineField({
      name: "excerpt",
      title: "摘要（列表顯示）",
      type: "text",
      description: "會顯示在首頁與 Journal 列表的文章卡片上，建議 1–3 行",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "content",
      title: "內文區塊",
      type: "array",
      of: [articleContentBlock, articleImageBlock],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "首圖",
      type: "image",
      description: "會顯示在文章上方與列表縮圖位置",
      options: { hotspot: true },
    }),
    defineField({
      name: "publishedAt",
      title: "發佈日期",
      type: "date",
      description: "用於排序與顯示日期，建議填寫實際上線時間",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "排序（選填）",
      type: "number",
      description: "同一天有多篇文章時，可用此欄位微調排序，數字愈小愈前面",
    }),
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

/** About Our Story 內文：可設定字型、超連結、插入圖片 */
const aboutStoryBlock = defineArrayMember({
  type: "block",
  marks: {
    annotations: [
      {
        name: "link",
        type: "object",
        title: "超連結",
        fields: [{ name: "href", type: "url", title: "網址" }],
      },
    ],
  },
  styles: [
    { title: "內文", value: "normal" },
    { title: "標題 H2", value: "h2" },
    { title: "標題 H3", value: "h3" },
  ],
});

const aboutStoryImageBlock = defineArrayMember({
  type: "image",
  options: { hotspot: true },
  fields: [
    { name: "alt", type: "string", title: "Alt 文字" },
    { name: "link", type: "url", title: "圖片連結（點擊後開啟，選填）" },
  ],
});

export const about = defineType({
  name: "about",
  title: "關於我們",
  type: "document",
  fields: [
    defineField({ name: "storyTitle", title: "故事段落標題", type: "string", description: "例如：Our Story" }),
    defineField({
      name: "storyContent",
      title: "故事內容（Our Story）",
      type: "array",
      description: "可編輯內文、設定字型（標題/內文）、超連結與插入圖片",
      of: [aboutStoryBlock, aboutStoryImageBlock],
    }),
    defineField({
      name: "values",
      title: "品牌價值列表（前台已隱藏，僅保留於 CMS）",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "標題" },
            { name: "description", type: "text", title: "說明" },
          ],
        },
      ],
    }),
    defineField({ name: "founderTitle", title: "創辦人區塊標題（前台已隱藏）", type: "string" }),
    defineField({ name: "founderName", title: "創辦人姓名", type: "string" }),
    defineField({ name: "founderImage", title: "創辦人照片", type: "image" }),
    defineField({ name: "founderBio", title: "創辦人介紹", type: "text" }),
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
  title: "網站設定",
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
    defineField({ name: "siteName", title: "網站名稱", type: "string" }),
    defineField({
      name: "tagline",
      title: "首頁標語（短）",
      type: "string",
      description: "顯示在首頁 Hero 區塊的大標語，可用一句話描述品牌",
    }),
    defineField({
      name: "taglineLong",
      title: "首頁標語（長，可選）",
      type: "string",
      description: "較長版本的品牌敘述，視設計需要顯示",
    }),
    defineField({
      name: "selectedProductsTitle",
      title: "首頁區塊標題：Selected Products",
      type: "string",
      description: "首頁「精選產品」區塊的標題，留空則顯示「Selected Products」",
    }),
    defineField({
      name: "selectedJournalTitle",
      title: "首頁區塊標題：Selected Journal",
      type: "string",
      description: "首頁「精選文章」區塊的標題，留空則顯示「Selected Journal」",
    }),
    defineField({
      name: "followForMoreTitle",
      title: "首頁區塊標題：Follow for More",
      type: "string",
      description: "首頁 Instagram 區塊的標題，留空則顯示「Follow for More」",
    }),
    defineField({
      name: "productCategories",
      title: "產品分類",
      type: "array",
      description: "Shop 頁面的分類導覽列表。可新增、刪除、拖曳調整顯示順序。Slug 為網址用英文代碼，需與產品的分類欄位一致。",
      of: [
        defineArrayMember({
          type: "object",
          name: "productCategoryItem",
          fields: [
            {
              name: "slug",
              title: "Slug（網址代碼）",
              type: "string",
              description: "英文小寫，例如 skincare、body-care",
              validation: (r) => r.required(),
            },
            {
              name: "name",
              title: "顯示名稱",
              type: "string",
              description: "前台顯示文字，例如 Skincare",
              validation: (r) => r.required(),
            },
          ],
          preview: {
            select: { name: "name", slug: "slug" },
            prepare: ({ name, slug }) => ({ title: name || "（未命名）", subtitle: slug }),
          },
        }),
      ],
    }),
    defineField({
      name: "articleCategories",
      title: "文章分類",
      type: "array",
      description: "Journal 頁面的分類導覽列表。可新增、刪除、拖曳調整顯示順序。名稱需與文章的分類欄位完全一致（大小寫須相符）。",
      of: [
        defineArrayMember({
          type: "object",
          name: "articleCategoryItem",
          fields: [
            {
              name: "name",
              title: "分類名稱",
              type: "string",
              description: "例如：FOOD、旅遊（須與文章的分類欄位完全一致）",
              validation: (r) => r.required(),
            },
          ],
          preview: {
            select: { name: "name" },
            prepare: ({ name }) => ({ title: name || "（未命名）" }),
          },
        }),
      ],
    }),
    defineField({ name: "email", title: "聯絡 Email", type: "string" }),
    defineField({
      name: "instagramHandle",
      title: "Instagram 帳號（@）",
      type: "string",
      description: "例如：@eg.bali，會顯示在首頁 Follow Along 區塊",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram 網址",
      type: "url",
      description: "點擊帳號文字時導向的官方 IG 連結",
    }),
    defineField({
      name: "instagramPosts",
      title: "Instagram 貼文（最多 4 則）",
      type: "array",
      description: "首頁 Follow Along 區塊使用。每一則包含縮圖與貼文連結，最多 4 則，拖曳可調整顯示順序。",
      validation: (r) => r.max(4),
      of: [
        defineArrayMember({
          type: "object",
          name: "instagramPost",
          fields: [
            {
              name: "image",
              title: "縮圖",
              type: "image",
              description: "建議使用 1:1 方形圖片，會顯示在首頁 Instagram 區塊。",
              options: { hotspot: true },
              validation: (r) => r.required(),
            },
            {
              name: "url",
              title: "貼文連結",
              type: "url",
              description: "Instagram 貼文或短片網址，例如：https://www.instagram.com/p/xxxxxx/ 或 /reel/xxxxxx/",
              validation: (r) => r.required(),
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "copyright",
      title: "版權文字",
      type: "string",
      description: "顯示在頁面最下方，例如：© 2026 Eg. Bali Lifestyle",
    }),
    defineField({
      name: "googleTagId",
      title: "Google 廣告追蹤 (Tag ID)",
      type: "string",
      description: "Google Analytics 4 或 Google Ads 的衡量/轉換 ID，例如 G-XXXXXXXXXX 或 AW-XXXXXXXXXX。留空則不載入。",
    }),
    defineField({
      name: "metaPixelId",
      title: "Meta (Facebook) 像素 ID",
      type: "string",
      description: "Meta 廣告管理員中的像素 ID（數字）。留空則不載入。",
    }),
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
  title: "文字樣式設定（Typography）",
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

// 2026-02：原本獨立的 instagramPost 文件類型已改為在 Site Settings 中維護貼文清單，故不再需要額外文件。
