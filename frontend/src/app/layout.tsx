import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "Brandwise | AI Search Analytics for Marketing Teams",
  description:
    "Track, analyze, and improve your brand performance on AI search platforms through key metrics like Visibility, Position, and Sentiment.",
  keywords: [
    "AI",
    "LLM",
    "Brand Visibility",
    "Analytics",
    "SEO",
    "AI Optimization",
    "Brand Intelligence",
    "ChatGPT",
    "Perplexity",
    "Marketing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${syne.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
