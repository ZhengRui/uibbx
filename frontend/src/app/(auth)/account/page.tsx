import type { Metadata } from "next";
import Account from "./Account";
import Bundle from "./Bundle";

export const metadata: Metadata = {
  title: "UIBBX - 账户",
  description: "UIBBX - Account page",
};

export default function AccountPage() {
  return (
    <div className="w-full h-full max-w-screen-2xl mx-auto px-4 py-20 min-h-screen">
      <div className="h-full flex flex-col justify-between items-center space-y-8 divide-y">
        <div className="w-full max-w-2xl">
          <Account />
        </div>
        <div className="w-full max-w-2xl pt-8">
          <Bundle />
        </div>
      </div>
    </div>
  );
}
