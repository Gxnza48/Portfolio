import type { Metadata } from "next";
import { Space_Grotesk, Manrope, Fira_Code, Jersey_10 } from "next/font/google";
import "./globals.css";
import "devicon/devicon.min.css";
import React from "react";
import { SmoothScroller } from "@/components/SmoothScroller";

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

export const metadata: Metadata = {
  title: "Gonzalo Bonadeo | Creative Builder",
  description: "Frontend Developer / Web Developer focusing on sleek web experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${manrope.variable} ${firaCode.variable} ${jersey10.variable} antialiased`}
    >
      <body suppressHydrationWarning className="min-h-screen bg-brand-bg text-brand-text flex flex-col selection:bg-brand-primary">
        <SmoothScroller />
        {children}
      </body>
    </html>
  );
}
