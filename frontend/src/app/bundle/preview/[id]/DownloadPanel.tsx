"use client";

import { Transition, Popover } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useAtom } from "jotai";
import { downloadPanelOpenAtom } from "@/atoms";
import { WechatPayIcon, AliPayIcon, CoinIcon } from "@/components/icons";
import Link from "next/link";
import { BundleIF } from "@/interfaces";
import { useSubscriptionOptions } from "@/hooks/useSubscription";

const DownloadPanel = ({ bundle }: { bundle: BundleIF }) => {
  const [open, setOpen] = useAtom(downloadPanelOpenAtom);

  const [option, setOption] = useState<"wechat" | "alipay" | "coin">("wechat");
  const [tab, setTab] = useState<"purchase" | "subscription">("purchase");

  const { isPending, data: subcriptionOptions } = useSubscriptionOptions();

  if (isPending) return null;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Popover className="fixed inset-0 z-40 overflow-y-auto">
        <div className="flex justify-center items-center h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-50"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Popover.Overlay
              className="fixed inset-0 bg-[#1e1e1e] bg-opacity-50 transition-opacity backdrop-blur-sm"
              onClick={() => {
                setOpen(false);
              }}
            />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-50"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Popover.Panel className="mx-5 lg:mx-10 bg-white flex justify-center items-center rounded-3xl overflow-clip">
              <div className="h-[540px] w-[960px] py-16 text-gray-600 md:hidden">
                <div className="w-full h-full relative flex flex-col items-center px-2 2xs:px-4 xs:px-8">
                  <div className="w-full grid grid-cols-2 border-b">
                    <div
                      className={`pb-4 cursor-pointer ${
                        tab === "purchase" ? "border-b-2 border-indigo-600" : ""
                      }`}
                      onClick={() => setTab("purchase")}
                    >
                      <div className="flex justify-start xs:justify-center items-end relative 2xs:mr-8 h-8">
                        <span className="font-semibold text-xs 3xs:text-sm 2xs:text-base xs:text-xl sm:text-2xl">
                          一次性购买
                        </span>
                        <span className="absolute right-0 2xs:-right-8 xs:-right-4 sm:right-0 text-[10px] 3xs:text-xs 2xs:text-sm xs:text-base sm:text-lg">{`￥${bundle.purchase_price}`}</span>
                      </div>
                    </div>

                    <div
                      className={`pb-4 cursor-pointer ${
                        tab === "subscription"
                          ? "border-b-2 border-indigo-600 "
                          : ""
                      }`}
                      onClick={() => setTab("subscription")}
                    >
                      <div className="flex justify-end xs:justify-center items-end relative 2xs:ml-8 h-8">
                        <span className="font-semibold text-xs 3xs:text-sm 2xs:text-base xs:text-xl sm:text-2xl">
                          升级成为VIP
                        </span>
                      </div>
                    </div>
                  </div>

                  {tab === "purchase" ? (
                    <div className="max-w-[320px] h-full flex flex-col justify-between items-center mt-4">
                      <div className="w-full flex justify-end items-center space-x-1 2xs:space-x-2">
                        <div
                          className={`flex justify-center items-center space-x-1 lg:space-x-2 cursor-pointer border ${
                            option === "wechat"
                              ? "border-[#00c800] text-[#00c800]"
                              : ""
                          } rounded-lg px-2 lg:px-3 py-1.5`}
                          onClick={() => setOption("wechat")}
                        >
                          <WechatPayIcon className="w-4 h-4 lg:w-5 lg:h-5 text-[#00c800] hidden 3xs:block" />
                          <span className="text-[10px] xs:text-xs">
                            微信支付
                          </span>
                        </div>

                        <div
                          className={`flex justify-center items-center space-x-1 lg:space-x-2 cursor-pointer border ${
                            option === "alipay"
                              ? "border-[#1678ff] text-[#1678ff]"
                              : ""
                          } rounded-lg px-2 lg:px-3 py-1.5`}
                          onClick={() => setOption("alipay")}
                        >
                          <AliPayIcon className="w-4 h-4 lg:w-5 lg:h-5 text-[#1678ff] hidden 3xs:block" />
                          <span className="text-[10px] xs:text-xs">
                            支付宝支付
                          </span>
                        </div>

                        <div
                          className={`flex justify-center items-center space-x-1 lg:space-x-2 cursor-pointer border ${
                            option === "coin"
                              ? "border-amber-500 text-amber-500"
                              : ""
                          } rounded-lg px-2 lg:px-3 py-1.5`}
                          onClick={() => setOption("coin")}
                        >
                          <CoinIcon className="w-4 h-4 lg:w-5 lg:h-5 text-amber-500 hidden 3xs:block" />
                          <span className="text-[10px] xs:text-xs">
                            下载分支付
                          </span>
                        </div>
                      </div>

                      <span>qr code</span>

                      <span className="w-full text-right text-xs xs:text-sm underline underline-offset-4 decoration-gray-400 cursor-pointer hover:decoration-indigo-600 hover:text-indigo-600">
                        已完成支付
                      </span>
                    </div>
                  ) : tab === "subscription" ? (
                    <div className="max-w-[320px] h-full flex flex-col justify-between items-center mt-4">
                      <span className="text-xs xs:text-sm pt-1.5">
                        立即解锁下载权益，超5000个素材任意下载
                      </span>

                      <div className="flex flex-col justify-start items-center text-base 2xs:text-lg xs:text-xl h-full pt-6">
                        <div className=" text-amber-950 font-serif">
                          {subcriptionOptions![0].title}，每天下载{" "}
                          {
                            <span className="text-2xl 2xs:text-3xl xs:text-4xl">
                              {subcriptionOptions![0].features[0].slice(5, -1)}
                            </span>
                          }{" "}
                          次
                        </div>
                        <div className="mt-4 text-amber-700 font-serif">
                          {subcriptionOptions![1].title}，每天下载{" "}
                          {
                            <span className="text-3xl 2xs:text-4xl xs:text-5xl">
                              {subcriptionOptions![1].features[0].slice(5, -1)}
                            </span>
                          }{" "}
                          次
                        </div>
                        <div className="mt-4 text-amber-300 font-serif">
                          {subcriptionOptions![2].title}，每天下载{" "}
                          {
                            <span className="text-4xl 2xs:text-5xl xs:text-7xl">
                              {subcriptionOptions![2].features[0].slice(5, -1)}
                            </span>
                          }{" "}
                          次
                        </div>
                      </div>

                      <div className="w-full flex justify-end">
                        <Link
                          className="font-bold rounded-full bg-violet-600 px-6 py-2.5 xs:px-7 xs:py-3 text-white text-xs xs:text-sm cursor-pointer"
                          href="/subscription"
                          onClick={() => setOpen(false)}
                        >
                          升级VIP
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="hidden md:grid grid-cols-2 divide-x h-[540px] w-[960px] py-16 text-gray-600">
                <div className="px-8 lg:px-16 flex flex-col justify-between items-center">
                  <div className="w-full relative flex flex-col items-center space-y-8">
                    <div className="w-full flex justify-center items-end">
                      <span className="font-semibold text-2xl">一次性购买</span>
                      <span className="absolute right-0 text-lg">{`￥${bundle.purchase_price}`}</span>
                    </div>
                    <div className="w-full flex justify-end items-center space-x-2">
                      <div
                        className={`flex justify-center items-center space-x-1 lg:space-x-2 cursor-pointer border ${
                          option === "wechat"
                            ? "border-[#00c800] text-[#00c800]"
                            : ""
                        } rounded-lg px-2 lg:px-3 py-1.5`}
                        onClick={() => setOption("wechat")}
                      >
                        <WechatPayIcon className="w-4 h-4 lg:w-5 lg:h-5 text-[#00c800]" />
                        <span className="text-xs">微信支付</span>
                      </div>

                      <div
                        className={`flex justify-center items-center space-x-1 lg:space-x-2 cursor-pointer border ${
                          option === "alipay"
                            ? "border-[#1678ff] text-[#1678ff]"
                            : ""
                        } rounded-lg px-2 lg:px-3 py-1.5`}
                        onClick={() => setOption("alipay")}
                      >
                        <AliPayIcon className="w-4 h-4 lg:w-5 lg:h-5 text-[#1678ff]" />
                        <span className="text-xs">支付宝支付</span>
                      </div>

                      <div
                        className={`flex justify-center items-center space-x-1 lg:space-x-2 cursor-pointer border ${
                          option === "coin"
                            ? "border-amber-500 text-amber-500"
                            : ""
                        } rounded-lg px-2 lg:px-3 py-1.5`}
                        onClick={() => setOption("coin")}
                      >
                        <CoinIcon className="w-4 h-4 lg:w-5 lg:h-5 text-amber-500" />
                        <span className="text-xs">下载分支付</span>
                      </div>
                    </div>
                  </div>
                  <span>qr code</span>

                  <span className="w-full text-right text-sm underline underline-offset-4 decoration-gray-400 cursor-pointer hover:decoration-indigo-600 hover:text-indigo-600">
                    已完成支付
                  </span>
                </div>
                <div className="px-8 lg:px-16 flex flex-col justify-between items-center">
                  <div className="w-full flex flex-col items-center space-y-8">
                    <span className="font-semibold text-2xl">升级成为VIP</span>
                    <span className="text-xs xs:text-sm pt-1.5">
                      立即解锁下载权益，超5000个素材任意下载
                    </span>
                  </div>

                  <div className="flex flex-col justify-start items-center text-xl h-full pt-6">
                    <div className=" text-amber-950 font-serif text-xl">
                      {subcriptionOptions![0].title}，每天下载{" "}
                      {
                        <span className="text-4xl">
                          {subcriptionOptions![0].features[0].slice(5, -1)}
                        </span>
                      }{" "}
                      次
                    </div>
                    <div className="mt-4 text-amber-700 font-serif">
                      {subcriptionOptions![1].title}，每天下载{" "}
                      {
                        <span className="text-5xl">
                          {subcriptionOptions![1].features[0].slice(5, -1)}
                        </span>
                      }{" "}
                      次
                    </div>
                    <div className="mt-4 text-amber-300 font-serif">
                      {subcriptionOptions![2].title}，每天下载{" "}
                      {
                        <span className="text-7xl">
                          {subcriptionOptions![2].features[0].slice(5, -1)}
                        </span>
                      }{" "}
                      次
                    </div>
                  </div>

                  <div className="w-full flex justify-end">
                    <Link
                      className="font-bold rounded-full bg-violet-600 px-7 py-3 text-white text-sm cursor-pointer"
                      href="/subscription"
                      onClick={() => setOpen(false)}
                    >
                      升级VIP
                    </Link>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition.Child>
        </div>
      </Popover>
    </Transition.Root>
  );
};

export default DownloadPanel;
