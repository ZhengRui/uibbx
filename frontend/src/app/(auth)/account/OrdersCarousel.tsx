"use client";

import { useState } from "react";

const Carousel = () => {
  const [tab, setTab] = useState<string>("orders");

  return (
    <div className="w-full flex flex-col justify-start items-center">
      <div className="w-full pl-4 flex justify-begin items-center text-sm">
        <span
          className={`cursor-pointer rounded-full px-4 py-1.5 ${
            tab === "orders" ? "bg-gray-700 text-gray-200" : "text-gray-700"
          }`}
          onClick={() => setTab("orders")}
        >
          充值记录
        </span>
        <span
          className={`ml-4 cursor-pointer rounded-full px-4 py-1.5 ${
            tab === "purchases" ? "bg-gray-700 text-gray-200" : "text-gray-700"
          }`}
          onClick={() => setTab("purchases")}
        >
          购买记录
        </span>
      </div>
      <div className="mt-6 w-full pl-4 grid grid-cols-3 gap-x-4 gap-y-6">
        haha
      </div>
    </div>
  );
};

export default Carousel;
