"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  useNumOfBundlesLiked,
  useNumOfBundlesBookmarked,
} from "@/hooks/useBundle";

import { useAtom } from "jotai";
import { accountTabAtom } from "@/atoms";

const tabs = {
  likes: "我的喜欢",
  bookmarks: "我的收藏",
  publishes: "我的发布",
  refers: "我的推广",
  orders: "交易记录",
};

const Sidebar = () => {
  const [currentTab, setCurrentTab] = useAtom(accountTabAtom);

  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem("token");

    queryClient.invalidateQueries({
      queryKey: ["whoami"],
    });
  };

  const { isPending: isNumOfLikedPending, data: numOfLiked } =
    useNumOfBundlesLiked();
  const { isPending: isNumOfBookmarkedPending, data: numOfBookmarked } =
    useNumOfBundlesBookmarked();

  if (isNumOfBookmarkedPending || isNumOfLikedPending) return null;

  return (
    <div className="bg-white h-full flex flex-col justify-start items-center py-6 space-y-6 text-sm">
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

      <div className="pt-64">
        <button
          className="border border-[#f27979] text-[#f27979] rounded-full py-2 px-6 h-10"
          onClick={logout}
        >
          退出登录
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
