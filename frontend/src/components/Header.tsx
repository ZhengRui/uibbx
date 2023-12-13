"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { authPanelOpenAtom } from "@/atoms";
import { useSetAtom } from "jotai";

const cates = [
  { name: "UI套件", href: "/ui" },
  { name: "3D素材", href: "/3d" },
  { name: "图标合集", href: "/icons" },
  { name: "原型", href: "/prototypes" },
  { name: "样机", href: "/apps" },
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
  <div className="relative flex justify-center items-center h-8 w-32">
    <Image
      src="/logo.png"
      alt="uibbix"
      fill={true}
      className="object-contain"
    />
  </div>
);

const Search = () => (
  <div className="rounded-full bg-[#2f3e55] p-2 w-48 flex justify-start items-center space-x-2 text-gray-400">
    <MagnifyingGlassIcon className="w-[18px] h-[18px] stroke-1" />
    <span>搜索</span>
  </div>
);

const User = () => {
  const setAuthPanelOpen = useSetAtom(authPanelOpenAtom);

  return (
    <div className="flex flex-grow justify-end items-center space-x-8 text-white text-sm">
      <Search />
      <button onClick={() => setAuthPanelOpen(true)}>登录</button>
      <button
        type="button"
        className="font-bold rounded-full bg-violet-600 px-7 py-3"
      >
        升级VIP
      </button>
    </div>
  );
};

const Header = () => {
  return (
    <header className="top-0 left-0 w-full bg-[#01102d]">
      <div className="max-w-screen-2xl mx-auto px-8 lg:px-12 xl:px-16 py-6 flex justify-between items-center">
        <Categories />
        <Logo />
        <User />
      </div>
    </header>
  );
};

export default Header;
