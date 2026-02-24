import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypographyInjector from "@/components/TypographyInjector";
import AdsTracking from "@/components/AdsTracking";
import { getSiteSettings } from "@/lib/cms";

/** 讓 Site Settings、導覽、Footer 等從 Sanity 定期更新，發布後約 1 分鐘內會反映 */
export const revalidate = 60;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <div className="min-h-screen flex flex-col">
      <TypographyInjector />
      <AdsTracking settings={settings} />
      <Header settings={settings} />
      <main className="flex-1 pt-[60px]">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
