import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { assetPath } from "@/lib/assetPath";

const bestTen = localFont({
  src: "../../public/fonts/BestTen-DOT.otf",
  variable: "--font-best",
  display: "swap"
});

export const metadata: Metadata = {
  title: "sorano portfolio",
  description: "A game-like portfolio by sorano.",
  icons: {
    icon: assetPath("/character/1.png"),
    shortcut: assetPath("/character/1.png"),
    apple: assetPath("/character/1.png")
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={bestTen.variable}>{children}</body>
    </html>
  );
}
