import Link from "next/link";
import type { SiteSettings } from "@/types";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
];

export default function Footer({ settings }: { settings: SiteSettings }) {

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-5 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <p className="typo-sectionTitle font-semibold text-foreground mb-2">{settings.siteName}</p>
            <p className="typo-bodySmall text-[var(--muted)] max-w-sm">
              {settings.tagline}. {settings.taglineLong}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
            <div>
              <p className="typo-caption tracking-widest uppercase text-[var(--muted)] mb-3">Navigate</p>
              <ul className="space-y-2">
                {NAV.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="typo-bodySmall text-foreground hover:text-[var(--accent)] transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="typo-caption tracking-widest uppercase text-[var(--muted)] mb-3">Connect</p>
              <ul className="space-y-2">
                <li>
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="typo-bodySmall text-foreground hover:text-[var(--accent)] transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="typo-bodySmall text-foreground hover:text-[var(--accent)] transition-colors"
                  >
                    {settings.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="typo-caption mt-10 pt-6 border-t border-[var(--border)] text-center text-[var(--muted)]">
          {settings.copyright}
        </p>
      </div>
    </footer>
  );
}
