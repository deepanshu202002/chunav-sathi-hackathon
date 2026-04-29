import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chunav Saathi | Indian Election Guide",
  description: "Your expert guide to understanding the Indian election process.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${outfit.variable} dark antialiased`}>
      <head>
        <meta name="description" content="Chunav Saathi - Your guide to understanding Indian elections, voting process, and electoral system" />
        <meta name="theme-color" content="#FF9933" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="http://localhost:8000" />
      </head>
      <body className="font-sans antialiased">
        <a href="#main-chat" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
