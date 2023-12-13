import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UIBBX - UI百宝箱",
  description: "UI百宝箱",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
