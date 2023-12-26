import type { Metadata } from "next";
import Subscription from "./Subscription";

export const metadata: Metadata = {
  title: "UIBBX - 升级VIP",
  description: "UIBBX - Subscription page",
};

export default function SubscriptionPage() {
  return (
    <div className="w-full h-full max-w-screen-2xl mx-auto px-4 py-20 min-h-screen">
      <Subscription />
    </div>
  );
}
