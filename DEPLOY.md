# 部署指南：Eg. Bali Lifestyle → egbalitest.shop

依下列步驟即可將網站發佈到 **https://egbalitest.shop**。

---

## 一、部署到 Vercel

### 方式 A：透過 Vercel 網站（推薦）

1. **登入 Vercel**  
   前往 [vercel.com](https://vercel.com)，用 GitHub / GitLab / Bitbucket 或 Email 登入。

2. **匯入專案**
   - 若程式碼在 **GitHub**：點「Add New」→「Project」，選擇此專案的 repo，匯入。
   - 若**尚未推上 GitHub**：
     - 到 [github.com/new](https://github.com/new) 建立新 repo（例如 `eg-bali-lifestyle`）。
     - 在本機專案目錄執行：
       ```bash
       git remote add origin https://github.com/你的帳號/eg-bali-lifestyle.git
       git push -u origin main
       ```
     - 再到 Vercel 匯入該 repo。

3. **設定環境變數**  
   在 Vercel 專案 **Settings** → **Environment Variables** 新增：
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = `2vllixuw`
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`  
   並勾選 **Production / Preview / Development**。

4. **部署**  
   儲存後 Vercel 會自動建置並部署，完成後會得到一個網址，例如：  
   `https://eg-bali-xxx.vercel.app`。

---

### 方式 B：透過 Vercel CLI

1. **登入**（在終端機執行一次）：
   ```bash
   npx vercel login
   ```
   依提示用 Email 或 GitHub 登入。

2. **部署**：
   ```bash
   npx vercel --prod
   ```
   依提示選擇或建立專案。

3. **設定環境變數**（若尚未在網頁上設定）：
   ```bash
   npx vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID
   # 輸入：2vllixuw，並選 Production
   npx vercel env add NEXT_PUBLIC_SANITY_DATASET
   # 輸入：production，並選 Production
   ```
   再執行一次 `npx vercel --prod` 重新部署。

---

## 二、綁定網域 egbalitest.shop

1. 在 Vercel 專案中點 **Settings** → **Domains**。
2. 在 **Domain** 輸入：`egbalitest.shop`，按 Add。
3. 可再新增 `www.egbalitest.shop`（可設為重新導向到 `egbalitest.shop`）。
4. Vercel 會顯示 **DNS 設定說明**（要你到 GoDaddy 設定的紀錄）。

---

## 三、在 GoDaddy 設定 DNS

1. 登入 [GoDaddy](https://www.godaddy.com) → **我的產品** → 點選網域 **egbalitest.shop** → **DNS 管理**（或 DNS Management）。
2. 新增／修改紀錄，依 Vercel 畫面上的指示設定，通常為：
   - **A 紀錄**  
     - 名稱：`@`（代表根網域 egbalitest.shop）  
     - 指向：`76.76.21.21`（以 Vercel 顯示為準）
   - **CNAME 紀錄**（若要用 www）  
     - 名稱：`www`  
     - 指向：`cname.vercel-dns.com`（以 Vercel 顯示為準）
3. 儲存後等待 **幾分鐘到 48 小時** 傳播，通常 10–30 分鐘內會生效。

---

## 四、Sanity CORS（讓線上站能讀 CMS）

部署完成且網域生效後，要讓 **https://egbalitest.shop** 能呼叫 Sanity API：

1. 登入 [manage.sanity.io](https://manage.sanity.io)，選擇專案 **Eg. Bali Lifestyle**。
2. 進入 **API** → **CORS origins**。
3. 點 **Add CORS origin**，新增：
   - `https://egbalitest.shop`
   - 若有使用 www：`https://www.egbalitest.shop`
4. **Credentials** 可設為 **Allow credentials**（若之後有登入或進階需求）。

儲存後，線上網站即可從 Sanity 載入內容。

---

## 檢查清單

- [ ] 程式碼已推送到 GitHub（若用方式 A）
- [ ] Vercel 專案已建立並完成第一次部署
- [ ] 環境變數 `NEXT_PUBLIC_SANITY_PROJECT_ID`、`NEXT_PUBLIC_SANITY_DATASET` 已設定
- [ ] 在 Vercel 已加入網域 `egbalitest.shop`（及選填的 www）
- [ ] 在 GoDaddy 已依 Vercel 說明設定 A / CNAME
- [ ] 在 Sanity 的 CORS 已加入 `https://egbalitest.shop`（及選填的 www）

完成後，用瀏覽器開啟 **https://egbalitest.shop** 即可看到網站。
