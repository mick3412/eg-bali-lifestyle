import { getTypography } from "@/lib/cms";

const DEFAULT_STYLES: Record<string, { fontFamily: string; fontSize: string }> = {
  heroTitle: { fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(1.5rem, 4vw, 2.25rem)" },
  sectionTitle: { fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(1.25rem, 2.5vw, 1.875rem)" },
  sectionLink: { fontFamily: "inherit", fontSize: "0.875rem" },
  body: { fontFamily: "inherit", fontSize: "1rem" },
  bodySmall: { fontFamily: "inherit", fontSize: "0.875rem" },
  caption: { fontFamily: "inherit", fontSize: "0.75rem" },
  nav: { fontFamily: "inherit", fontSize: "0.75rem" },
  button: { fontFamily: "inherit", fontSize: "0.875rem" },
  price: { fontFamily: "inherit", fontSize: "1.125rem" },
  cardTitle: { fontFamily: "var(--font-serif), Georgia, serif", fontSize: "1rem" },
  cardMeta: { fontFamily: "inherit", fontSize: "0.75rem" },
};

export default async function TypographyInjector() {
  const { styles } = await getTypography();
  const merged = new Map<string, { fontFamily: string; fontSize: string }>();
  Object.entries(DEFAULT_STYLES).forEach(([k, v]) => merged.set(k, { ...v }));
  styles.forEach((s) => {
    if (!s.key) return;
    const cur = merged.get(s.key) ?? { fontFamily: "inherit", fontSize: "1rem" };
    if (s.fontFamily) cur.fontFamily = s.fontFamily;
    if (s.fontSize) cur.fontSize = s.fontSize;
    merged.set(s.key, cur);
  });

  const vars = Array.from(merged.entries())
    .map(([key, v]) => `  --typo-${key}-font: ${v.fontFamily};\n  --typo-${key}-size: ${v.fontSize};`)
    .join("\n");
  const classes = Array.from(merged.entries())
    .map(([key]) => `.typo-${key}{font-family:var(--typo-${key}-font);font-size:var(--typo-${key}-size);}`)
    .join("\n");

  const html = `:root{\n${vars}\n}\n${classes}`;
  return <style dangerouslySetInnerHTML={{ __html: html }} />;
}
