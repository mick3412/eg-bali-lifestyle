# Eg. Bali Lifestyle

簡約生活風格網站，含 **Shop**、**Journal**、**About** 三大板塊，主頁呈現精選產品、文章與 Instagram 區塊。

## 功能

- **首頁**：Hero、精選產品、From the Journal、Follow Along (Instagram)
- **Shop**：產品子分類選單、產品列表、個別產品頁（圖文、價格、尺寸、成分、前往購買外連）、相關產品
- **Journal**：文章列表、個別文章頁（圖文、上一篇/下一篇）
- **About**：品牌故事與理念
- **內容來源**：預設從 `src/content/*.json` 讀取；設定 **Sanity** 後改由 Sanity CMS 提供內容。

## 開發

```bash
npm install
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)。

**發佈到 egbalitest.shop**：請依 [DEPLOY.md](./DEPLOY.md) 部署到 Vercel、設定 GoDaddy DNS 與 Sanity CORS。

## 內容管理（CMS）

### 使用 Sanity

專案已內建 Sanity Studio 與 schema，設定後即可用 Sanity 管理所有圖文。

1. **建立 Sanity 專案**  
   至 [sanity.io](https://sanity.io) 登入／註冊，在 [manage.sanity.io](https://manage.sanity.io) 建立新專案，取得 **Project ID**。

2. **設定環境變數**  
   在專案根目錄建立 `.env.local`：
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=你的專案ID
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

3. **設定 CORS**  
   在 Sanity 後台 **API** → **CORS origins** 新增：
   - `http://localhost:3000`  
   若部署到其他網域，也請一併加入該網域。

4. **開啟 Studio**  
   執行 `npm run dev` 後，開啟 [http://localhost:3000/studio](http://localhost:3000/studio) 即可編輯：
   - **Product**：產品（名稱、分類、價格、圖片、購買連結等）
   - **Article**：文章（標題、摘要、內文、圖片、日期）
   - **About**：關於我們（品牌故事、理念）
   - **Site Settings**：網站設定（站名、標語、Email、Instagram、版權）
   - **Instagram Post**：首頁 Instagram 區塊貼文

設定好環境變數並有 CORS 後，網站會自動從 Sanity 讀取內容；若 Sanity 尚無資料，會暫時沿用 `src/content/*.json` 的內容。

### 僅用本地 JSON（不接 Sanity）

不設定 `NEXT_PUBLIC_SANITY_PROJECT_ID` 時，內容來自：

- 產品：`src/content/products.json`
- 文章：`src/content/articles.json`
- 關於我們：`src/content/about.json`
- 網站設定：`src/content/settings.json`

## 圖片

目前產品與文章圖片使用 `public/images/placeholder.svg`。請將實際圖片放入 `public/images/`（例如 `public/images/products/`、`public/images/journal/`、`public/images/hero.jpg`），並在內容 JSON 或 Sanity 中更新對應路徑。

## 技術

- Next.js 16 (App Router)
- Tailwind CSS 4
- TypeScript
