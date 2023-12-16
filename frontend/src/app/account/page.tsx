import type { Metadata } from "next";
import Account from "./Account";

export const metadata: Metadata = {
  title: "UIBBX - 账户",
  description: "UIBBX - Account page",
};

export default function Home() {
  return <Account />;
}
