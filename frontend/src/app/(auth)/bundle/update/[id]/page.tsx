"use client";

import { UpdateBundleForm } from "../../BundleForm";
import { useBundle } from "@/hooks/useBundle";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserIF } from "@/interfaces";

export default function BundleUpdatePage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const user = queryClient.getQueryData<UserIF>(["whoami"]);

  const { isPending, data: bundle } = useBundle(id);

  useEffect(() => {
    if (!isPending && user && bundle && user.uid !== bundle.creator_uid)
      router.push("/");
  }, [isPending, user, bundle, router]);

  return (
    <>
      {isPending ||
      !user ||
      !bundle ||
      user.uid !== bundle.creator_uid ? null : (
        <div className="w-full max-w-2xl">
          <UpdateBundleForm init={bundle} />
        </div>
      )}
    </>
  );
}
