"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { authPanelOpenAtom } from "@/atoms";
import { useSetAtom } from "jotai";
import { useAuth } from "@/hooks/useAuth";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem("token");

    queryClient.invalidateQueries({
      queryKey: ["whoami"],
    });
    queryClient.invalidateQueries({
      queryKey: ["liked"],
    });
  };

  return (
    <div className="flex flex-grow justify-end items-center space-x-8 text-white text-sm">
      <Search />

      <button
        type="button"
        className="font-bold rounded-full bg-violet-600 px-7 py-3"
      >
        升级VIP
      </button>

      {isPending ? (
        <div className="w-8 h-8 rounded-full bg-gray-400 opacity-30"></div>
      ) : user ? (
        <Menu as="div" className="relative">
          {({ open }) => (
            <>
              <div className="h-full flex items-center">
                <Menu.Button>
                  <UserCircleIcon className="w-11 h-11" />
                </Menu.Button>
              </div>
              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="origin-top-right z-40 absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y overflow-clip"
                >
                  <div className="w-full">
                    <Menu.Item>
                      <Link
                        href="/account"
                        className="block px-4 py-2 w-full text-right text-gray-700 hover:text-white hover:bg-violet-600"
                      >
                        账户
                      </Link>
                    </Menu.Item>
                  </div>
                  <div className="w-full">
                    <Menu.Item>
                      <button
                        className="block px-4 py-2 w-full text-right text-gray-700 hover:text-white hover:bg-violet-600"
                        onClick={logout}
                      >
                        退出
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      ) : (
        <button onClick={() => setAuthPanelOpen(true)} className="w-11">
          登录
        </button>
      )}
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
