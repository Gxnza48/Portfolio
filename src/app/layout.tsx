import type { Metadata } from "next";
import {
  Space_Grotesk,
  Manrope,
  Fira_Code,
  Jersey_10,
  News_Cycle,
} from "next/font/google";
import "./globals.css";
import "devicon/devicon.min.css";
import React from "react";
import { SmoothScroller } from "@/components/SmoothScroller";
import { ThemeProvider } from "@/lib/theme";
import { SITE } from "@/data/content";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
});

const jersey10 = Jersey_10({
  weight: "400",
  variable: "--font-jersey",
  subsets: ["latin"],
});

// News Gothic-style face for the authentic opening crawl.
const newsCycle = News_Cycle({
  weight: ["400", "700"],
  variable: "--font-crawl",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SITE.metaTitle,
  description: SITE.metaDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${manrope.variable} ${firaCode.variable} ${jersey10.variable} ${newsCycle.variable} antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-brand-bg text-brand-text flex flex-col"
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider>
          <SmoothScroller />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
