"use client";

import {
  useBundlesPublished,
  useNumOfBundlesPublished,
} from "@/hooks/useBundle";
import BundleCard from "./Card";
import Link from "next/link";
import { ImageGalleryPlusIcon } from "@/components/icons";

import { useState } from "react";
import { Pagination } from "@/components/Pagination";

const step = Number(process.env.NEXT_PUBLIC_CAROUSEL_NUM_OF_CARDS);

const Carousel = () => {
  const [pos, setPos] = useState(0);

  const { isPending: isPendingTotal, data: total } = useNumOfBundlesPublished();

  const { isPending: isPendingBundles, data: bundles } = useBundlesPublished(
    pos,
    step
  );

  if (isPendingTotal || isPendingBundles) return null;

  return (
    <div className="w-full flex flex-col justify-start items-center @container">
      <div className="w-full flex justify-between items-center">
        <div className="text-xs 2xs:text-sm">
          <span className="bg-gray-700 text-gray-200 rounded-full px-2.5 py-1 2xs:px-4 2xs:py-1.5">
            项目
          </span>
          <span className="ml-4 text-gray-700">草稿</span>
        </div>
        <Link
          className="text-xs 2xs:text-sm bg-white text-gray-700 px-2.5 py-1 2xs:px-4 2xs:py-1.5 rounded-full"
          href="/bundle/new"
        >
          <ImageGalleryPlusIcon className="w-4 h-4 inline-block mr-1" />
          添加项目
        </Link>
      </div>

      {total! > step && (
        <div className="mt-6 py-3 w-full bg-indigo-50 rounded-2xl overflow-clip">
          <Pagination pos={pos} step={step} total={total!} setPos={setPos} />
        </div>
      )}

      <div className="mt-6 w-full grid grid-cols-1 @[768px]:grid-cols-2 @[1096px]:grid-cols-3 gap-x-4 gap-y-6">
        {bundles?.map((bundle, i) => (
          <div key={bundle.id} className="w-full">
            <BundleCard bundle={bundle} editDisabled={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
