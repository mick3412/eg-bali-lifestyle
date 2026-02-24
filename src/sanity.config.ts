"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { product, article, about, siteSettings, instagramPost } from "../sanity/schema";
import { PublishButton } from "./studio/actions/PublishButton";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: {
    types: [product, article, about, siteSettings, instagramPost],
  },
  document: {
    // 在預設操作前加入自訂「發布」按鈕，確保在文件編輯器底部顯示
    actions: (prev) => [PublishButton, ...prev],
  },
});
