/**
 * Sanity 客戶端設定
 * 設定環境變數 NEXT_PUBLIC_SANITY_PROJECT_ID、NEXT_PUBLIC_SANITY_DATASET 後即可從 Sanity 讀取內容
 */
import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const client =
  projectId && dataset
    ? createClient({
        projectId,
        dataset,
        apiVersion: "2024-01-01",
        useCdn: true,
      })
    : null;

export function isSanityConfigured(): boolean {
  return Boolean(client);
}
