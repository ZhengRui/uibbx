"use client";

import Image from "next/image";
import {
  LikeIcon,
  BookmarkIcon,
  PenLineIcon,
  UserCircleIcon,
  ShareIcon,
} from "@/components/icons";
import { BundleIF } from "@/interfaces";
import {
  useLike,
  useUnlike,
  useNumOfLikes,
  useLikedByMe,
} from "@/hooks/useLike";
import {
  useBookmark,
  useUnbookmark,
  useBookmarkedByMe,
} from "@/hooks/useBookmark";
import Link from "next/link";
import { EyeIcon } from "@heroicons/react/24/solid";
import { convertDateString } from "./RefersTable";
import { SkeletonedImage } from "@/components/SkeletonImage";

const Card = ({
  bundle,
  likeDisabled = false,
  bookmarkDisabled = false,
  editDisabled = true,
}: {
  bundle: BundleIF;
  likeDisabled?: boolean;
  bookmarkDisabled?: boolean;
  editDisabled?: boolean;
}) => {
  const id = bundle.id!;

  const { isPending: isPendingLikedByMe, data: likedByMe } = useLikedByMe(id);
  const { isPending: isPendingNumOfLikes, data: numOfLikes } =
    useNumOfLikes(id);
  const { isPending: isPendingBookmarkedByMe, data: bookmarkedByMe } =
    useBookmarkedByMe(id);

  const like = useLike();
  const unlike = useUnlike();
  const bookmark = useBookmark();
  const unbookmark = useUnbookmark();

  return (
    <div className="relative group">
      <div className="w-full relative h-72 rounded-2xl overflow-clip">
        {isPendingLikedByMe ||
        isPendingBookmarkedByMe ||
        isPendingNumOfLikes ? (
          <div className="w-full h-full animate-pulse bg-[#404040] bg-opacity-50"></div>
        ) : (
          <SkeletonedImage
            src={bundle.images[0] as string}
            alt={bundle.title}
          />
        )}
        <div className="absolute w-full h-full opacity-0 transition ease-in-out delay-50 duration-300 group-hover:opacity-100 group-hover:bg-opacity-80 bg-[#404040]">
          <div className="relative w-full h-full flex justify-center items-center">
            <Link
              href={`/bundle/preview/${id}`}
              className="absolute w-full h-full"
            />

            <Link
              href={`/bundle/preview/${id}`}
              className="z-10 w-12 h-12 border rounded-full p-3 transition ease-in-out delay-50 duration-300 text-white border-white opacity-50 hover:opacity-100"
            >
              <EyeIcon className="w-full h-full" />
            </Link>

            {!editDisabled && (
              <Link
                href={`/bundle/update/${id}`}
                className="z-10 ml-8 w-12 h-12 border rounded-full p-4 transition ease-in-out delay-50 duration-300 text-white border-white opacity-50 hover:opacity-100"
              >
                <PenLineIcon className="w-full h-full" />
              </Link>
            )}
          </div>

          <div className="absolute top-4 right-2 flex justify-end items-start space-x-2">
            {!likeDisabled && (
              <div className="flex justify-center items-center group/likes">
                <span className="text-[10px] text-white mr-2 transition ease-in-out delay-50 duration-300 opacity-60 group-hover/likes:opacity-100">
                  {numOfLikes || 0}
                </span>

                <button
                  className={`w-5 h-5 rounded-full transition ease-in-out delay-50 duration-300 opacity-60 hover:opacity-100 ${
                    likedByMe ? "text-[#f27979]" : "text-[#e3eeff]"
                  } flex justify-center items-center ${
                    likeDisabled ? "cursor-not-allowed" : ""
                  }`}
                  onClick={() => (likedByMe ? unlike(id) : like(id))}
                  disabled={likeDisabled}
                >
                  <LikeIcon className="w-full h-full" />
                </button>
              </div>
            )}

            {!bookmarkDisabled && (
              <button
                className={`w-5 h-5 rounded-full transition ease-in-out delay-50 duration-300 opacity-60 hover:opacity-100 ${
                  bookmarkedByMe ? "text-[#a259ff]" : "text-[#e3eeff]"
                } flex justify-center items-center ${
                  bookmarkDisabled ? "cursor-not-allowed" : ""
                }`}
                onClick={() => (bookmarkedByMe ? unbookmark(id) : bookmark(id))}
                disabled={bookmarkDisabled}
              >
                <BookmarkIcon className="w-full h-full" />
              </button>
            )}

            <button className="w-5 h-5 rounded-full transition ease-in-out delay-50 duration-300 opacity-60 hover:opacity-100 text-[#e3eeff] flex justify-center items-center">
              <ShareIcon className="w-full h-full" />
            </button>
          </div>
        </div>
      </div>
      <div className="w-full p-3">
        <div className="w-full flex flex-col @[360px]:flex-row justify-between space-y-1 items-start @[360px]:items-center text-xs @[240px]:text-sm text-gray-700">
          <span>{bundle.title}</span>
          <span>¥ {bundle.purchase_price}</span>
        </div>
        <div className="mt-2 w-full hidden justify-between items-center text-xs">
          <div className="flex justify-start items-center">
            <span className="relative w-6 h-6 rounded-full overflow-clip flex justify-center items-center bg-[#404040] bg-opacity-10">
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
                <UserCircleIcon className="w-full h-full opacity-60" />
              )}
            </span>
            <span className="ml-2 text-gray-600">
              {bundle.creator_nickname}
            </span>
          </div>
          <div className="space-x-0.5">
            {bundle.tags.map((tag, i) => (
              <span
                className="border border-gray-400 rounded-lg py-0.5 px-1 text-gray-500"
                key={i}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;

export const CardOfPurchase = ({
  bundle,
  likeDisabled = false,
  bookmarkDisabled = false,
  editDisabled = true,
}: {
  bundle: BundleIF & {
    purchased_price: number;
    purchased_at: string;
    order_id: string;
  };
  likeDisabled?: boolean;
  bookmarkDisabled?: boolean;
  editDisabled?: boolean;
}) => {
  const id = bundle.id!;

  const { isPending: isPendingLikedByMe, data: likedByMe } = useLikedByMe(id);
  const { isPending: isPendingNumOfLikes, data: numOfLikes } =
    useNumOfLikes(id);
  const { isPending: isPendingBookmarkedByMe, data: bookmarkedByMe } =
    useBookmarkedByMe(id);

  const like = useLike();
  const unlike = useUnlike();
  const bookmark = useBookmark();
  const unbookmark = useUnbookmark();

  return (
    <div className="relative group bg-white p-4 rounded-2xl overflow-clip">
      <div className="w-full">
        <div className="w-full flex flex-col @[360px]:flex-row justify-between space-y-1 items-start @[360px]:items-center text-xs @[240px]:text-sm text-gray-700">
          <span>{bundle.title}</span>
          <span>¥ {bundle.purchase_price}</span>
        </div>
        <div className="mt-2 w-full hidden justify-between items-center text-xs">
          <div className="flex justify-start items-center">
            <span className="relative w-6 h-6 rounded-full overflow-clip flex justify-center items-center bg-[#404040] bg-opacity-10">
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
                <UserCircleIcon className="w-full h-full opacity-60" />
              )}
            </span>
            <span className="ml-2 text-gray-600">
              {bundle.creator_nickname}
            </span>
          </div>
          <div className="space-x-0.5">
            {bundle.tags.map((tag, i) => (
              <span
                className="border border-gray-400 rounded-lg py-0.5 px-1 text-gray-500"
                key={i}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 w-full relative h-72 rounded-2xl overflow-clip">
        {isPendingLikedByMe ||
        isPendingBookmarkedByMe ||
        isPendingNumOfLikes ? null : (
          <Image
            src={bundle.images[0] as string}
            alt={bundle.title}
            fill={true}
            className="object-cover cursor-pointer"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        )}
        <div className="absolute w-full h-full opacity-0 transition ease-in-out delay-50 duration-300 group-hover:opacity-100 group-hover:bg-opacity-80 bg-[#404040]">
          <div className="relative w-full h-full flex justify-center items-center">
            <Link
              href={`/bundle/preview/${id}`}
              className="absolute w-full h-full"
            />

            <Link
              href={`/bundle/preview/${id}`}
              className="z-10 w-12 h-12 border rounded-full p-3 transition ease-in-out delay-50 duration-300 text-white border-white opacity-50 hover:opacity-100"
            >
              <EyeIcon className="w-full h-full" />
            </Link>

            {!editDisabled && (
              <Link
                href={`/bundle/update/${id}`}
                className="z-10 ml-8 w-12 h-12 border rounded-full p-4 transition ease-in-out delay-50 duration-300 text-white border-white opacity-50 hover:opacity-100"
              >
                <PenLineIcon className="w-full h-full" />
              </Link>
            )}
          </div>

          <div className="absolute top-4 right-2 flex justify-end items-start space-x-2">
            {!likeDisabled && (
              <div className="flex justify-center items-center group/likes">
                <span className="text-[10px] text-white mr-2 transition ease-in-out delay-50 duration-300 opacity-60 group-hover/likes:opacity-100">
                  {numOfLikes || 0}
                </span>

                <button
                  className={`w-5 h-5 rounded-full transition ease-in-out delay-50 duration-300 opacity-60 hover:opacity-100 ${
                    likedByMe ? "text-[#f27979]" : "text-[#e3eeff]"
                  } flex justify-center items-center ${
                    likeDisabled ? "cursor-not-allowed" : ""
                  }`}
                  onClick={() => (likedByMe ? unlike(id) : like(id))}
                  disabled={likeDisabled}
                >
                  <LikeIcon className="w-full h-full" />
                </button>
              </div>
            )}

            {!bookmarkDisabled && (
              <button
                className={`w-5 h-5 rounded-full transition ease-in-out delay-50 duration-300 opacity-60 hover:opacity-100 ${
                  bookmarkedByMe ? "text-[#a259ff]" : "text-[#e3eeff]"
                } flex justify-center items-center ${
                  bookmarkDisabled ? "cursor-not-allowed" : ""
                }`}
                onClick={() => (bookmarkedByMe ? unbookmark(id) : bookmark(id))}
                disabled={bookmarkDisabled}
              >
                <BookmarkIcon className="w-full h-full" />
              </button>
            )}

            <button className="w-5 h-5 rounded-full transition ease-in-out delay-50 duration-300 opacity-60 hover:opacity-100 text-[#e3eeff] flex justify-center items-center">
              <ShareIcon className="w-full h-full" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 w-full flex flex-col @[360px]:flex-row space-y-1 justify-between items-start @[360px]:items-center text-[10px] @[240px]:text-xs text-gray-400">
        <span>{`订单号: ${bundle.order_id}`}</span>
        <span>{`时间: ${convertDateString(bundle.purchased_at)}`}</span>
        <span className="text-gray-700 @[360px]:hidden">{`实付款: ¥ ${bundle.purchased_price}`}</span>
      </div>
      <div className="mt-3 w-full hidden @[360px]:flex justify-end items-center text-sm">
        <span>{`实付款: ¥ ${bundle.purchased_price}`}</span>
      </div>
    </div>
  );
};
