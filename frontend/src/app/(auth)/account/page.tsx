"use client";

import LikesCarousel from "./LikesCarousel";
import BookmarksCarousel from "./BookmarksCarousel";
import PublishesCarousel from "./PublishesCarousel";
import OrdersCarousel from "./OrdersCarousel";
import RefersTable from "./RefersTable";

import { useQueryClient } from "@tanstack/react-query";
import { UserIF } from "@/interfaces";
import { useAtom } from "jotai";
import { accountTabAtom } from "@/atoms";
import {
  useNumOfBundlesLiked,
  useNumOfBundlesBookmarked,
} from "@/hooks/useBundle";

import Sidebar from "./Sidebar";
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
import { useEffect, useState } from "react";

const tabs = {
  likes: {
    name: "我的喜欢",
    Icon: LikeIcon,
    OutlineIcon: LikeOutlineIcon,
    hlStyle: {
      text: "text-[#f27979] bg-[#f8c5c5] bg-opacity-20",
      ring: "ring-[#f27979]",
    },
  },
  bookmarks: {
    name: "我的收藏",
    Icon: BookmarkIcon,
    OutlineIcon: BookmarkOutlineIcon,
    hlStyle: {
      text: "text-[#936efe] bg-[#cebef5] bg-opacity-20",
      ring: "ring-[#936efe]",
    },
  },
  publishes: {
    name: "我的发布",
    Icon: BundleIcon,
    OutlineIcon: BundleOutlineIcon,
    hlStyle: {
      text: "text-emerald-600 bg-emerald-200 bg-opacity-20",
      ring: "ring-emerald-600",
    },
  },
  refers: {
    name: "我的推广",
    Icon: ShareIcon,
    OutlineIcon: ShareOutlineIcon,
    hlStyle: {
      text: "text-amber-600 bg-amber-200 bg-opacity-20",
      ring: "ring-amber-600",
    },
  },
  orders: {
    name: "交易记录",
    Icon: OrderIcon,
    OutlineIcon: OrderOutlineIcon,
    hlStyle: {
      text: "text-indigo-600 bg-indigo-200 bg-opacity-20",
      ring: "ring-indigo-600",
    },
  },
};

const adminSwitchedOn = process.env.NEXT_PUBLIC_ADMIN_SWITCH === "on";
const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID;
const { publishes, ...tabsNonAdmin } = tabs;

export default function AccountPage() {
  const [currentTab, setCurrentTab] = useAtom(accountTabAtom);

  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<UserIF>(["whoami"]);

  const { isPending: isNumOfLikedPending, data: numOfLiked } =
    useNumOfBundlesLiked();
  const { isPending: isNumOfBookmarkedPending, data: numOfBookmarked } =
    useNumOfBundlesBookmarked();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const scrollHandler = () => {
      window.scrollY > 10 ? setScrolled(true) : setScrolled(false);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [scrolled]);

  return (
    <div className="w-full h-full max-w-screen-2xl mx-auto px-8 lg:px-12 xl:px-16">
      <div className="relative flex flex-col justify-start md:flex-row md:justify-between items-start min-h-screen">
        <div className="sticky top-72 h-full hidden md:block md:w-44 lg:w-52">
          <div className="hidden md:block md:w-44 lg:w-52 h-full rounded-b-xl overflow-clip">
            <Sidebar />
          </div>
        </div>

        <div
          className={`sticky top-72 z-10 h-20 w-screen -translate-x-8 md:hidden bg-[#f2f7ff] px-8 transition duration-1000 ${
            scrolled ? "shadow-lg" : ""
          }`}
        >
          {!isNumOfBookmarkedPending && !isNumOfLikedPending && (
            <div className="w-full overflow-x-auto py-6">
              <div className="flex justify-start items-center space-x-3">
                {Object.entries(
                  adminSwitchedOn && adminUid !== user?.uid
                    ? tabsNonAdmin
                    : tabs
                ).map(([tab, { name, Icon, OutlineIcon, hlStyle }], i) => (
                  <button
                    key={i}
                    type="button"
                    className={`isolate inline-flex shadow-sm rounded-full ${
                      currentTab === tab
                        ? hlStyle.text
                        : "bg-white text-gray-500"
                    }`}
                    onClick={() => setCurrentTab(tab)}
                  >
                    <span
                      className={`relative inline-flex items-center gap-x-1.5 ${
                        i < 2 ? "rounded-l-full pr-2" : "rounded-full pr-4"
                      } pl-4 py-2 text-xs ring-1 ring-inset ${
                        currentTab === tab ? hlStyle.ring : "ring-gray-300"
                      }`}
                    >
                      {currentTab === tab ? (
                        <Icon className="-ml-0.5 h-4 w-4 " aria-hidden="true" />
                      ) : (
                        <OutlineIcon
                          className="-ml-0.5 h-4 w-4 "
                          aria-hidden="true"
                        />
                      )}
                      <span className="w-12">{name}</span>
                    </span>
                    {i < 2 && (
                      <span
                        className={`relative -ml-px inline-flex items-center rounded-r-full pl-2 pr-4 py-2 text-xs ring-1 ring-inset ${
                          currentTab === tab ? hlStyle.ring : "ring-gray-300"
                        }`}
                      >
                        {tab === "likes"
                          ? numOfLiked
                          : tab === "bookmarks"
                          ? numOfBookmarked
                          : " "}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

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
