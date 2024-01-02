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

  const like = useLike();
  const unlike = useUnlike();
  const bookmark = useBookmark();
  const unbookmark = useUnbookmark();

  const setAuthPanelOpen = useSetAtom(authPanelOpenAtom);
  const setDownloadPanelOpen = useSetAtom(downloadPanelOpenAtom);

  if (
    isPendingAuth ||
    isPendingBundle ||
    isPendingNumOfLikes ||
    isPendingLikedByMe ||
    isPendingBookmarkedByMe ||
    !bundle
  )
    return null;

  return (
    <>
      <div className="w-full flex flex-col items-center max-w-7xl">
        <div className="w-full flex justify-start px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="flex flex-col justify-center items-start px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32">
            <span className="text-gray-800 font-semibold text-xl">
              {bundle.title}
            </span>
            <span className="text-gray-400 text-xs mt-2">
              {bundle.subtitle}
            </span>
            <span className="text-gray-600 pt-10 leading-8 tracking-widest font-light">
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

      <div className="sticky h-full top-28">
        <div className="w-24 h-full flex flex-col justify-start items-center">
          <button
            onClick={() =>
              !user ? setAuthPanelOpen(true) : setDownloadPanelOpen(true)
            }
            className="bg-gray-800 py-2.5 px-6 rounded-full text-gray-200 text-sm font-light"
          >
            下载
          </button>
          <div className="mt-16 flex flex-col justify-center items-center space-y-2">
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
              {/* {bundle.creator_nickname} */}
              {"小西八啊小西八啊"}
            </span>
          </div>
          <div className="mt-5 flex flex-col justify-start items-center space-y-2">
            <span className="w-14 h-14 rounded-full bg-[#e3eeff] flex justify-center items-center">
              {bundle.format === "figma" ? (
                <FigmaIcon className="w-5 h-5" />
              ) : bundle.format === "sketch" ? (
                <SketchIcon className="w-5 h-5" />
              ) : bundle.format === "photoshop" ? (
                <PhotoShopIcon className="w-5 h-5" />
              ) : null}
            </span>
            <span className="text-xs text-gray-400">格式</span>
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

      <DownloadPanel />
    </>
  );
}
