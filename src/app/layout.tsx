import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "sorano portfolio",
  description: "A game-like portfolio by sorano.",
  icons: {
    icon: "/character/1.png",
    shortcut: "/character/1.png",
    apple: "/character/1.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
