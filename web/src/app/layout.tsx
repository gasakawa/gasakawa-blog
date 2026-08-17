import type { Metadata } from "next";
import { Space_Grotesk, Inter, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // No `template` here: [lang]/layout.tsx defines the real title template
  // for every actual page, and Next.js chains templates through every
  // ancestor layout — a template here would double-wrap it.
  title: "Programming and Design | Gabriel Asakawa",
  description:
    "Personal blog by Gabriel Asakawa on software architecture, developer tools, and AI — with occasional detours into design and basketball.",
};

const NO_FOUC_SCRIPT = `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="no-fouc-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: NO_FOUC_SCRIPT }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
      <GoogleTagManager gtmId="GTM-MNXHCPX" />
    </html>
  );
}
