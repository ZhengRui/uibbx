"use client";

import { useBundlesPublic } from "@/hooks/useBundle";
import { useAuth } from "@/hooks/useAuth";
import BundleCard from "./Card";
import AuthedBundleCard from "@/app/(auth)/account/Card";

const Carousel = () => {
  const { isPending: isPendingBundles, data: bundles } = useBundlesPublic(
    0,
    20
  );
  const { isPending: isPendingAuth, data: user } = useAuth();

  return (
    <div className="w-full mx-auto max-w-7xl px-8 lg:px-12 xl:px-16 @container">
      <div className="mt-6 w-full grid grid-cols-1 @[768px]:grid-cols-2 @[1096px]:grid-cols-3 gap-x-4 gap-y-6">
        {isPendingAuth || isPendingBundles
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-72 animate-pulse bg-[#404040] rounded-2xl overflow-clip bg-opacity-50"
              ></div>
            ))
          : bundles?.map((bundle, i) => (
              <div key={bundle.id} className="w-full">
                {user ? (
                  <AuthedBundleCard bundle={bundle} />
                ) : (
                  <BundleCard bundle={bundle} />
                )}
              </div>
            ))}
      </div>
    </div>
  );
};

export default Carousel;
