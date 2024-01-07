import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UIBBX - 预览素材",
  description: "UIBBX - Preview bundle",
};

export default function BundlePreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#f2f7ff]">
      {children}
    </div>
  );
}
