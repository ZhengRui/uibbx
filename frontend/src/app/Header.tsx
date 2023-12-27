"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { authPanelOpenAtom } from "@/atoms";
import { useSetAtom } from "jotai";
import { useAuth } from "@/hooks/useAuth";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";

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
          <UserCircleIcon className="w-11 h-11" />
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

  const isAccountPage = path === "/account";

  return (
    <header className={`w-full ${isAccountPage ? "" : "bg-[#01102d]"}`}>
      <div className={`w-full ${isAccountPage ? "" : "hidden"}`}>
        <Image
          src="/account_header_background.png"
          alt="account_header_background"
          width={0}
          height={0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full"
          priority
        />
      </div>

      <div
        className={`${
          isAccountPage ? "absolute top-0 w-full" : ""
        } max-w-screen-2xl mx-auto px-8 lg:px-12 xl:px-16 py-6 flex justify-between items-center`}
      >
        <Categories />
        <Logo />
        <User />
      </div>
    </header>
  );
};

export default Header;
