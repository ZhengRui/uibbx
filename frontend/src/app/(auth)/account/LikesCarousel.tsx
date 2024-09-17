"use client";

import { useBundlesLiked, useNumOfBundlesLiked } from "@/hooks/useBundle";
import BundleCard from "./Card";
import { useState } from "react";
import { Pagination } from "@/components/Pagination";

const step = Number(process.env.NEXT_PUBLIC_CAROUSEL_NUM_OF_CARDS);

const Carousel = () => {
  const [pos, setPos] = useState(0);
  const { isPending: isPendingTotal, data: total } = useNumOfBundlesLiked();

  const { isPending: isPendingBundles, data: bundles } = useBundlesLiked(
    pos,
    step,
    true
  );

  if (isPendingTotal || isPendingBundles) return null;

  return (
    <div className="w-full flex flex-col justify-start items-center @container">
      {total! > step && (
        <div className="mb-3 py-3 w-full bg-indigo-50 rounded-2xl overflow-clip">
          <Pagination pos={pos} step={step} total={total!} setPos={setPos} />
        </div>
      )}

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
