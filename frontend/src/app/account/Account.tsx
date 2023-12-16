"use client";

import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import ImageStack from "./ImageStack";

const BundleUploader = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<{ url: string; file: File }[]>([]);

  //   const [bundle, setBundle] = useState<File | null>(null);
  //   const selectBundleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const fs = e.target.files;

  //     if (!fs || fs.length === 0) {
  //       setBundle(null);
  //     } else {
  //       setBundle(fs[0]);
  //     }
  //   };

  const selectImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fs = e.target.files;

    if (!fs || fs.length === 0) {
      setImages([]);
    } else {
      setImages(
        Array.from(fs).map((f) => ({ url: URL.createObjectURL(f), file: f }))
      );
    }
  };

  const appendImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fs = e.target.files;

    if (!fs || fs.length === 0) {
      return;
    }

    setImages((images) => [
      ...images,
      ...Array.from(fs).map((f) => ({ url: URL.createObjectURL(f), file: f })),
    ]);
  };

  return (
    <form className="w-full max-w-2xl">
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          发布设计素材
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label htmlFor="title" className="text-sm font-medium leading-6">
              标题
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="title"
                id="title"
                className="w-full border py-1.5 px-3 rounded-md text-gray-600 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label htmlFor="subtitle" className="text-sm font-medium leading-6">
              子标题 <span className="text-gray-400">(选填)</span>
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="subtitle"
                id="subtitle"
                className="w-full border py-1.5 px-3 rounded-md text-gray-600 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label htmlFor="desc" className="text-sm font-medium leading-6">
              描述 <span className="text-gray-400">(选填)</span>
            </label>
            <div className="mt-2">
              <textarea
                id="desc"
                name="desc"
                rows={3}
                className="w-full rounded-md border py-1.5 px-3 text-gray-600 text-sm focus:outline-none"
                defaultValue={""}
              />
            </div>
          </div>

          <div className="col-span-full">
            <label htmlFor="tags" className="text-sm font-medium leading-6">
              标签 <span className="text-gray-400">(选填)</span>
            </label>
            <div className="mt-2 flex flex-col space-y-2">
              <input
                type="text"
                name="tags"
                id="tags"
                className="w-full border py-1.5 px-3 rounded-md text-gray-600 text-sm focus:outline-none"
                placeholder="例子: 3D, 电影海报, 卡通, figma"
                onChange={(e) => {
                  const value = e.target.value;
                  setTags(
                    value
                      .replaceAll("，", ",")
                      .split(",")
                      .map((t) => t.trim())
                      .filter((t) => t.length > 0)
                  );
                }}
              />
              {tags && (
                <div className="space-x-2">
                  {tags.map((tag, i) => (
                    <span
                      className="border border-indigo-400 rounded-lg py-1 px-2 text-xs text-gray-600"
                      key={i}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="images-label"
              className="text-sm font-medium leading-6"
            >
              预览图片 <span className="text-gray-400">(首张为封面图)</span>
            </label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              {images.length ? (
                <div className="w-full flex flex-col">
                  <div className="pb-5 border-b">
                    <ImageStack images={images} setImages={setImages} />
                  </div>
                  <div className="flex justify-end items-center pt-4 space-x-4">
                    <div>
                      <label
                        htmlFor="images-append"
                        className="cursor-pointer rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                      >
                        <span>继续添加</span>

                        <input
                          id="images-append"
                          name="images-append"
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={appendImageFiles}
                          accept="image/*"
                        />
                      </label>
                    </div>
                    <button
                      className="rounded-md bg-orange-700 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
                      onClick={() => setImages([])}
                    >
                      清空
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-500"
                    >
                      <span>上传预览图</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={selectImageFiles}
                        accept="image/*"
                      />
                    </label>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, JPEG
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-full">
            {/* <label
              htmlFor="bundle-label"
              className="text-sm font-medium leading-6"
            >
              文件包
            </label>
            <div className="mt-2 flex justify-start items-center space-x-6">
              <label
                htmlFor="bundle"
                className="cursor-pointer border border-dashed rounded-lg py-2 px-4 text-sm text-indigo-500"
              >
                <span>上传</span>

                <input
                  id="bundle"
                  name="bundle"
                  type="file"
                  className="sr-only"
                  onChange={selectBundleFile}
                />
              </label>
              <span className="text-xs text-gray-600">
                {bundle ? bundle.name : "未选择文件"}
              </span>
            </div> */}

            <label
              htmlFor="bundleUrl"
              className="text-sm font-medium leading-6"
            >
              网盘链接 <span className="text-gray-400">(带密码)</span>
            </label>

            <div className="mt-2">
              <input
                id="bundleUrl"
                name="bundleUrl"
                type="url"
                className="w-full border py-1.5 px-3 rounded-md text-gray-600 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="col-span-full">
            <fieldset>
              <legend className="text-sm font-medium leading-6 ">格式</legend>
              <div className="mt-2 space-y-3 2xs:flex 2xs:space-y-0 2xs:space-x-6">
                <div className="flex items-center gap-x-2">
                  <input
                    id="figma"
                    name="format"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="figma"
                    className="block text-sm font-medium leading-6 "
                  >
                    Figma
                  </label>
                </div>
                <div className="flex items-center gap-x-2">
                  <input
                    id="photoshop"
                    name="format"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="photoshop"
                    className="block text-sm font-medium leading-6 "
                  >
                    Photoshop
                  </label>
                </div>
                <div className="flex items-center gap-x-2">
                  <input
                    id="adobe-xd"
                    name="format"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="adobe-xd"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Adobe XD
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        {/* <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          取消
        </button> */}
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          发布
        </button>
      </div>
    </form>
  );
};

const Account = () => {
  return (
    <div className="h-full">
      <div className="h-full max-w-screen-2xl mx-auto px-4 py-20">
        <div className="h-full flex justify-center items-center">
          <BundleUploader />
        </div>
      </div>
    </div>
  );
};

export default Account;
