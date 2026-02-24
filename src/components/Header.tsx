"use client";

import Link from "next/link";
import { useState } from "react";
import type { SiteSettings } from "@/types";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
];

export default function Header({ settings }: { settings: SiteSettings }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/95 backdrop-blur border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="typo-sectionTitle font-semibold text-foreground tracking-tight hover:opacity-80 transition-opacity"
        >
          {settings.siteName}
        </Link>

        {/* 漢堡選單按鈕 */}
        <button
          type="button"
          aria-label={menuOpen ? "關閉選單" : "開啟選單"}
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-foreground"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? (
            <span className="text-2xl leading-none" aria-hidden>×</span>
          ) : (
            <>
              <span className="w-5 h-px bg-current" />
              <span className="w-5 h-px bg-current" />
              <span className="w-5 h-px bg-current" />
            </>
          )}
        </button>

        {/* 桌面導航 */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="typo-nav tracking-widest uppercase text-foreground/90 hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* 行動裝置展開選單 */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--background)]">
          <nav className="max-w-6xl mx-auto px-5 py-6 flex flex-col gap-1">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="typo-nav py-3 tracking-widest uppercase text-foreground border-b border-[var(--border)] last:border-0"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
