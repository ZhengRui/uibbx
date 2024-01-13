"use client";

import { useBundlePublic } from "@/hooks/useBundle";
import { useAuth } from "@/hooks/useAuth";
import {
  useNumOfLikes,
  useLikedByMe,
  useLike,
  useUnlike,
} from "@/hooks/useLike";
import {
  useBookmark,
  useUnbookmark,
  useBookmarkedByMe,
} from "@/hooks/useBookmark";
import Image from "next/image";
import {
  FigmaIcon,
  SketchIcon,
  PhotoShopIcon,
  LikeIcon,
  BookmarkIcon,
  ShareIcon,
  QQIcon,
} from "@/components/icons";
import { authPanelOpenAtom, downloadPanelOpenAtom } from "@/atoms";
import { useSetAtom } from "jotai";
import DownloadPanel from "./DownloadPanel";
import { UserCircleIcon } from "@/components/icons";
import { useState, useEffect } from "react";
import { useDownloadableByMe } from "@/hooks/useDownload";
import Link from "next/link";

const formatIcons = {
  figma: FigmaIcon,
  sketch: SketchIcon,
  photoshop: PhotoShopIcon,
};

export default function BundlePreviewPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  const { isPending: isPendingAuth, data: user } = useAuth();
  const { isPending: isPendingBundle, data: bundle } = useBundlePublic(id);
  const { isPending: isPendingNumOfLikes, data: numOfLikes } =
    useNumOfLikes(id);
  const { isPending: isPendingLikedByMe, data: likedByMe } = useLikedByMe(id);
  const { isPending: isPendingBookmarkedByMe, data: bookmarkedByMe } =
    useBookmarkedByMe(id);
  const { isPending: isPendingDownloadableByMe, data: downloadableByMe } =
    useDownloadableByMe(id);

  const like = useLike();
  const unlike = useUnlike();
  const bookmark = useBookmark();
  const unbookmark = useUnbookmark();

  const setAuthPanelOpen = useSetAtom(authPanelOpenAtom);
  const setDownloadPanelOpen = useSetAtom(downloadPanelOpenAtom);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const scrollHandler = () => {
      window.scrollY > 10 ? setScrolled(true) : setScrolled(false);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [scrolled]);

  if (
    isPendingAuth ||
    isPendingBundle ||
    isPendingNumOfLikes ||
    isPendingLikedByMe ||
    isPendingBookmarkedByMe ||
    isPendingDownloadableByMe ||
    !bundle
  )
    return null;

  return (
    <div className="w-full h-full max-w-screen-2xl mx-auto px-4 md:pt-20 pb-20 flex justify-center relative">
      <div className="w-full flex flex-col items-center max-w-7xl">
        <div
          className={`sticky z-20 md:hidden top-[92px] w-screen bg-[#f2f7ff] px-4 2xs:px-8 sm:px-10 flex justify-center items-center transition duration-1000 ${
            scrolled ? "shadow-lg" : "border-b"
          }`}
        >
          <div className="w-full overflow-x-auto py-3">
            <div className="flex justify-between items-start">
              <div className="flex flex-col justify-center items-start space-y-2 w-24">
                <span className="relative w-8 h-8 xs:w-10 xs:h-10 rounded-full overflow-clip flex justify-start items-center bg-[#404040]">
                  {bundle.creator_avatar ? (
                    <Image
                      src={bundle.creator_avatar as string}
                      alt="avatar"
                      fill={true}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : bundle.creator_nickname ? (
                    <span className="text-gray-300 text-base">
                      {bundle.creator_nickname[0]}
                    </span>
                  ) : (
                    <UserCircleIcon className="w-full h-full" />
                  )}
                </span>
                <span className="text-[10px] xs:text-xs text-gray-400">
                  {bundle.creator_nickname}
                </span>
              </div>

              <div className="grow flex justify-end items-center space-x-3 2xs:space-x-6 xs:space-x-10">
                <div className="flex flex-col justify-start items-center space-y-2">
                  <span
                    className={`w-8 h-8 xs:w-10 xs:h-10 rounded-full ${
                      likedByMe ? "bg-[#f27979]" : "bg-[#e3eeff]"
                    } flex flex-col justify-center items-center cursor-pointer`}
                    onClick={() =>
                      !user
                        ? setAuthPanelOpen(true)
                        : likedByMe
                        ? unlike(id)
                        : like(id)
                    }
                  >
                    <LikeIcon
                      className={`mt-0.5 w-4 h-4 xs:w-5 xs:h-5 ${
                        likedByMe ? "text-white" : "text-[#25314C]"
                      }`}
                    />
                    <span
                      className={`${
                        likedByMe ? "text-white" : "text-[#25314c]"
                      } text-[6px] xs:text-[8px] font-semibold`}
                    >
                      {numOfLikes || 0}
                    </span>
                  </span>
                  <span className="text-[10px] xs:text-xs text-gray-400">
                    喜欢
                  </span>
                </div>

                <div className="flex flex-col justify-start items-center space-y-2">
                  <span
                    className={`w-8 h-8 xs:w-10 xs:h-10 rounded-full ${
                      bookmarkedByMe ? "bg-[#936efe]" : "bg-[#e3eeff]"
                    } flex justify-center items-center cursor-pointer`}
                    onClick={() =>
                      !user
                        ? setAuthPanelOpen(true)
                        : bookmarkedByMe
                        ? unbookmark(id)
                        : bookmark(id)
                    }
                  >
                    <BookmarkIcon
                      className={`w-4 h-4 xs:w-5 xs:h-5 ${
                        bookmarkedByMe ? "text-white" : "text-[#25314C]"
                      }`}
                    />
                  </span>
                  <span className="text-[10px] xs:text-xs text-gray-400">
                    收藏
                  </span>
                </div>
                <div className="flex flex-col justify-start items-center space-y-2">
                  <span className="w-8 h-8 xs:w-10 xs:h-10 rounded-full bg-[#e3eeff] flex justify-center items-center">
                    <ShareIcon className="w-4 h-4 xs:w-5 xs:h-5 text-[#25314C]" />
                  </span>
                  <span className="text-[10px] xs:text-xs text-gray-400">
                    分享
                  </span>
                </div>
                <div className="flex flex-col justify-start items-center space-y-2">
                  <span className="w-8 h-8 xs:w-10 xs:h-10 rounded-full bg-[#e3eeff] flex justify-center items-center">
                    <QQIcon className="w-4 h-4 xs:w-5 xs:h-5 text-[#25314C]" />
                  </span>
                  <span className="text-[10px] xs:text-xs text-gray-400">
                    客服
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute left-0 -bottom-12 w-full flex justify-start items-center px-8 sm:px-10">
            <div className="flex justify-end items-center">
              {!downloadableByMe ? (
                <button
                  onClick={() =>
                    !user ? setAuthPanelOpen(true) : setDownloadPanelOpen(true)
                  }
                  className="bg-violet-600 py-2 px-4 rounded-full text-white text-xs"
                >
                  下载
                </button>
              ) : (
                <Link
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`/bundle/download/${bundle.id}`}
                  className="bg-emerald-600 py-2 px-4 rounded-full text-white text-xs"
                >
                  下载
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mt-20 md:mt-0 w-full flex justify-start px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="flex flex-col justify-center items-start w-full 2xs:px-4 xs:px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32">
            <span className="text-gray-800 font-semibold text-lg 2xs:text-xl xs:text-2xl">
              {bundle.title}
            </span>
            <span className="text-gray-400 text-[10px] 2xs:text-xs mt-2">
              {bundle.subtitle}
            </span>

            <div className="w-full flex flex-col xs:flex-row justify-between items-start xs:items-center mt-4 space-y-3 xs:space-y-0">
              <div className="flex justify-start items-center space-x-1">
                {bundle.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-[#e3eeff] rounded-full px-3 py-1 text-[10px] 2xs:text-xs text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-start items-center -space-x-1.5">
                {bundle.format.map((f, i) => {
                  const Icon = formatIcons[f as keyof typeof formatIcons];

                  return (
                    <span
                      key={i}
                      className="w-7 h-7 outline-[#f2f7ff] outline rounded-full bg-[#e3eeff] flex justify-center items-center"
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                    </span>
                  );
                })}
              </div>
            </div>

            <span className="text-gray-600 mt-10 tracking-widest font-light text-[12px] leading-6 2xs:text-[14px] 2xs:leading-7 xs:text-[16px] xs:leading-8">
              {bundle.description}
            </span>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-center items-center w-full space-y-10 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          {bundle.images.slice(1).map((image, i) => (
            <div key={i} className="w-full relative">
              <Image
                src={image as string}
                alt={`image-${i}`}
                width={0}
                height={0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full rounded-3xl overflow-clip"
                priority
              />
            </div>
          ))}
        </div>
      </div>

      <div className="sticky h-full top-44 hidden md:block">
        <div className="w-24 h-full flex flex-col justify-start items-start">
          {!downloadableByMe ? (
            <button
              onClick={() =>
                !user ? setAuthPanelOpen(true) : setDownloadPanelOpen(true)
              }
              className="bg-violet-600 py-2.5 px-6 rounded-full text-white text-sm font-light"
            >
              下载
            </button>
          ) : (
            <Link
              rel="noopener noreferrer"
              target="_blank"
              href={`/bundle/download/${bundle.id}`}
              className="bg-emerald-600 py-2.5 px-6 rounded-full text-white text-sm font-light"
            >
              下载
            </Link>
          )}

          <div className="mt-12 flex flex-col justify-center items-center space-y-2">
            <span className="relative w-14 h-14 rounded-full overflow-clip flex justify-start items-center bg-[#404040]">
              {bundle.creator_avatar ? (
                <Image
                  src={bundle.creator_avatar as string}
                  alt="avatar"
                  fill={true}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : bundle.creator_nickname ? (
                <span className="text-gray-300 text-base">
                  {bundle.creator_nickname[0]}
                </span>
              ) : (
                <UserCircleIcon className="w-full h-full" />
              )}
            </span>
            <span className="text-xs text-gray-400">
              {bundle.creator_nickname}
            </span>
          </div>
          <div className="hidden mt-5 justify-start items-start -space-x-4">
            {bundle.format.map((f, i) => {
              const Icon = formatIcons[f as keyof typeof formatIcons];

              return (
                <div
                  key={i}
                  className="flex flex-col justify-start items-center space-y-2"
                >
                  <span className="w-14 h-14 outline-[#f2f7ff] outline rounded-full bg-[#e3eeff] flex justify-center items-center">
                    {Icon && <Icon className="w-5 h-5" />}
                  </span>
                  {i === 0 && (
                    <span className="text-xs text-gray-400">格式</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex flex-col justify-start items-center space-y-2">
            <span
              className={`w-14 h-14 rounded-full ${
                likedByMe ? "bg-[#f27979]" : "bg-[#e3eeff]"
              } flex flex-col justify-center items-center space-y-1 cursor-pointer`}
              onClick={() =>
                !user
                  ? setAuthPanelOpen(true)
                  : likedByMe
                  ? unlike(id)
                  : like(id)
              }
            >
              <LikeIcon
                className={`mt-[6px] w-5 h-5 ${
                  likedByMe ? "text-white" : "text-[#25314C]"
                }`}
              />
              <span
                className={`${
                  likedByMe ? "text-white" : "text-[#25314c]"
                } text-[10px]`}
              >
                {numOfLikes || 0}
              </span>
            </span>
            <span className="text-xs text-gray-400">喜欢</span>
          </div>
          <div className="mt-5 flex flex-col justify-start items-center space-y-2">
            <span
              className={`w-14 h-14 rounded-full ${
                bookmarkedByMe ? "bg-[#936efe]" : "bg-[#e3eeff]"
              } flex justify-center items-center cursor-pointer`}
              onClick={() =>
                !user
                  ? setAuthPanelOpen(true)
                  : bookmarkedByMe
                  ? unbookmark(id)
                  : bookmark(id)
              }
            >
              <BookmarkIcon
                className={`w-5 h-5 ${
                  bookmarkedByMe ? "text-white" : "text-[#25314C]"
                }`}
              />
            </span>
            <span className="text-xs text-gray-400">收藏</span>
          </div>
          <div className="mt-5 flex flex-col justify-start items-center space-y-2">
            <span className="w-14 h-14 rounded-full bg-[#e3eeff] flex justify-center items-center">
              <ShareIcon className="w-5 h-5 text-[#25314C]" />
            </span>
            <span className="text-xs text-gray-400">分享</span>
          </div>
          <div className="mt-5 flex flex-col justify-start items-center space-y-2">
            <span className="w-14 h-14 rounded-full bg-[#e3eeff] flex justify-center items-center">
              <QQIcon className="w-5 h-5 text-[#25314C]" />
            </span>
            <span className="text-xs text-gray-400">客服</span>
          </div>
        </div>
      </div>

      {user && <DownloadPanel bundle={bundle} />}
    </div>
  );
}
