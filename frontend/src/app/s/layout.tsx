import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UIBBX - 推广",
  description: "UIBBX - Refer page",
};

export default function ReferPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#f2f7ff]">
      <div className="w-full h-full max-w-screen-2xl mx-auto px-4 py-20 flex justify-center">
        {children}
      </div>
    </div>
  );
}
