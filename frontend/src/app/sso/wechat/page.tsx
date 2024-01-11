"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ssoByWechatCode } from "@/utils/auth";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function WxLoginCallbackPage() {
  const params = useSearchParams();
  const code = params.get("code");
  const state = params.get("state");

  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    const sso = async () => {
      try {
        if (!code) {
          toast.error("微信登录授权码错误");
          return;
        }

        if (state !== localStorage.getItem("ssoWechatState")) {
          toast.error("微信登录状态码错误");
          return;
        }

        const data = await ssoByWechatCode(code);

        if (data) {
          toast.success("微信授权登录成功");
          queryClient.invalidateQueries({
            queryKey: ["whoami"],
          });
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : (err as string));
      }
    };

    const ssoAndRedirect = async () => {
      await sso();
      router.push("/");
    };

    ssoAndRedirect();
  }, []);

  return <div className="min-h-screen"></div>;
}
