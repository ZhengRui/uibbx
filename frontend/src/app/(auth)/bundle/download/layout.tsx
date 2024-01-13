import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UIBBX - 下载素材",
  description: "UIBBX - Download bundle",
};

export default function BundleUpdateLayout({
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
