"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { authPanelOpenAtom } from "@/atoms";
import { useSetAtom } from "jotai";
import { useAuth } from "@/hooks/useAuth";
import { UserCircleIcon } from "@/components/icons";
import { usePathname } from "next/navigation";
import AccountSquare from "./AccountSquare";

const cates = [
  { name: "UI套件", href: "/ui" },
  { name: "3D素材", href: "/3d" },
  { name: "图标合集", href: "/icons" },
  { name: "原型", href: "/prototypes" },
  { name: "样机", href: "/apps" },
  { name: "免费", href: "/free" },
];

const Categories = () => (
  <div className="flex flex-grow justify-start items-center space-x-8 text-white text-sm">
    {cates.map((cate, i) => (
      <Link key={i} href={cate.href}>
        {cate.name}
      </Link>
    ))}
  </div>
);

export const Logo = () => (
  <Link href="/">
    <div className="relative flex justify-center items-center h-8 w-32">
      <Image
        src="/logo.png"
        alt="uibbix"
        fill={true}
        className="object-contain"
        priority
      />
    </div>
  </Link>
);

const Search = () => (
  <div className="rounded-full bg-[#2f3e55] p-2 w-32 lg:w-48 flex justify-start items-center space-x-2 text-gray-400">
    <MagnifyingGlassIcon className="w-[18px] h-[18px] stroke-1" />
    <span>搜索</span>
  </div>
);

const User = () => {
  const setAuthPanelOpen = useSetAtom(authPanelOpenAtom);

  const { isPending, data: user } = useAuth();

  return (
    <div className="flex flex-grow justify-end items-center space-x-8 text-white text-sm">
      <Search />

      <button
        type="button"
        className="font-bold rounded-full bg-violet-600 px-7 py-3"
        onClick={() => (!user ? setAuthPanelOpen(true) : null)}
      >
        升级VIP
      </button>

      {isPending ? (
        <div className="w-8 h-8 rounded-full bg-gray-400 opacity-30"></div>
      ) : user ? (
        <Link href="/account" className="h-full flex items-center">
          <div className="relative w-11 h-11 rounded-full overflow-clip flex justify-center items-center bg-[#404040]">
            {user?.avatar ? (
              <Image
                src={user.avatar as string}
                alt="avatar"
                fill={true}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : user?.nickname ? (
              <span className="text-gray-300 text-base">
                {user.nickname[0]}
              </span>
            ) : (
              <UserCircleIcon className="w-full h-full" />
            )}
          </div>
        </Link>
      ) : (
        <button onClick={() => setAuthPanelOpen(true)} className="w-11">
          登录
        </button>
      )}
    </div>
  );
};

const Header = () => {
  const path = usePathname();

  const { data: user } = useAuth();

  const isAccountPage = path === "/account" && user;

  return (
    <header
      className={`sticky top-0 z-30 w-full flex justify-center ${
        isAccountPage ? "" : "bg-[#01102d]"
      }`}
    >
      <div className={`relative w-full ${isAccountPage ? "h-72" : "hidden"}`}>
        <Image
          src="/account_header_background.png"
          alt="account_header_background"
          fill={true}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />

        <div className="absolute bottom-0 w-full">
          <div className="max-w-screen-2xl w-full mx-auto px-8 lg:px-12 xl:px-16 flex justify-between">
            <AccountSquare />
          </div>
        </div>
      </div>

      <div
        className={`${
          isAccountPage ? "absolute top-0" : ""
        } max-w-screen-2xl w-full mx-auto px-8 lg:px-12 xl:px-16 py-6 flex justify-between items-center`}
      >
        <Categories />
        <Logo />
        <User />
      </div>
    </header>
  );
};

export default Header;
