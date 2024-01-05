"use client";

import { useBundlesLiked } from "@/hooks/useBundle";
import BundleCard from "./Card";

const Carousel = () => {
  const { isPending, data: bundles } = useBundlesLiked(0, 20, true);

  if (isPending) return null;

  return (
    <div className="w-full flex justify-start items-center @container">
      <div className="w-full grid grid-cols-1 @[768px]:grid-cols-2 @[1096px]:grid-cols-3 gap-x-4 gap-y-6">
        {bundles?.map((bundle, i) => (
          <div key={bundle.id} className="w-full">
            <BundleCard bundle={bundle} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
