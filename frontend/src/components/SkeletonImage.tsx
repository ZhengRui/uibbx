import { useState } from "react";
import Image from "next/image";

export const SkeletonedImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <div className="w-full h-full animate-pulse bg-[#404040] bg-opacity-50"></div>
      )}
      <Image
        src={src}
        alt={alt}
        fill={true}
        className={`${
          isLoading ? "hidden" : "block"
        } object-cover cursor-pointer`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
};
