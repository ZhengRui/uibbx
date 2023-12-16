import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Title = () => (
  <div className="flex flex-col justify-center items-center space-y-6">
    <div className="flex flex-col justify-center items-center space-y-3 font-medium text-6xl">
      <span>不只是素材，更是创意的启航点</span>
      <span>欢迎来到UI百宝箱</span>
    </div>
    <span className="text-gray-400">
      发现专属于您的设计灵感和资源，让每个设计都成为杰作
    </span>
  </div>
);

const Search = () => (
  <div className="rounded-full border-[1.2px] border-[#d8e1f1] px-5 py-4 w-1/2 flex justify-start items-center space-x-2 text-gray-400">
    <MagnifyingGlassIcon className="w-[18px] h-[18px] stroke-1" />
    <span className="text-lg">搜索1000多种设计素材</span>
  </div>
);

const Tag = ({ label }: { label: string }) => (
  <span className="rounded-full border-[1.2px] border-[#d8e1f1] px-4 py-2 text-gray-700">
    {label}
  </span>
);

const HotSearch = () => (
  <div className="flex justify-between items-center space-x-4">
    <span className="text-xs">热门搜索</span>
    {[
      "登录页面",
      "IOS",
      "商城设计",
      "食物",
      "用户体验设计",
      "应用程序设计",
    ].map((tag, i) => (
      <Tag key={i} label={tag} />
    ))}
  </div>
);

const AssetCard = ({
  title,
  price,
  thumbnail,
}: {
  title: string;
  price: number;
  thumbnail: string;
}) => (
  <div className="flex flex-col justify-between items-center space-y-2 py-2">
    <div className="w-full h-64 bg-gray-300 rounded-lg"></div>
    <div className="w-full flex justify-between items-center text-sm px-2">
      <span>{title}</span>
      <span>¥ {price}</span>
    </div>
  </div>
);

const AssertWall = () => (
  <div className="grid grid-cols-4 gap-4 w-full max-w-7xl mx-auto">
    {Array.from({ length: 12 }, (_, i) => (
      <AssetCard
        key={i}
        title="Door Hub - 家庭服务应用 Flutter UI"
        price={20}
        thumbnail=""
      />
    ))}
  </div>
);

const ViewMore = () => (
  <button
    type="button"
    className="rounded-full bg-violet-600 px-9 py-3 text-white"
  >
    查看更多
  </button>
);

const Landing = () => (
  <div className="w-full flex flex-col justify-center items-center py-36 space-y-12 bg-[#f2f7ff]">
    <Title />
    <Search />
    <HotSearch />
    <AssertWall />
    <ViewMore />
  </div>
);

export default Landing;
