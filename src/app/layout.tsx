import type { Metadata } from "next";
import { Space_Grotesk, Manrope, Fira_Code, Jersey_10 } from "next/font/google";
import "./globals.css";
import React from "react";

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
  title: "Gonzalo Bonadeo — Desarrollador digital",
  description: "Productos digitales, sistemas e interfaces con movimiento, creados por Gonzalo Bonadeo desde Rosario, Argentina.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${spaceGrotesk.variable} ${manrope.variable} ${firaCode.variable} ${jersey10.variable} antialiased`}
    >
      <body suppressHydrationWarning className="min-h-screen bg-brand-bg text-brand-text flex flex-col selection:bg-brand-primary">
        {children}
      </body>
    </html>
  );
}
