/**
 * Sanity CMS Schema for Eg. Bali Lifestyle
 * 在 Sanity Studio 中可編輯產品、文章、關於我們、網站設定
 */
import { defineType, defineField, defineArrayMember } from "sanity";

const productCategory = defineType({
  name: "productCategory",
  title: "Product Category",
  type: "string",
  options: {
    list: [
      { title: "All", value: "all" },
      { title: "Skincare", value: "skincare" },
      { title: "Body Care", value: "body-care" },
      { title: "Fragrance", value: "fragrance" },
      { title: "Home", value: "home" },
    ],
  },
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
      type: "string",
      options: { list: ["skincare", "body-care", "fragrance", "home"] },
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
    defineField({ name: "content", title: "Content", type: "text", validation: (r) => r.required() }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "publishedAt", title: "Published At", type: "date", validation: (r) => r.required() }),
    defineField({ name: "order", title: "Order", type: "number" }),
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

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "siteName", title: "Site Name", type: "string" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "taglineLong", title: "Tagline Long", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "instagramHandle", title: "Instagram Handle", type: "string" }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url" }),
    defineField({ name: "copyright", title: "Copyright", type: "string" }),
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
