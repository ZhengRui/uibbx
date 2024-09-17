import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";

import { useRef } from "react";

export type PaginationProps = {
  pos: number;
  step: number;
  total: number;
  setPos: Function;
};

export const Pagination = ({ pos, step, total, setPos }: PaginationProps) => {
  const curPage = Math.floor(pos / step) + 1;
  const totPages = Math.floor((total - 1) / step) + 1 || 1;

  const pageInputRef = useRef<HTMLInputElement>(null);

  const toPrevPage = () => setPos(Math.max(pos - step, 0));
  const toNextPage = () => setPos(Math.min(pos + step, step * (totPages - 1)));
  const toFstPage = () => setPos(0);
  const toLstPage = () => setPos(step * (totPages - 1));
  const toPage = (n: number) => {
    const newPos = step * (Math.max(1, Math.min(n, totPages)) - 1);
    setPos(newPos);
    if (pageInputRef.current)
      pageInputRef.current.value = (Math.floor(newPos / step) + 1).toString();
  };

  const toPageInputHandler = (evt: React.BaseSyntheticEvent) => {
    const v = parseInt(evt.target.value);
    if (isNaN(v)) return;
    toPage(v);
  };

  return (
    <div className="flex justify-center py-1 w-full">
      <div className="flex justify-between w-full @container">
        <div className="hidden flex-1 @3xl:inline-flex justify-start items-center pl-2 @3xl:pl-4">
          <div className="text-gray-400 text-xs @3xl:text-sm">
            {total
              ? `第 ${pos + 1} - ${Math.min(pos + step, total)} / ${total} 项`
              : "无数据"}
          </div>
        </div>

        <div className="flex justify-center space-x-1 @3xl:space-x-2 items-center pl-2 @3xl:pl-0">
          <div className="flex text-gray-500">
            <div
              onClick={toFstPage}
              className={`h-6 w-6 @sm:h-7 @sm:w-7 @3xl:h-8 @3xl:w-8 rounded-sm @sm:rounded-full mr-1 flex justify-center items-center bg-gray-200 cursor-pointer ${
                curPage === 1
                  ? "text-gray-400"
                  : "hover:bg-indigo-600 hover:text-gray-100"
              }`}
            >
              <ChevronDoubleLeftIcon className="h-3 w-3 @3xl:h-4 @3xl:w-4" />
            </div>
            <div
              onClick={toPrevPage}
              className={`
                  'h-6 w-6 @sm:h-7 @sm:w-7 @3xl:h-8 @3xl:w-8 rounded-sm @sm:rounded-full flex justify-center items-center bg-gray-200 cursor-pointer ${
                    curPage === 1
                      ? "text-gray-400"
                      : "hover:bg-indigo-600 hover:text-gray-100"
                  }`}
            >
              <ChevronLeftIcon className="h-3 w-3 @3xl:h-4 @3xl:w-4" />
            </div>
          </div>

          <input
            key={curPage}
            defaultValue={curPage}
            readOnly
            className="flex justify-center h-6 w-6 @sm:h-7 @sm:w-7 @3xl:h-8 @3xl:w-8 rounded-sm @sm:rounded-full text-center bg-indigo-600 text-gray-100 text-xs focus:outline-none"
          />

          <div className="flex text-gray-500">
            <div
              onClick={toNextPage}
              className={`h-6 w-6 @sm:h-7 @sm:w-7 @3xl:h-8 @3xl:w-8 rounded-sm @sm:rounded-full mr-1 flex justify-center items-center bg-gray-200 cursor-pointer ${
                curPage === totPages
                  ? "text-gray-400"
                  : "hover:bg-indigo-600 hover:text-gray-100"
              }`}
            >
              <ChevronRightIcon className="h-3 w-3 @3xl:h-4 @3xl:w-4" />
            </div>
            <div
              onClick={toLstPage}
              className={`h-6 w-6 @sm:h-7 @sm:w-7 @3xl:h-8 @3xl:w-8 rounded-sm @sm:rounded-full flex justify-center items-center bg-gray-200 cursor-pointer ${
                curPage === totPages
                  ? "text-gray-400"
                  : "hover:bg-indigo-600 hover:text-gray-100"
              }`}
            >
              <ChevronDoubleRightIcon className="h-3 w-3 @3xl:h-4 @3xl:w-4" />
            </div>
          </div>
        </div>

        <div className="inline-flex flex-1 justify-end space-x-2 items-center pr-2 @3xl:pr-4">
          <div className="text-gray-400 items-center hidden @sm:flex text-xs @3xl:text-sm">
            第
            <input
              ref={pageInputRef}
              key={curPage}
              defaultValue={curPage}
              onBlur={toPageInputHandler}
              onKeyPress={(evt: React.KeyboardEvent) => {
                evt.key === "Enter" ? toPageInputHandler(evt) : null;
              }}
              className="mx-1.5 w-8 h-6 @3xl:w-10 @3xl:h-8 rounded-lg text-center"
            />
            / {totPages} 页
          </div>
          <div className="text-gray-400 items-center @sm:hidden text-xs">
            页
            <input
              ref={pageInputRef}
              key={curPage}
              defaultValue={curPage}
              onBlur={toPageInputHandler}
              onKeyPress={(evt: React.KeyboardEvent) => {
                evt.key === "Enter" ? toPageInputHandler(evt) : null;
              }}
              className="mx-0.5 @xs:mx-1.5 w-6 h-6 rounded-sm text-center"
            />
            / {totPages}
          </div>
        </div>
      </div>
    </div>
  );
};
