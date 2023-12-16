import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "./QueryProvider";
import Header from "@/app/Header";
import Footer from "@/app/Footer";
import AuthPanel from "@/app/AuthPanel";
import { Toaster } from "react-hot-toast";
import { Provider } from "jotai";

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
          <Provider>
            <main>
              <Header />
              <AuthPanel />
              {children}
              <Footer />
              <Toaster />
            </main>
          </Provider>
        </QueryProvider>
      </body>
    </html>
  );
}
