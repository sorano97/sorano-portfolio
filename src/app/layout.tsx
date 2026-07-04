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
    <html suppressHydrationWarning lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                try {
                  const storedTheme = localStorage.getItem("theme");
                  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  const theme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : prefersDark ? "dark" : "light";
                  document.documentElement.dataset.theme = theme;
                  document.documentElement.style.colorScheme = theme;
                } catch {
                  document.documentElement.dataset.theme = "light";
                  document.documentElement.style.colorScheme = "light";
                }
              })();
            `
          }}
        />
      </head>
      <body className={bestTen.variable}>{children}</body>
    </html>
  );
}
