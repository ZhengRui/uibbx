"use client";

import { UserCircleIcon } from "@heroicons/react/24/solid";
import { UibbxIcon, PenLineIcon } from "@/components/icons";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const AccountSquare = () => {
  const { isPending: isAuthPending, data: user } = useAuth();

  if (isAuthPending) return null;

  return (
    <div className="w-52 h-full rounded-t-xl overflow-clip">
      <div className="bg-[#404040] h-48 bg-opacity-50 px-14 relative">
        <div className="h-full -translate-x-4 flex flex-col justify-center items-start text-white">
          <UserCircleIcon className="w-24 h-24" />
          <span className="mt-3 text-xs">{user?.username}</span>
          <div className="mt-1 flex justify-between items-center space-x-1">
            <UibbxIcon className="w-3 h-3" />
            <span className="text-xs">{user?.cellnum || user?.email}</span>
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
