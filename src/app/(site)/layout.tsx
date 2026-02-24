import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/cms";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />
      <main className="flex-1 pt-[60px]">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
