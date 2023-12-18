import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UIBBX - 更新素材",
  description: "UIBBX - Update bundle",
};

export default function BundleUpdateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full max-w-screen-2xl mx-auto px-4 py-20 flex justify-center min-h-screen">
      {children}
    </div>
  );
}
