"use client";

import {
  LinkIcon,
  CoinIcon,
  UserCircleIcon,
  CopyOutlineIcon,
} from "@/components/icons";
import { useQueryClient } from "@tanstack/react-query";
import { UserIF } from "@/interfaces";
import { useRefersRewarded } from "@/hooks/useRefer";
import Image from "next/image";

export const convertDateString = (dateString: string) => {
  // Parse the string into a Date object
  const date = new Date(dateString);

  // Extract the components
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Format the new date string
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

const subscriptions = {
  month: "个人计划",
  quarter: "专业计划",
  ultra: "精英计划",
};

const Table = () => {
  const queryClient = useQueryClient();

  const user = queryClient.getQueryData<UserIF>(["whoami"]);
  const referURL = `https://uibbx.com/s/${user?.uid}`;

  const { isPending, isFetching, data: refers } = useRefersRewarded(0, 20);

  if (isPending || isFetching) return null;

  return (
    <div className="w-full flex flex-col justify-start items-center @container">
      <div className="w-full flex flex-col @[540px]:flex-row justify-between items-center text-sm space-y-3 @[540px]:space-y-0">
        <div className="flex justify-start items-center">
          <span className="text-xs 2xs:text-sm text-gray-700">
            我的下载分:{" "}
          </span>
          <CoinIcon className="ml-4 w-5 h-5" />
          <span className="ml-2 tracking-widest text-amber-500">{`${user?.coins}分`}</span>
        </div>
        <div className="flex @[540px]:justify-end items-center px-4 bg-white rounded-lg py-2 text-xs 2xs:text-sm">
          <span className="text-gray-400">{referURL}</span>
          <button
            className="hidden @[360px]:flex justify-end items-center ml-4 space-x-1"
            onClick={() => navigator.clipboard.writeText(referURL)}
          >
            <LinkIcon className="w-3 h-3" />
            <span>复制链接</span>
          </button>

          <button
            className="flex @[360px]:hidden justify-end items-center ml-2 2xs:ml-4"
            onClick={() => navigator.clipboard.writeText(referURL)}
          >
            <CopyOutlineIcon className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
      {refers && refers.length > 0 ? (
        <div className="w-full mt-6 space-y-8 min-h-[640px]">
          {refers.map((refer, i) => (
            <div
              key={i}
              className="text-sm w-full px-2 py-2 @[256px]:px-4 @sm:px-6 @[256px]:py-4 flex justify-between items-center border border-gray-300 rounded-lg"
            >
              <div className="flex justify-start items-center space-x-1.5 @[260px]:space-x-3">
                <div className="relative w-12 h-12 rounded-full overflow-clip flex justify-center items-center bg-[#404040]">
                  {refer.referent_avatar ? (
                    <Image
                      src={refer.referent_avatar as string}
                      alt="avatar"
                      fill={true}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : refer.referent_nickname ? (
                    <span className="text-gray-300 text-base">
                      {refer.referent_nickname[0]}
                    </span>
                  ) : (
                    <UserCircleIcon className="w-full h-full" />
                  )}
                </div>
                <div className="flex flex-col justify-center items-start @[260px]:space-y-1">
                  <span className="text-gray-700 text-xs @[260px]:text-sm">
                    {refer.referent_nickname}
                  </span>
                  <span className="text-gray-700 text-[10px] @[260px]:text-xs @[540px]:hidden">
                    {refer.refer_type}
                  </span>
                  <div className="flex justify-start items-center @[360px]:hidden">
                    <CoinIcon className="w-4 h-4" />
                    <span className="ml-1 text-[10px] @[260px]:text-xs tracking-wide text-amber-500">{`+${refer.coins_gained}分`}</span>
                  </div>
                  <span className="text-gray-400 text-[10px] @[260px]:text-xs font-mono">
                    {convertDateString(refer.referred_at)}
                  </span>
                </div>
              </div>
              <div className="hidden @[540px]:block">{refer.refer_type}</div>
              <div className="hidden @[360px]:flex justify-start items-center w-20">
                <CoinIcon className="w-5 h-5" />
                <span className="ml-2 tracking-widest text-amber-500">{`+${refer.coins_gained}分`}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-full min-h-[640px]">
          <span className="text-2xl text-gray-400">暂无记录</span>
        </div>
      )}
    </div>
  );
};

export default Table;
