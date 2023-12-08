import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const cates = [
  { name: "UI套件", href: "/ui" },
  { name: "3D素材", href: "/3d" },
  { name: "图标合集", href: "/icons" },
  { name: "原型", href: "/prototypes" },
  { name: "样机", href: "/apps" },
];

const Categories = () => (
  <div className="flex justify-between items-center space-x-8 text-white font-light text-sm">
    {cates.map((cate, i) => (
      <Link key={i} href={cate.href}>
        {cate.name}
      </Link>
    ))}
    <MagnifyingGlassIcon className="w-[18px] h-[18px] stroke-1" />
  </div>
);

const Logo = () => <div></div>;

const User = () => (
  <div className="flex justify-between items-center space-x-8 text-white font-light text-sm">
    <button>登录</button>
    <button
      type="button"
      className="font-bold rounded-full bg-violet-600 px-9 py-3"
    >
      升级VIP
    </button>
  </div>
);

const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full bg-[#01102d]">
      <div className="max-w-screen-2xl mx-auto px-8 lg:px-12 xl:px-16 py-6 flex justify-between items-center">
        <Categories />
        <Logo />
        <User />
      </div>
    </header>
  );
};

export default Header;
