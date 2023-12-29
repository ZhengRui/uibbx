"use client";

import { useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { updateUserInfo } from "@/utils/auth";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { UserCircleIcon } from "@/components/icons";

const EditInfoForm = () => {
  const queryClient = useQueryClient();

  const { data: user } = useAuth();

  const [avatar, setAvatar] = useState<string | File | null>(
    user?.avatar || null
  );

  const formRef = useRef<HTMLFormElement>(null);

  const selectAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fs = e.target.files;

    if (fs && fs[0]) {
      setAvatar(fs[0]);
    }
  };

  useEffect(() => {
    if (formRef.current) {
      formRef.current.nickname.value = user?.nickname;
      formRef.current.desc.value = user?.description;
      formRef.current.username.value = user?.username;
      formRef.current.emailOrCell.value = user?.email || user?.cellnum;
    }
  }, []);

  const handleUpdateUserInfo = async (
    evt: React.FormEvent<HTMLFormElement>
  ) => {
    evt.preventDefault();

    const target = evt.target as HTMLFormElement;
    const nickname = target.nickname.value || "";
    const description = target.desc.value || "";
    const username = target.username.value || "";
    const avatar = target.avatar.files[0] || "";

    try {
      const data = await updateUserInfo({
        nickname,
        description,
        username,
        avatar,
      });

      if (data) {
        toast.success("更新成功");
        queryClient.invalidateQueries({ queryKey: ["whoami"] });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : (err as string));
    }
  };

  return (
    <div className="flex flex-col w-full ml-64 mr-32">
      <span className="text-2xl font-semibold">编辑个人资料</span>
      <span className="mt-4 text-sm">
        此处可更改个人信息，用户可通过用户名搜索到你的账号
      </span>
      <form className="mt-12" ref={formRef} onSubmit={handleUpdateUserInfo}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
          <div className="col-span-full flex justify-start items-center space-x-4">
            <div className="relative w-16 h-16 rounded-full flex justify-center items-center bg-[#404040] overflow-clip">
              {avatar ? (
                <Image
                  src={
                    typeof avatar === "string"
                      ? avatar
                      : URL.createObjectURL(avatar)
                  }
                  alt="avatar"
                  fill={true}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : user?.nickname ? (
                <span className="text-white text-2xl">
                  {user?.nickname![0]}
                </span>
              ) : (
                <UserCircleIcon className="w-full h-full bg-[#f2f7ff]" />
              )}
            </div>
            <label htmlFor="avatar" className="text-sm cursor-pointer">
              <span>更改头像</span>

              <input
                id="avatar"
                name="avatar"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={selectAvatar}
              />
            </label>
          </div>

          <div className="col-span-full">
            <label htmlFor="nickname" className="text-sm font-medium leading-6">
              昵称
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="nickname"
                id="nickname"
                className="w-full border py-1.5 px-3 rounded-md text-gray-600 text-sm focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="col-span-full">
            <label htmlFor="desc" className="text-sm font-medium leading-6">
              简介
            </label>
            <div className="mt-2">
              <textarea
                name="desc"
                id="desc"
                rows={3}
                className="w-full border py-1.5 px-3 rounded-md text-gray-600 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label htmlFor="username" className="text-sm font-medium leading-6">
              用户名
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="username"
                id="username"
                className="w-full border py-1.5 px-3 rounded-md text-gray-600 text-sm focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="emailOrCell"
              className="text-sm font-medium leading-6"
            >
              邮箱地址/手机号
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="emailOrCell"
                id="emailOrCell"
                className="w-full border py-1.5 px-3 rounded-md text-gray-600 text-sm focus:outline-none"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 flex items-center justify-end gap-x-6">
          {/* <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          取消
        </button> */}
          <button
            type="submit"
            className="rounded-md bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
};

const ResetPasswordForm = () => {
  return <div>resetpasswordform</div>;
};

const AccountEdit = () => {
  const [currentTab, setCurrentTab] = useState("info");

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 left-0 w-64 flex flex-col justify-start items-center space-y-6 text-sm">
        <span
          className={`${
            currentTab === "info" ? "text-violet-600 text-xl" : ""
          } h-8 cursor-pointer select-none`}
          onClick={() => setCurrentTab("info")}
        >
          编辑个人资料
        </span>
        <span
          className={`${
            currentTab === "password" ? "text-violet-600 text-xl" : ""
          } h-8 cursor-pointer select-none`}
          onClick={() => setCurrentTab("password")}
        >
          修改密码
        </span>
      </div>
      <div className="flex justify-center items-start w-full h-full">
        {currentTab === "info" ? <EditInfoForm /> : <ResetPasswordForm />}
      </div>
    </div>
  );
};

export default AccountEdit;
