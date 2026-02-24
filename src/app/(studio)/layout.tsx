/**
 * Studio 專用 layout：不包網站 Header/Footer，不套用網站樣式
 * 讓 Sanity Studio 獨占整頁，避免版面與發布按鈕被干擾
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
