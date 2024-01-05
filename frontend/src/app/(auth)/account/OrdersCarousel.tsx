"use client";

import { useState } from "react";
import { useBundlesPurchased } from "@/hooks/useBundle";
import { useSubscriptions } from "@/hooks/useSubscription";
import { CardOfPurchase } from "./Card";
import { convertDateString } from "./RefersTable";
import {
  SubscriptionLevel1Icon,
  SubscriptionLevel2Icon,
  SubscriptionLevel3Icon,
} from "@/components/icons";

const Carousel = () => {
  const [tab, setTab] = useState<string>("subscriptions");

  const {
    isPending: isPurchasesLoading,
    isFetching: isPurchasesFetching,
    data: bundles,
  } = useBundlesPurchased(0, 20);
  const {
    isPending: isSubscriptionsLoading,
    isFetching: isSubscriptionsFetching,
    data: subscriptions,
  } = useSubscriptions(0, 20);

  if (
    isPurchasesLoading ||
    isPurchasesFetching ||
    isSubscriptionsLoading ||
    isSubscriptionsFetching
  )
    return null;

  return (
    <div className="w-full flex flex-col justify-start items-center @container">
      <div className="w-full flex justify-begin items-center text-xs 2xs:text-sm">
        <span
          className={`cursor-pointer rounded-full px-2.5 py-1 2xs:px-4 2xs:py-1.5 ${
            tab === "subscriptions"
              ? "bg-gray-700 text-gray-200"
              : "text-gray-700"
          }`}
          onClick={() => setTab("subscriptions")}
        >
          充值记录
        </span>
        <span
          className={`ml-4 cursor-pointer rounded-full px-2.5 py-1 2xs:px-4 2xs:py-1.5 ${
            tab === "purchases" ? "bg-gray-700 text-gray-200" : "text-gray-700"
          }`}
          onClick={() => setTab("purchases")}
        >
          购买记录
        </span>
      </div>
      {tab === "purchases" && (
        <div className="mt-6 w-full grid grid-cols-1 @[768px]:grid-cols-2 @[1096px]:grid-cols-3 gap-x-4 gap-y-6">
          {bundles?.map((bundle, i) => (
            <div key={bundle.id} className="w-full">
              <CardOfPurchase bundle={bundle} />
            </div>
          ))}
        </div>
      )}
      {tab === "subscriptions" && (
        <>
          {subscriptions && subscriptions.length > 0 ? (
            <div className="w-full mt-6 space-y-8 min-h-[640px]">
              {subscriptions.map((subscription, i) => (
                <div
                  key={i}
                  className="text-sm w-full px-2 py-2 @[256px]:px-4 @sm:px-6 @[256px]:py-4 flex justify-between items-center border border-gray-300 rounded-lg"
                >
                  <div className="flex justify-start items-center space-x-3 @[540px]:w-1/2">
                    <div className="relative w-8 h-8 @[256px]:w-12 @[256px]:h-12 rounded-full overflow-clip flex justify-center items-center">
                      {subscription.after === "个人计划" ? (
                        <SubscriptionLevel1Icon className="w-full h-full" />
                      ) : subscription.after === "专业计划" ? (
                        <SubscriptionLevel2Icon className="w-full h-full" />
                      ) : (
                        <SubscriptionLevel3Icon className="w-full h-full" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center items-start space-y-1">
                      <span className="text-gray-700 text-xs @sm:text-sm @2xl:text-base ">{`${
                        subscription.before === "无"
                          ? "订阅："
                          : "升级：" + subscription.before + " -> "
                      } ${subscription.after}`}</span>
                      <span className="text-gray-700 text-xs @[320px]:hidden">
                        {`购买价格：¥ ${subscription.amount.toFixed(1)}`}
                      </span>
                      <span className="text-gray-400 text-xs font-mono">
                        {`购买时间：${
                          convertDateString(subscription.subscribed_at).split(
                            " "
                          )[0]
                        }`}
                      </span>
                      <span className="text-gray-700 text-xs font-mono @[540px]:hidden">
                        {`到期时间：${
                          convertDateString(subscription.next_billing_at).split(
                            " "
                          )[0]
                        }`}
                      </span>
                    </div>
                  </div>
                  <div className="grow hidden @[320px]:flex justify-end @[540px]:justify-between items-center">
                    <div className="ml-2 text-left text-xs @xl:text-sm hidden @[540px]:block">{`到期时间：${
                      convertDateString(subscription.next_billing_at).split(
                        " "
                      )[0]
                    }`}</div>
                    <div className="ml-4 flex justify-end items-center text-xs @xl:text-sm">
                      <span className="">{`¥ ${subscription.amount.toFixed(
                        1
                      )}`}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full min-h-[640px]">
              <span className="text-2xl text-gray-400">暂无记录</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Carousel;
