"use client";

import { SpinningIcon } from "@/components/icons";
import { download } from "@/utils/download";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function BundleDownloadPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      try {
        const bundleUrl = await download(id);
        router.push(bundleUrl);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : (err as string));
        router.push("/");
      }
    };

    redirect();
  }, []);

  return (
    <SpinningIcon className="w-6 h-6 animate-spin text-gray-200 fill-purple-600" />
  );
}
