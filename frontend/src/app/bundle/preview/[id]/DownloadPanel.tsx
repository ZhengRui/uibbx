"use client";

import { Transition, Popover } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { useAtom } from "jotai";
import { downloadPanelOpenAtom } from "@/atoms";
import { WechatPayIcon, AliPayIcon } from "@/components/icons";
import Link from "next/link";

const DownloadPanel = () => {
  const [open, setOpen] = useAtom(downloadPanelOpenAtom);

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
            <Popover.Panel className="bg-white flex justify-center items-center rounded-3xl overflow-clip">
              <div className="grid grid-cols-2 divide-x h-[540px] w-[960px] py-16 text-gray-600">
                <div className="px-20 flex flex-col justify-between items-center">
                  <div className="w-full flex flex-col items-center space-y-8">
                    <span className="font-semibold text-2xl ">一次性购买</span>
                    <div className="w-full flex justify-between items-center">
                      <div className="flex justify-start items-center space-x-2">
                        <div className="flex justify-center items-center space-x-2 border border-[#00c800] rounded-lg px-3 py-1.5">
                          <WechatPayIcon className="w-5 h-5 text-[#00c800]" />
                          <span className="text-xs">微信支付</span>
                        </div>
                        <div className="flex justify-center items-center space-x-2 border rounded-lg px-3 py-1.5">
                          <AliPayIcon className="w-5 h-5 text-[#1678ff]" />
                          <span className="text-xs">支付宝支付</span>
                        </div>
                      </div>
                      <span className="text-sm">￥99</span>
                    </div>
                  </div>
                  <span>qr code</span>
                  <span className="w-full text-right text-sm underline underline-offset-4 decoration-gray-400 cursor-pointer hover:decoration-indigo-600 hover:text-indigo-600">
                    已完成支付
                  </span>
                </div>
                <div className="px-20 flex flex-col justify-between items-center">
                  <div className="w-full flex flex-col items-center space-y-8">
                    <span className="font-semibold text-xl">升级成为VIP</span>
                    <span className="text-sm pt-1.5">
                      立即解锁下载权益，超5000个素材任意下载
                    </span>
                  </div>

                  <div className="flex flex-col justify-between items-center">
                    <span>包月，每天下载10次</span>
                    <span>包季，每天下载20次</span>
                    <span>终极，每天下载30次</span>
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
