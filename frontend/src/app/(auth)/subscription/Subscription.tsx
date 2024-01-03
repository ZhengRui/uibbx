"use client";

import { useSubscriptionOptions } from "@/hooks/useSubscription";
import { SubscriptionOptionIF } from "@/interfaces";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const VIPCard = ({ option }: { option: SubscriptionOptionIF }) => {
  const upgradable =
    option.subscribe_price !== 0 && option.subscribe_price !== option.price;

  return (
    <div
      className={`relative w-full min-w-[280px] max-w-xs h-[460px] flex flex-col justify-start items-center ${
        option.subscribed ? "bg-violet-600 text-white" : "bg-white"
      } rounded-3xl pt-8 px-8`}
    >
      <div className="w-full flex flex-col justify-between items-start">
        <div className="flex justify-start items-center">
          <span className="text-2xl">{option.title}</span>
          {option.subscribed && (
            <CheckCircleIcon className="ml-3 w-6 h-6 inline-block text-white" />
          )}
        </div>
        <span className="mt-4 text-xs">{option.subtitle}</span>
      </div>

      <div className="mt-4 w-full flex justify-between items-center">
        {upgradable && (
          <div className="flex flex-col justify-between items-start">
            <span className="text-xs tracking-wider">现时升级价</span>
            <span className="text-2xl font-semibold">
              ￥{option.subscribe_price}
            </span>
          </div>
        )}
        <div className="flex flex-col justify-between items-start">
          <span className="text-xs tracking-wider">{option.subsubtitle}</span>
          <span
            className={`${
              upgradable ? "line-through text-gray-400" : ""
            }  text-2xl font-semibold`}
          >
            ￥{option.price}
          </span>
        </div>
      </div>

      <div className="mt-8 w-full flex flex-col space-y-4 justify-start items-start">
        {option.features.map((feature, i: number) => (
          <div
            key={i}
            className="text-xs flex justify-start items-center space-x-2"
          >
            <CheckCircleIcon className="w-4 h-4 inline-block text-[#a3dc2f]" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 px-8 w-full">
        <button
          className={`w-full rounded-full py-2 ${
            option.subscriptable
              ? option.subscribed
                ? "bg-white text-black"
                : "border border-gray-700 hover:bg-violet-600 hover:text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          立即
          {upgradable ? "升级" : "订阅"}
        </button>
      </div>
    </div>
  );
};

const Subscription = () => {
  const { isPending, data: options } = useSubscriptionOptions();

  if (isPending) return null;

  return (
    <div className="w-full text-gray-800">
      <div className="w-full flex flex-col justify-center items-center text-5xl space-y-4">
        <span>成为VIP</span>
        <span>解锁本站所有素材下载权限</span>
      </div>
      <div className="w-full mt-16 flex justify-center items-center space-x-4">
        {options?.map((option, i: number) => (
          <div key={i}>
            <VIPCard option={option} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscription;
