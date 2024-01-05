"use client";

import LikesCarousel from "./LikesCarousel";
import BookmarksCarousel from "./BookmarksCarousel";
import PublishesCarousel from "./PublishesCarousel";
import OrdersCarousel from "./OrdersCarousel";
import RefersTable from "./RefersTable";

import { useAtom } from "jotai";
import { accountTabAtom } from "@/atoms";
import {
  useNumOfBundlesLiked,
  useNumOfBundlesBookmarked,
} from "@/hooks/useBundle";

import Sidebar, { tabs } from "./Sidebar";
import {
  LikeIcon,
  LikeOutlineIcon,
  BookmarkIcon,
  BookmarkOutlineIcon,
  BundleIcon,
  BundleOutlineIcon,
  ShareIcon,
  ShareOutlineIcon,
  OrderIcon,
  OrderOutlineIcon,
} from "@/components/icons";

export default function AccountPage() {
  const [currentTab, setCurrentTab] = useAtom(accountTabAtom);

  const { isPending: isNumOfLikedPending, data: numOfLiked } =
    useNumOfBundlesLiked();
  const { isPending: isNumOfBookmarkedPending, data: numOfBookmarked } =
    useNumOfBundlesBookmarked();

  return (
    <div className="w-full h-full max-w-screen-2xl mx-auto px-8 lg:px-12 xl:px-16">
      <div className="relative flex flex-col justify-start md:flex-row md:justify-between items-start min-h-screen">
        <div className="sticky top-72 h-full hidden md:block md:w-44 lg:w-52">
          <div className="hidden md:block md:w-44 lg:w-52 h-full rounded-b-xl overflow-clip">
            <Sidebar />
          </div>
        </div>

        <div className="w-full sticky top-72 z-10 md:hidden mt-6 flex justify-between items-center bg-[#404040] bg-opacity-80 rounded-xl">
          <div className="flex justify-between 3xs:justify-center w-full xs:justify-start xs:w-fit items-center 3xs:space-x-4 2xs:space-x-6 px-2 3xs:px-5 py-1.5 sm:px-6 sm:py-2 ">
            <span
              className={`w-8 h-8 p-1.5 sm:w-10 sm:h-10 sm:p-2 bg-opacity-50 ${
                currentTab === "likes"
                  ? "outline outline-[#f27979] text-[#f27979] bg-[#f8c5c5]"
                  : "bg-white"
              } rounded-full flex justify-center items-center`}
              onClick={() => setCurrentTab("likes")}
            >
              {currentTab === "likes" ? (
                <LikeIcon className="w-full h-full" />
              ) : (
                <LikeOutlineIcon className="w-full h-full" />
              )}
            </span>
            <span
              className={`w-8 h-8 p-1.5 sm:w-10 sm:h-10 sm:p-2 bg-opacity-50 ${
                currentTab === "bookmarks"
                  ? "outline outline-[#936efe] text-[#936ef3] bg-[#cebef5]"
                  : "bg-white "
              } rounded-full flex justify-center items-center`}
              onClick={() => setCurrentTab("bookmarks")}
            >
              {currentTab === "bookmarks" ? (
                <BookmarkIcon className="w-full h-full" />
              ) : (
                <BookmarkOutlineIcon className="w-full h-full" />
              )}
            </span>
            <span
              className={`w-8 h-8 p-1.5 sm:w-10 sm:h-10 sm:p-2 bg-opacity-50 ${
                currentTab === "publishes"
                  ? "outline outline-emerald-600 text-emerald-600 bg-emerald-200"
                  : "bg-white"
              } rounded-full flex justify-center items-center`}
              onClick={() => setCurrentTab("publishes")}
            >
              {currentTab === "publishes" ? (
                <BundleIcon className="w-full h-full" />
              ) : (
                <BundleOutlineIcon className="w-full h-full" />
              )}
            </span>
            <span
              className={`w-8 h-8 p-1.5 sm:w-10 sm:h-10 sm:p-2 bg-opacity-50 ${
                currentTab === "orders"
                  ? "outline outline-amber-600 text-amber-600 bg-amber-200"
                  : "bg-white"
              } rounded-full flex justify-center items-center`}
              onClick={() => setCurrentTab("orders")}
            >
              {currentTab === "orders" ? (
                <OrderIcon className="w-full h-full" />
              ) : (
                <OrderOutlineIcon className="w-full h-full" />
              )}
            </span>
            <span
              className={`w-8 h-8 p-1.5 sm:w-10 sm:h-10 sm:p-2 bg-opacity-50 ${
                currentTab === "refers"
                  ? "outline outline-indigo-600 text-indigo-600 bg-indigo-200"
                  : "bg-white"
              } rounded-full flex justify-center items-center`}
              onClick={() => setCurrentTab("refers")}
            >
              {currentTab === "refers" ? (
                <ShareIcon className="w-full h-full" />
              ) : (
                <ShareOutlineIcon className="w-full h-full" />
              )}
            </span>
          </div>
          <span className="hidden xs:block bg-gray-200 text-gray-700 text-xs sm:text-sm p-2 mr-2 rounded-xl">
            {`${tabs[currentTab as keyof typeof tabs]}${
              currentTab === "likes" && !isNumOfLikedPending
                ? ` (${numOfLiked})`
                : currentTab === "bookmarks" && !isNumOfBookmarkedPending
                ? ` (${numOfBookmarked})`
                : ""
            }`}
          </span>
        </div>

        <span className="w-full xs:hidden text-center mt-6 text-sm 2xs:text-base underline underline-offset-8">
          {`${tabs[currentTab as keyof typeof tabs]}${
            currentTab === "likes" && !isNumOfLikedPending
              ? ` (${numOfLiked})`
              : currentTab === "bookmarks" && !isNumOfBookmarkedPending
              ? ` (${numOfBookmarked})`
              : ""
          }`}
        </span>

        <div className="w-full md:grow h-full py-6 md:ml-8">
          {currentTab === "likes" ? (
            <LikesCarousel />
          ) : currentTab === "bookmarks" ? (
            <BookmarksCarousel />
          ) : currentTab === "publishes" ? (
            <PublishesCarousel />
          ) : currentTab === "orders" ? (
            <OrdersCarousel />
          ) : currentTab === "refers" ? (
            <RefersTable />
          ) : null}
        </div>
      </div>
    </div>
  );
}
