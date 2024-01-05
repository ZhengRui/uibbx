"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { authPanelOpenAtom } from "@/atoms";
import { useSetAtom } from "jotai";
import { useAuth } from "@/hooks/useAuth";
import {
  UserCircleIcon,
  MenuIcon,
  XMarkOutlineIcon,
  LogoutOulineIcon,
} from "@/components/icons";
import { usePathname } from "next/navigation";
import AccountSquare from "./AccountSquare";
import { UibbxIconColored } from "@/components/icons";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";

import { useQueryClient } from "@tanstack/react-query";

const cates = [
  { name: "UI套件", href: "/ui" },
  { name: "3D素材", href: "/3d" },
  { name: "图标合集", href: "/icons" },
  { name: "原型", href: "/prototypes" },
  { name: "样机", href: "/apps" },
  { name: "免费", href: "/free" },
];

export const Logo = () => (
  <Link href="/">
    <div className="relative flex justify-center items-center">
      <UibbxIconColored className="h-9 w-9" />
      <div className="ml-2 hidden md:block">
        <span className="text-[#936efe] tracking-widest text-2xl">UI</span>
        <span className="text-[#edf860] tracking-widest text-2xl">BBX</span>
      </div>
    </div>
  </Link>
);

const User = () => {
  const { isPending, data: user } = useAuth();
  const setAuthPanelOpen = useSetAtom(authPanelOpenAtom);

  return (
    <>
      {isPending ? (
        <div className="w-11 h-11 rounded-full bg-gray-400 opacity-30 animate-pulse"></div>
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
    </>
  );
};

const Header = () => {
  const path = usePathname();
  const setAuthPanelOpen = useSetAtom(authPanelOpenAtom);

  const { data: user } = useAuth();

  const isAccountPage = path === "/account" && user;

  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem("token");

    queryClient.invalidateQueries({
      queryKey: ["whoami"],
    });
  };

  return (
    <header
      className={`sticky top-0 z-30 w-full flex justify-center ${
        isAccountPage ? "" : "bg-[#01102d]"
      }`}
    >
      <Popover className="w-full">
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
            <div className="max-w-screen-2xl w-full mx-auto px-8 lg:px-12 xl:px-16 flex justify-between items-end">
              <AccountSquare />

              <button
                className="md:hidden text-xs tracking-widest border border-[#f27979] text-[#f27979] bg-[#404040] bg-opacity-40 p-2 3xs:px-3 3xs:py-1.5 2xs:px-4 2xs:py-2 mb-2 rounded-full"
                onClick={logout}
              >
                <span className="hidden 3xs:block">退出登录</span>
                <LogoutOulineIcon className="w-5 h-5 3xs:hidden" />
              </button>
            </div>
          </div>
        </div>

        <div
          className={`${
            isAccountPage ? "absolute top-0" : ""
          } max-w-screen-2xl w-full mx-auto px-8 lg:px-12 xl:px-16 py-6 grid grid-cols-7`}
        >
          <div className="col-span-full 3xs:col-span-2 sm:col-span-3 flex justify-between 3xs:justify-start items-center">
            <div className="w-full hidden lg:flex justify-start items-center space-x-6 text-white text-sm">
              {cates.map((cate, i) => (
                <Link key={i} href={cate.href}>
                  {cate.name}
                </Link>
              ))}
            </div>

            <div className="flex justify-start items-center lg:hidden">
              <Popover.Button className="inline-flex items-center justify-center text-white">
                <span className="sr-only">Open main menu</span>
                <MenuIcon className="h-8 w-8" aria-hidden="true" />
              </Popover.Button>
            </div>

            <div className="3xs:ml-4 2xs:ml-8 sm:hidden flex justify-center items-center h-11">
              <Logo />
            </div>
          </div>

          <div className="hidden sm:col-span-1  sm:flex justify-center items-center h-11">
            <Logo />
          </div>

          <div className="col-span-5 sm:col-span-3 hidden 3xs:flex justify-end items-center">
            <div className="flex justify-end items-center space-x-4 2xs:space-x-8 text-white text-sm">
              <div className="rounded-full bg-[#2f3e55] p-2 w-32 lg:w-48 hidden justify-start items-center space-x-2 text-gray-400">
                <MagnifyingGlassIcon className="w-[18px] h-[18px] stroke-1" />
                <span>搜索</span>
              </div>

              <button
                type="button"
                className="font-bold rounded-full bg-violet-600 px-4 xs:px-7 py-3 text-xs xs:text-sm"
                onClick={() => (!user ? setAuthPanelOpen(true) : null)}
              >
                升级VIP
              </button>

              <User />
            </div>
          </div>
        </div>

        <Transition
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="absolute z-20 top-0 inset-x-0 xs:w-72 p-2 transition transform origin-top-right lg:hidden"
          >
            <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="mt-4 pl-2">
                <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-z-grayish ">
                  <span className="sr-only">Close menu</span>
                  <XMarkOutlineIcon
                    className="h-5 w-5 2xs:h-6 2xs:w-6"
                    aria-hidden="true"
                  />
                </Popover.Button>
              </div>

              <div className="px-5 pt-6 pb-3 3xs:hidden flex justify-start items-center space-x-8">
                <User />
                <button
                  type="button"
                  className="font-bold rounded-full bg-violet-600 px-4 py-3 text-xs text-white"
                  onClick={() => (!user ? setAuthPanelOpen(true) : null)}
                >
                  升级VIP
                </button>
              </div>

              <div className="py-2 border-b">
                {cates.map((item) => (
                  <Link
                    href={item.href}
                    key={item.name}
                    className="block px-5 py-3 font-poppins text-sm font-normal text-z-grayish focus:text-white focus:bg-[#ff8b14]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </header>
  );
};

export default Header;
