"use client";

import { UserCircleIcon } from "@heroicons/react/24/solid";
import { UibbxIcon, PenLineIcon } from "@/components/icons";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

const AccountSquare = () => {
  const { isPending: isAuthPending, data: user } = useAuth();

  if (isAuthPending) return null;

  return (
    <div className="w-36 sm:w-44 lg:w-52 h-full rounded-t-xl overflow-clip">
      <div className="bg-[#404040] h-40 sm:h-48 bg-opacity-50 relative">
        <div className="h-full -translate-x-4 flex flex-col justify-center items-center text-white">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-clip flex justify-center items-center bg-[#404040]">
            {user?.avatar ? (
              <Image
                src={user.avatar as string}
                alt="avatar"
                fill={true}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : user?.nickname ? (
              <span className="text-gray-200 text-5xl">{user.nickname[0]}</span>
            ) : (
              <UserCircleIcon className="w-full h-full" />
            )}
          </div>

          <span className="mt-2 text-xs sm:text-sm lg:mt-3 lg:text-base">
            {user?.nickname}
          </span>
          <div className="mt-1 flex justify-between items-center space-x-1">
            <UibbxIcon className="w-2 h-2 lg:w-3 lg:h-3" />
            <span className="text-[10px] lg:text-xs">{user?.username}</span>
          </div>
        </div>
        <Link
          href="/account/edit"
          className="absolute top-2 right-2 flex justify-start items-center space-x-2 text-gray-400 hover:text-gray-100 cursor-pointer"
        >
          <span className="text-[10px]">编辑个人资料</span>
          <PenLineIcon className="w-2 h-2" />
        </Link>
      </div>
    </div>
  );
};

export default AccountSquare;
