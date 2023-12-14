import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "./QueryProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthPanel from "@/components/AuthPanel";
import { Toaster } from "react-hot-toast";

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
      <body>
        <QueryProvider>
          <main>
            <Header />
            <AuthPanel />
            {children}
            <Footer />
            <Toaster />
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
