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
      <div className="w-full h-full max-w-screen-2xl mx-auto px-4 py-20 flex justify-center relative">
        {children}
      </div>
    </div>
  );
}
