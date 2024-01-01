"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getReferToken } from "@/utils/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ReferPage({ params }: { params: { uid: string } }) {
  const referrerUid = params.uid;
  const searchParams = useSearchParams();
  const bundleId = searchParams.get("bundle");

  const urlDirect = bundleId ? `/bundle/preview/${bundleId}` : "/";
  const router = useRouter();

  useEffect(() => {
    const refer = async () => {
      try {
        const { access_token: referToken } = await getReferToken(
          referrerUid,
          bundleId
        );

        if (referToken) localStorage.setItem("referToken", referToken);
        router.push(urlDirect);
      } catch (err) {
        toast.error("推荐链接无效");
        router.push("/");
      }
    };

    refer();
  }, []);

  return null;
}
