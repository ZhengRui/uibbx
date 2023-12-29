import type { Metadata } from "next";
import AccountEdit from "./AccountEdit";

export const metadata: Metadata = {
  title: "UIBBX - 编辑账户",
  description: "UIBBX - Account edit page",
};

export default function AccountEditPage() {
  return (
    <div className="w-full h-full max-w-screen-2xl mx-auto px-8 lg:px-12 xl:px-16 min-h-screen py-16">
      <AccountEdit />
    </div>
  );
}
