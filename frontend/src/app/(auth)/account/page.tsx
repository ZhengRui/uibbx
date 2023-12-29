"use client";

import LikesCarousel from "./LikesCarousel";
import BookmarksCarousel from "./BookmarksCarousel";
import PublishesCarousel from "./PublishesCarousel";

import { useAtomValue } from "jotai";
import { accountTabAtom } from "@/atoms";

import Sidebar from "./Sidebar";

export default function AccountPage() {
  const currentTab = useAtomValue(accountTabAtom);

  return (
    <div className="w-full h-full max-w-screen-2xl mx-auto px-8 lg:px-12 xl:px-16">
      <div className="relative flex justify-between items-start space-x-8 min-h-screen">
        <div className="sticky top-72 h-full w-52">
          <div className="w-52 h-full rounded-b-xl overflow-clip">
            <Sidebar />
          </div>
        </div>

        <div className="grow h-full py-6">
          {currentTab === "likes" ? (
            <LikesCarousel />
          ) : currentTab === "bookmarks" ? (
            <BookmarksCarousel />
          ) : currentTab === "publishes" ? (
            <PublishesCarousel />
          ) : null}
        </div>
      </div>
    </div>
  );
}
