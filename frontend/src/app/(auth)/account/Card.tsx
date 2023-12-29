"use client";

import Image from "next/image";
import { LikeIcon, BookmarkIcon, PenLineIcon } from "@/components/icons";
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
    <div className="relative space-y-2 group">
      <Link href={`/bundle/preview/${id}`}>
        <div className="w-full relative h-48 rounded-xl overflow-clip">
          {isPendingLikedByMe ||
          isPendingBookmarkedByMe ||
          isPendingNumOfLikes ? null : (
            <Image
              src={bundle.images[0] as string}
              alt={bundle.title}
              fill={true}
              className="object-cover cursor-pointer"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
      </Link>
      <div className="w-full flex justify-between items-center text-xs px-2">
        <span>{bundle.title}</span>
        <span>¥ {bundle.purchase_price}</span>
      </div>

      {!editDisabled && (
        <div className="absolute top-1 left-2">
          <Link href={`/bundle/update/${id}`}>
            <span className="w-8 h-8 rounded-full hidden group-hover:flex bg-white text-gray-700 justify-center items-center">
              <PenLineIcon className="w-3 h-3" />
            </span>
          </Link>
        </div>
      )}

      <div className="absolute top-1 right-2 flex justify-end items-start space-x-2">
        {!likeDisabled && (
          <button
            className={`relative w-8 h-8 rounded-full opacity-50 group-hover:opacity-100 ${
              likedByMe
                ? "bg-[#f27979] text-white"
                : "bg-[#e3eeff] text-[#25314c]"
            } flex justify-center items-center ${
              likeDisabled ? "cursor-not-allowed" : ""
            }`}
            onClick={() => (likedByMe ? unlike(id) : like(id))}
            disabled={likeDisabled}
          >
            <LikeIcon className="w-3 h-3" />

            <span
              className={`absolute bottom-0 w-full text-center text-[6px] font-bold opacity-50 group-hover:opacity-100 ${
                likedByMe ? "text-white" : "text-[#25314c]"
              }`}
            >
              {numOfLikes || 0}
            </span>
          </button>
        )}

        {!bookmarkDisabled && (
          <button
            className={`w-8 h-8 rounded-full opacity-50 group-hover:opacity-100 ${
              bookmarkedByMe
                ? "bg-[#9363f3] text-white"
                : "bg-[#e3eeff] text-[#25314c]"
            } flex justify-center items-center ${
              bookmarkDisabled ? "cursor-not-allowed" : ""
            }`}
            onClick={() => (bookmarkedByMe ? unbookmark(id) : bookmark(id))}
            disabled={bookmarkDisabled}
          >
            <BookmarkIcon className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
