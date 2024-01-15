"use client";

import { useAtom } from "jotai";
import { paymentPanelOpenAtom } from "@/atoms";
import { Fragment, useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Transition, Popover } from "@headlessui/react";

import { WechatPayIcon, AliPayIcon, SpinningIcon } from "@/components/icons";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import {
  getSubscriptionQRCode,
  getSubscriptionOrderStatus,
} from "@/utils/subscription";

const PaymentPanel = ({
  title,
  amount,
  tier,
}: {
  title: string;
  amount: number;
  tier: string;
}) => {
  const [open, setOpen] = useAtom(paymentPanelOpenAtom);

  const [option, setOption] = useState<"wechat" | "alipay">("wechat");
  const [qrCodeUrl, setQRCodeUrl] = useState<string | null>(null);

  const intervalIdRef = useRef<number | null>(null);
  const intervalDurationRef = useRef<number>(2000); // Start with 2 seconds
  const intervalCountRef = useRef<number>(0);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (intervalIdRef.current !== null) clearInterval(intervalIdRef.current);
    intervalDurationRef.current = 2000;
    intervalCountRef.current = 0;

    setQRCodeUrl(null);

    if (!open) return;

    const getQRCode = async () => {
      try {
        const order = await getSubscriptionQRCode(tier, option);
        setQRCodeUrl(order.code_url);

        const checkOrderStatusWithExpBackoff = async () => {
          const status = await getSubscriptionOrderStatus(order.id);

          if (status === "succeed") {
            toast.success("支付成功");

            if (intervalIdRef.current !== null)
              clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;

            setOpen(false);
            queryClient.invalidateQueries({
              queryKey: ["subscriptionOptions"],
            });
          } else {
            if (intervalCountRef.current++ >= 45)
              intervalDurationRef.current = Math.floor(
                intervalDurationRef.current * 1.1
              );

            scheduleNextCheck();
          }
        };

        const scheduleNextCheck = () => {
          if (intervalIdRef.current !== null)
            clearInterval(intervalIdRef.current);
          intervalIdRef.current = window.setTimeout(
            checkOrderStatusWithExpBackoff,
            intervalDurationRef.current
          );
        };

        scheduleNextCheck();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : (err as string));
      }
    };

    getQRCode();

    return () => {
      if (intervalIdRef.current !== null) clearInterval(intervalIdRef.current);
    };
  }, [open, option]);

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
              <div className="flex justify-center items-center h-[540px] w-[720px] py-16 text-gray-600">
                <div className="h-full w-full max-w-xl px-8 flex flex-col justify-between items-center">
                  <div className="w-full relative flex flex-col items-center space-y-8 pb-2 border-b">
                    <div className="w-full flex justify-between xs:justify-center items-end">
                      <span className="font-semibold text-lg 3xs:text-xl 2xs:text-2xl sm:text-3xl">
                        {title}
                      </span>
                      <span className="xs:absolute xs:right-0 text-base 3xs:text-lg 2xs:text-xl sm:text-2xl font-semibold">{`￥${amount}`}</span>
                    </div>
                    <div className="w-full flex justify-start items-center space-x-2">
                      <div
                        className={`flex justify-center items-center space-x-1 sm:space-x-2 cursor-pointer border ${
                          option === "wechat"
                            ? "border-[#00c800] text-[#00c800]"
                            : ""
                        } rounded-lg px-2 sm:px-3 py-1.5`}
                        onClick={() => setOption("wechat")}
                      >
                        <WechatPayIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#00c800] hidden 3xs:block" />
                        <span className="text-xs">微信支付</span>
                      </div>

                      <div
                        className={`flex justify-center items-center space-x-1 sm:space-x-2 cursor-pointer border ${
                          option === "alipay"
                            ? "border-[#1678ff] text-[#1678ff]"
                            : ""
                        } rounded-lg px-2 sm:px-3 py-1.5`}
                        onClick={() => setOption("alipay")}
                      >
                        <AliPayIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#1678ff] hidden 3xs:block" />
                        <span className="text-xs">支付宝支付</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-full flex justify-center items-center">
                    {qrCodeUrl ? (
                      qrCodeUrl.startsWith("weixin://") ? (
                        <QRCodeSVG
                          value={qrCodeUrl}
                          size={200}
                          bgColor="#fff"
                          fgColor="#000"
                          level="M"
                          includeMargin={false}
                          imageSettings={{
                            src: "/wechat-pay.svg",
                            x: undefined,
                            y: undefined,
                            height: 42,
                            width: 42,
                            excavate: true,
                          }}
                        />
                      ) : (
                        <iframe
                          className="w-[200px] h-[240px] border-0 translate-y-5"
                          src={qrCodeUrl}
                          style={{ overflow: "hidden" }}
                        ></iframe>
                      )
                    ) : (
                      <SpinningIcon className="w-6 h-6 animate-spin text-gray-200 fill-purple-600" />
                    )}
                  </div>

                  <span className="invisible w-full text-right text-sm underline underline-offset-4 decoration-gray-400 cursor-pointer hover:decoration-indigo-600 hover:text-indigo-600">
                    已完成支付
                  </span>
                </div>
              </div>
            </Popover.Panel>
          </Transition.Child>
        </div>
      </Popover>
    </Transition.Root>
  );
};

export default PaymentPanel;
