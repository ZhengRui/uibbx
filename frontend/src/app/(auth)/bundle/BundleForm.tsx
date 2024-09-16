"use client";

import ImageStack from "./ImageStack";
import toast from "react-hot-toast";
import React, { useEffect, useRef, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { BundleIF } from "@/interfaces";
import {
  usePublishBundle,
  useUpdateBundle,
  useDeleteBundle,
} from "@/hooks/useBundle";
import { Modal } from "@/components/Modal";
import { ExclamationCircleSolidIcon } from "@/components/icons";
import Link from "next/link";

const maxBundleImageSize = process.env.NEXT_PUBLIC_MAX_BUNDLE_IMAGE_SIZE;

const defaultTags = [
  "UI套件",
  "App",
  "Web",
  "3D",
  "原型",
  "图标",
  "样机",
  "插画",
  "海报",
  "免费",
];

const BundleForm = ({
  init,
  newOrUpdate = "new",
}: {
  init?: BundleIF;
  newOrUpdate: string;
}) => {
  const [tags, setTags] = useState<string[]>(init ? init.tags : []);
  const [images, setImages] = useState<{ url: string; file: File | null }[]>(
    init
      ? init.images.map((f) =>
          typeof f === "string"
            ? { url: f, file: null }
            : { url: URL.createObjectURL(f), file: f }
        )
      : []
  );
  const formRef = useRef<HTMLFormElement>(null);

  const publishBundle = usePublishBundle();
  const updateBundle = useUpdateBundle();
  const deleteBundle = useDeleteBundle();

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

    const newImages = Array.from(fs).map((f) => ({
      url: URL.createObjectURL(f),
      file: f,
    }));
    setImages((images) => [...images, ...newImages]);

    e.target.value = "";
  };

  const onSubmitForm = async (evt: React.FormEvent) => {
    evt.preventDefault();
    const target = evt.target as HTMLFormElement;

    const title = target.btitle.value;
    const subtitle = target.subtitle.value;
    const description = target.desc.value;
    const bundle_url = target.bundleUrl.value;
    const format = Array.from(target.format as NodeListOf<HTMLInputElement>)
      .filter((f) => f.checked)
      .map((f) => f.value);
    const purchase_price = target.purchasePrice.value;

    if (images.length === 0) {
      toast.error("请上传预览图");
      return;
    }

    if (format.length === 0) {
      toast.error("请至少选择一个格式");
      return;
    }

    if (maxBundleImageSize) {
      const tooLargeImages = images.filter(
        (i) => i.file && i.file.size > parseInt(maxBundleImageSize)
      );
      if (tooLargeImages.length > 0) {
        toast.error(
          `图片 ${tooLargeImages
            .map((i) => i.file!.name)
            .join(", ")} 大小超过限制，图片大小不能超过 5Mb`
        );
        return;
      }
    }

    await (newOrUpdate === "new" ? publishBundle : updateBundle)({
      id: init?.id,
      title,
      subtitle,
      description,
      tags,
      images: images.map((i) => i.file || i.url),
      bundle_url,
      format,
      purchase_price,
    });
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [draftModalOpen, setDraftModalOpen] = useState(false);

  useEffect(() => {
    if (init && formRef.current) {
      formRef.current.btitle.value = init.title;
      formRef.current.subtitle.value = init.subtitle;
      formRef.current.desc.value = init.description;
      formRef.current.bundleUrl.value = init.bundle_url;
      Array.from(
        formRef.current.format as NodeListOf<HTMLInputElement>
      ).forEach((f) => {
        if (init.format.includes(f.value)) f.checked = true;
      });
      Array.from(
        formRef.current.category as NodeListOf<HTMLInputElement>
      ).forEach((f) => {
        if (init.tags.includes(f.value)) f.checked = true;
      });
      formRef.current.tags.value = init.tags
        .filter((t) => !defaultTags.includes(t))
        .join(", ");
      formRef.current.purchasePrice.value = init.purchase_price;
    }
  }, []);

  return (
    <>
      <form className="w-full" onSubmit={onSubmitForm} ref={formRef}>
        <h2 className="text-xl xs:text-2xl font-semibold leading-7 text-gray-900">
          {newOrUpdate === "new" ? "发布素材" : "更新素材"}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label
              htmlFor="btitle"
              className="text-xs xs:text-sm font-medium leading-6"
            >
              标题
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="btitle"
                id="btitle"
                className="w-full border py-1.5 px-3 rounded-md text-gray-600 text-xs xs:text-sm focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="subtitle"
              className="text-xs xs:text-sm font-medium leading-6"
            >
              子标题 <span className="text-gray-400">(选填)</span>
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="subtitle"
                id="subtitle"
                className="w-full border py-1.5 px-3 rounded-md text-gray-600 text-xs xs:text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="desc"
              className="text-xs xs:text-sm font-medium leading-6"
            >
              描述 <span className="text-gray-400">(选填)</span>
            </label>
            <div className="mt-2">
              <textarea
                id="desc"
                name="desc"
                rows={3}
                className="w-full rounded-md border py-1.5 px-3 text-gray-600 text-xs xs:text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="tags"
              className="text-xs xs:text-sm font-medium leading-6"
            >
              标签 <span className="text-gray-400">(选填)</span>
            </label>

            <fieldset className="mt-2">
              <legend className="sr-only">默认标签</legend>
              {defaultTags.map((tag, index) => (
                <label
                  key={index}
                  className="inline-flex items-center mr-6 gap-x-2"
                  htmlFor="category"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600"
                    name="category"
                    value={tag}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const tagsOfDefault = defaultTags.filter(
                          (t) => tags.includes(t) || t === tag
                        );
                        const tagsOfCustom = tags.filter(
                          (t) => !defaultTags.includes(t)
                        );
                        setTags([...tagsOfDefault, ...tagsOfCustom]);
                      } else {
                        setTags(tags.filter((t) => t !== tag));
                      }
                    }}
                  />
                  <span>{tag}</span>
                </label>
              ))}
            </fieldset>

            <div className="mt-2 flex flex-col space-y-2">
              <input
                type="text"
                name="tags"
                id="tags"
                className="w-full border py-1.5 px-3 rounded-md text-gray-600 text-xs xs:text-sm focus:outline-none"
                placeholder="自定义: 3D, 电影海报, 卡通, figma"
                onChange={(e) => {
                  const value = e.target.value;
                  const tagsOfDefault = tags.filter((t) =>
                    defaultTags.includes(t)
                  );
                  const tagsOfCustom = value
                    .replaceAll("，", ",")
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t.length > 0 && !defaultTags.includes(t));

                  setTags([...tagsOfDefault, ...tagsOfCustom]);
                }}
              />
              {tags && (
                <div className="space-x-2">
                  {tags.map((tag, i) => (
                    <span
                      className="border border-indigo-400 rounded-lg py-1 px-2 text-[10px] xs:text-xs text-gray-600"
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
              className="text-xs xs:text-sm font-medium leading-6"
            >
              预览图片 <span className="text-gray-400">(首张为封面图)</span>
            </label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              {images.length ? (
                <div className="w-full flex flex-col">
                  <div className="pb-5 border-b">
                    <ImageStack images={images} setImages={setImages} />
                  </div>
                  <div className="flex justify-end items-center mt-4 space-x-2 2xs:space-x-4">
                    <div className="flex justify-center items-center">
                      <label
                        htmlFor="images-append"
                        className="cursor-pointer rounded-full bg-indigo-600 px-4 2xs:px-6 py-2 text-xs xs:text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
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
                      className="rounded-full bg-orange-700 px-4 2xs:px-6 py-2 text-xs xs:text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
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
                  <div className="mt-4 flex justify-center text-xs xs:text-sm leading-6 text-gray-600">
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
              className="text-xs xs:text-sm font-medium leading-6"
            >
              文件包
            </label>
            <div className="mt-2 flex justify-start items-center space-x-6">
              <label
                htmlFor="bundle"
                className="cursor-pointer border border-dashed rounded-lg py-2 px-4 text-xs xs:text-sm text-indigo-500"
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
              className="text-xs xs:text-sm font-medium leading-6"
            >
              网盘链接 <span className="text-gray-400">(带密码)</span>
            </label>

            <div className="mt-2">
              <input
                id="bundleUrl"
                name="bundleUrl"
                type="url"
                className="w-full border py-1.5 px-3 rounded-md text-gray-600 text-xs xs:text-sm focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="purchasePrice"
              className="text-xs xs:text-sm font-medium leading-6"
            >
              购买价格
            </label>

            <div className="mt-2 relative">
              <input
                id="purchasePrice"
                name="purchasePrice"
                type="number"
                min="0"
                step="0.1"
                className="pl-6 w-full border py-1.5 px-3 rounded-md text-gray-600 text-xs xs:text-sm focus:outline-none"
                defaultValue={10.0}
                required
              />
              <span className="absolute top-0 left-2 h-full flex items-center text-gray-500 font-semibold text-sm xs:text-base">
                ¥
              </span>
            </div>
          </div>

          <div className="col-span-full">
            <fieldset>
              <legend className="text-xs xs:text-sm font-medium leading-6 ">
                格式
              </legend>
              <div className="mt-2 space-y-3 2xs:flex 2xs:space-y-0 2xs:space-x-6">
                <div className="flex items-center gap-x-2">
                  <input
                    id="figma"
                    name="format"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600"
                    value="figma"
                  />
                  <label
                    htmlFor="figma"
                    className="block text-xs xs:text-sm font-medium leading-6"
                  >
                    Figma
                  </label>
                </div>
                <div className="flex items-center gap-x-2">
                  <input
                    id="photoshop"
                    name="format"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600"
                    value="photoshop"
                  />
                  <label
                    htmlFor="photoshop"
                    className="block text-xs xs:text-sm font-medium leading-6 "
                  >
                    Photoshop
                  </label>
                </div>
                <div className="flex items-center gap-x-2">
                  <input
                    id="sketch"
                    name="format"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600"
                    value="sketch"
                  />
                  <label
                    htmlFor="sketch"
                    className="block text-xs xs:text-sm font-medium leading-6"
                  >
                    Sketch
                  </label>
                </div>
                <div className="flex items-center gap-x-2">
                  <input
                    id="ai"
                    name="format"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600"
                    value="ai"
                  />
                  <label
                    htmlFor="ai"
                    className="block text-xs xs:text-sm font-medium leading-6"
                  >
                    Adobe Illustrator
                  </label>
                </div>
                <div className="flex items-center gap-x-2">
                  <input
                    id="xd"
                    name="format"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600"
                    value="xd"
                  />
                  <label
                    htmlFor="xd"
                    className="block text-xs xs:text-sm font-medium leading-6"
                  >
                    Adobe XD
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
        </div>

        {newOrUpdate === "new" ? (
          <div className="mt-12 pt-6 flex items-center justify-end border-t border-gray-900/10 ">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 2xs:px-6 py-2 text-xs xs:text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              发布
            </button>
          </div>
        ) : (
          <div className="mt-12 pt-6 flex items-center justify-end border-t border-gray-900/10 space-x-1.5 2xs:space-x-3">
            <button
              type="button"
              className="rounded-full bg-orange-700 px-4 2xs:px-6 py-2 text-xs xs:text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
              onClick={() => setDeleteModalOpen(true)}
            >
              删除
            </button>
            <button
              type="button"
              className="rounded-full bg-emerald-700 px-4 2xs:px-6 py-2 text-xs xs:text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
              onClick={() => setDraftModalOpen(true)}
            >
              草稿
            </button>
            <Link href={`/bundle/preview/${init?.id}`} target="_blank">
              <button
                type="button"
                className="rounded-full bg-amber-600 px-4 2xs:px-6 py-2 text-xs xs:text-sm font-semibold text-white shadow-sm hover:bg-amber-500"
              >
                预览
              </button>
            </Link>
            <button
              type="submit"
              className="rounded-full bg-indigo-600 px-4 2xs:px-6 py-2 text-xs xs:text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              保存
            </button>
          </div>
        )}
      </form>

      {newOrUpdate === "update" && (
        <>
          <Modal
            title="确认删除素材?"
            body="删除后无法恢复, 请谨慎操作！"
            open={deleteModalOpen}
            setOpen={setDeleteModalOpen}
            yesCallback={() => deleteBundle(init?.id!)}
            type="warning"
            confirmAlias="确认"
          />
          <Modal
            title="确认将素材转入草稿箱?"
            body="转入草稿后将不会在首页展示, 但仍可在我的发布-草稿箱查看，后续可随时再次发布。"
            open={draftModalOpen}
            setOpen={setDraftModalOpen}
            yesCallback={() => {}}
            type="success"
            confirmAlias="确认"
            titleIcon={ExclamationCircleSolidIcon}
          />
        </>
      )}
    </>
  );
};

export const NewBundleForm = () =>
  BundleForm({
    newOrUpdate: "new",
  });

export const UpdateBundleForm = ({ init }: { init: BundleIF }) =>
  BundleForm({
    init,
    newOrUpdate: "update",
  });
