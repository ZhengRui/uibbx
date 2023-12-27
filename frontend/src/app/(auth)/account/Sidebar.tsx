"use client";

import { useQueryClient } from "@tanstack/react-query";
import { UserIF } from "@/interfaces";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { UibbxIcon, PenLineIcon } from "@/components/icons";
import { use, useState } from "react";
import Link from "next/link";
import {
  useNumOfBundlesPublished,
  useNumOfBundlesLiked,
  useNumOfBundlesBookmarked,
} from "@/hooks/useBundle";

const tabs = {
  likes: "我的喜欢",
  bookmarks: "我的收藏",
  publishes: "我的发布",
  promotions: "我的推广",
  orders: "交易记录",
};

const Sidebar = () => {
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem("token");

    queryClient.invalidateQueries({
      queryKey: ["whoami"],
    });
  };

  const user = queryClient.getQueryData<UserIF>(["whoami"])!;

  const [currentTab, setCurrentTab] = useState("likes");

  const { isPending: isNumOfLikedPending, data: numOfLiked } =
    useNumOfBundlesLiked();
  const { isPending: isNumOfBookmarkedPending, data: numOfBookmarked } =
    useNumOfBundlesBookmarked();

  if (isNumOfBookmarkedPending || isNumOfLikedPending) return null;

  return (
    <div className="w-64 h-full">
      <div className="bg-[#404040] h-48 bg-opacity-50 text-white flex flex-col justify-center items-start px-20 relative">
        <UserCircleIcon className="w-24 h-24" />
        <span className="mt-3 text-xs">{user?.username}</span>
        <div className="mt-1 flex justify-between items-center space-x-1">
          <UibbxIcon className="w-3 h-3" />
          <span className="text-xs">{user.cellnum || user.email}</span>
        </div>
        <Link
          href="/account/edit"
          className="absolute top-2 right-2 flex justify-start items-center space-x-2 text-gray-400 hover:text-gray-100 cursor-pointer"
        >
          <span className="text-[10px]">编辑个人资料</span>
          <PenLineIcon className="w-2 h-2" />
        </Link>
      </div>
      <div className="bg-white flex flex-col justify-between items-center py-6 space-y-6 text-sm">
        {Object.entries(tabs).map(([tab, tabText], i) => (
          <span
            key={i}
            className={`${
              currentTab === tab ? "text-violet-600 text-xl" : ""
            } h-8 cursor-pointer select-none`}
            onClick={() => setCurrentTab(tab)}
          >
            {tabText}
            {tab === "likes"
              ? ` (${numOfLiked})`
              : tab === "bookmarks"
              ? ` (${numOfBookmarked})`
              : ""}
          </span>
        ))}

        <div className="pt-8">
          <button
            className="border border-[#f27979] text-[#f27979] rounded-full py-2 px-6"
            onClick={logout}
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
