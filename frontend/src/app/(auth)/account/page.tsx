import type { Metadata } from "next";
import Sidebar from "./Sidebar";

export const metadata: Metadata = {
  title: "UIBBX - 账户",
  description: "UIBBX - Account page",
};

export default function AccountPage() {
  return (
    <div className="relative w-full h-full max-w-screen-2xl mx-auto  px-8 lg:px-12 xl:px-16 min-h-screen py-20 ">
      <div className="absolute -top-48 ">
        <Sidebar />
      </div>
    </div>
  );
}
