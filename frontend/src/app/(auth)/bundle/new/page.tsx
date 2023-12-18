import type { Metadata } from "next";
import { NewBundleForm } from "../BundleForm";

export const metadata: Metadata = {
  title: "UIBBX - 发布素材",
  description: "UIBBX - Publish bundle",
};

export default function BundlePublishPage() {
  return (
    <div className="w-full h-full max-w-screen-2xl mx-auto px-4 py-20 flex justify-center min-h-screen">
      <div className="w-full max-w-2xl">
        <NewBundleForm />
      </div>
    </div>
  );
}
