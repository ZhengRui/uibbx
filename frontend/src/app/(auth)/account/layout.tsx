import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UIBBX - 账户",
  description: "UIBBX - Account page",
};

export default function AccountPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
