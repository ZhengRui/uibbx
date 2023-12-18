"use client";

import React, { useState } from "react";
import Link from "next/link";

const BundlesPublished = () => <div>已发布的素材墙</div>;

const BundlesBookmarked = () => <div>已收藏的素材墙</div>;

const Bundle = () => {
  const tabs = ["已发布", "已收藏"];

  const [currentTab, setCurrentTab] = useState("已发布");

  return (
    <>
      <div className="relative border-b border-gray-200 pb-5 sm:pb-0">
        <div className="md:flex md:items-center md:justify-between">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            素材
          </h2>
          <div className="mt-3 flex md:absolute md:right-0 md:top-3 md:mt-0">
            <Link
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 "
              href="/bundle/new"
            >
              发布
            </Link>
          </div>
        </div>
        <div className="mt-4">
          <div className="sm:hidden">
            <label htmlFor="current-tab" className="sr-only">
              Select a tab
            </label>
            <select
              id="current-tab"
              name="current-tab"
              className="block w-full rounded-md border-r-[10px] py-2 pl-3 pr-10 border-transparent outline outline-1 outline-gray-300"
              value={currentTab}
              onChange={(e) => setCurrentTab(e.target.value)}
            >
              {tabs.map((tab) => (
                <option key={tab} value={tab}>
                  {tab}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <span
                  key={tab}
                  className={`${
                    tab === currentTab
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }
                  whitespace-nowrap border-b-2 pr-1 pb-4 text-sm font-medium cursor-pointer`}
                  aria-current={tab === currentTab ? "page" : undefined}
                  onClick={() => setCurrentTab(tab)}
                >
                  {tab}
                </span>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="mt-8">
        {currentTab === "已发布" ? <BundlesPublished /> : <BundlesBookmarked />}
      </div>
    </>
  );
};

export default Bundle;
