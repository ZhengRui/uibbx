"use client";

import { useBundlePublic } from "@/hooks/useBundle";
import { useAuth } from "@/hooks/useAuth";
import {
  useNumOfLikes,
  useLikedByMe,
  useLike,
  useUnlike,
} from "@/hooks/useLike";
import { useRouter } from "next/navigation";
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
import { use } from "react";

export default function BundlePreviewPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const router = useRouter();

  const {
    isPending: isPendingAuth,
    data: user,
    isError: isErrorAuth,
  } = useAuth();
  const {
    isPending: isPendingBundle,
    data: bundle,
    isError: isErrorBundle,
  } = useBundlePublic(id);
  const {
    isPending: isPendingNumOfLikes,
    data: numOfLikes,
    isError: isErrorNumOfLikes,
  } = useNumOfLikes(id);
  const {
    isPending: isPendingLikedByMe,
    data: likedByMe,
    isError: isErrorLikedByMe,
  } = useLikedByMe(id);

  const like = useLike();
  const unlike = useUnlike();

  if (
    isPendingAuth ||
    isPendingBundle ||
    isPendingNumOfLikes ||
    isPendingLikedByMe ||
    !bundle
  )
    return null;

  if (isErrorAuth || isErrorBundle || isErrorNumOfLikes || isErrorLikedByMe)
    router.push("/");

  return (
    <>
      <div className="w-full flex flex-col items-center max-w-7xl">
        <div className="w-full flex justify-center px-48">
          <div className="flex flex-col justify-center items-start max-w-xl">
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

        <div className="mt-16 flex flex-col justify-center items-center w-full space-y-10 px-48">
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

      <div className="w-full flex justify-center max-w-7xl fixed top-28">
        <div className="absolute w-48 -right-2 flex flex-col justify-start items-start">
          <button className="bg-gray-800 py-2.5 px-6 rounded-full text-gray-200 text-sm font-light">
            下载
          </button>
          <div className="mt-16 flex justify-start items-center space-x-2">
            <span className="bg-gray-700 rounded-full w-14 h-14"></span>
            <span className="text-xs text-gray-700">
              {bundle.creator_username}
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
            <span className="w-14 h-14 rounded-full bg-[#e3eeff] flex justify-center items-center">
              <ShareIcon className="w-5 h-5 text-[#25314C]" />
            </span>
            <span className="text-xs text-gray-400">分享</span>
          </div>
          <div className="mt-5 flex flex-col justify-start items-center space-y-2">
            <span
              className={`w-14 h-14 rounded-full ${
                likedByMe ? "bg-[#936efe]" : "bg-[#e3eeff]"
              } flex flex-col justify-center items-center space-y-1 cursor-pointer`}
              onClick={() =>
                !user ? alert("login first") : likedByMe ? unlike(id) : like(id)
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
            <span className="w-14 h-14 rounded-full bg-[#e3eeff] flex justify-center items-center">
              <BookmarkIcon className="w-5 h-5 text-[#25314C]" />
            </span>
            <span className="text-xs text-gray-400">收藏</span>
          </div>
          <div className="mt-5 flex flex-col justify-start items-center space-y-2">
            <span className="w-14 h-14 rounded-full bg-[#e3eeff] flex justify-center items-center">
              <QQIcon className="w-5 h-5 text-[#25314C]" />
            </span>
            <span className="text-xs text-gray-400">客服</span>
          </div>
        </div>
      </div>
    </>
  );
}
