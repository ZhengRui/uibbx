"use client";

import { useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  updateUserInfo,
  passwordFmt,
  resetPasswdByOldPasswd,
} from "@/utils/auth";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { UserCircleIcon } from "@/components/icons";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

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
        toast.success("更新个人资料成功");
        queryClient.invalidateQueries({ queryKey: ["whoami"] });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : (err as string));
    }
  };

  return (
    <div className="flex flex-col w-full mx-4 2xs:mx-8 xs:mx-16 md:ml-64 md:mr-32">
      <span className="text-xl xs:text-2xl font-semibold">编辑个人资料</span>
      <span className="mt-4 text-xs xs:text-sm">
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
            <label
              htmlFor="avatar"
              className="text-xs xs:text-sm cursor-pointer"
            >
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
            <label
              htmlFor="nickname"
              className="text-xs xs:text-sm font-medium leading-6"
            >
              昵称
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="nickname"
                id="nickname"
                className="w-full border py-1.5 px-3 rounded-md text-gray-600 text-xs xs:text-sm focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="desc"
              className="text-xs xs:text-sm font-medium leading-6"
            >
              简介
            </label>
            <div className="mt-2">
              <textarea
                name="desc"
                id="desc"
                rows={3}
                className="w-full border py-1.5 px-3 rounded-md text-gray-600 text-xs xs:text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="username"
              className="text-xs xs:text-sm font-medium leading-6"
            >
              用户名
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="username"
                id="username"
                className="w-full border py-1.5 px-3 rounded-md text-gray-600 text-xs xs:text-sm focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="emailOrCell"
              className="text-xs xs:text-sm font-medium leading-6"
            >
              邮箱地址/手机号
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="emailOrCell"
                id="emailOrCell"
                className="w-full border py-1.5 px-3 rounded-md text-gray-600 text-xs xs:text-sm focus:outline-none"
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
            className="rounded-md bg-violet-600 px-6 py-2 text-xs xs:text-sm font-semibold text-white shadow-sm hover:bg-violet-500"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
};

const ResetPasswordForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleUpdatePassword = async (
    evt: React.FormEvent<HTMLFormElement>
  ) => {
    evt.preventDefault();

    const target = evt.target as HTMLFormElement;
    const oldPassword = target.oldPassword.value;
    const password = target.password.value;
    const repeat = target.repeat.value;

    const correctRepeat = password === repeat;
    if (!correctRepeat) {
      toast.error("重复密码不一致");
      return;
    }

    const correctPassword = password.match(passwordFmt);
    if (!correctPassword) {
      toast.error(
        "密码格式错误，要求8-12个字符，数字、字母、特殊字符至少各有一个。"
      );
      return;
    }

    try {
      const data = await resetPasswdByOldPasswd(oldPassword, password);

      if (data && data["message"] === "success") {
        toast.success("密码修改成功");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : (err as string));
    }
  };

  return (
    <div className="flex flex-col w-full mx-4 2xs:mx-8 xs:mx-16 md:ml-64 md:mr-32">
      <span className="text-xl xs:text-2xl font-semibold">修改登录密码</span>
      <span className="mt-4 text-xs xs:text-sm">
        此处可修改登录密码。如您已忘记旧登录密码，可退出登录后再登录时选择“忘记密码”，利用注册邮箱/手机号来重设密码。
      </span>
      <span className="mt-2 text-[10px] xs:text-xs text-gray-500">
        8-12个字符，数字、字母、特殊字符至少各有一个
      </span>

      <form className="mt-12" onSubmit={handleUpdatePassword}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
          <div className="col-span-full">
            <label
              htmlFor="oldPassword"
              className="text-xs xs:text-sm font-medium leading-6"
            >
              旧密码
            </label>
            <div className="mt-2 relative">
              <input
                id="oldPassword"
                name="oldPassword"
                type={passwordVisible ? "text" : "password"}
                placeholder="旧密码"
                title="8-12个字符，数字、字母、特殊字符至少各有一个"
                className="w-full border py-1.5 px-3 rounded-md text-gray-600 text-xs xs:text-sm focus:outline-none"
                required
              />

              {
                <div
                  className="absolute top-0 right-4 h-full flex items-center cursor-pointer"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <EyeSlashIcon className="w-6 h-6 text-gray-400" />
                  ) : (
                    <EyeIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              }
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="password"
              className="text-xs xs:text-sm font-medium leading-6"
            >
              新密码
            </label>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="输入新密码"
                title="8-12个字符，数字、字母、特殊字符至少各有一个"
                className="w-full border py-1.5 px-3 rounded-md text-gray-600 text-xs xs:text-sm focus:outline-none"
                required
              />

              {
                <div
                  className="absolute top-0 right-4 h-full flex items-center cursor-pointer"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <EyeSlashIcon className="w-6 h-6 text-gray-400" />
                  ) : (
                    <EyeIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              }
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="repeat"
              className="text-xs xs:text-sm font-medium leading-6"
            >
              确认新密码
            </label>
            <div className="mt-2 relative">
              <input
                id="repeat"
                name="repeat"
                type={passwordVisible ? "text" : "password"}
                placeholder="再次输入新密码"
                title="与上面密码相同"
                className="w-full border py-1.5 px-3 rounded-md text-gray-600 text-xs xs:text-sm focus:outline-none"
                required
              />

              {
                <div
                  className="absolute top-0 right-4 h-full flex items-center cursor-pointer"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <EyeSlashIcon className="w-6 h-6 text-gray-400" />
                  ) : (
                    <EyeIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              }
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
            className="rounded-md bg-violet-600 px-6 py-2 text-xs xs:text-sm font-semibold text-white shadow-sm hover:bg-violet-500"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
};

const AccountEdit = () => {
  const [currentTab, setCurrentTab] = useState("info");

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 left-0 w-64 hidden md:flex flex-col justify-start items-center space-y-6 text-sm">
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

      <div className="w-full flex justify-end space-x-8 border-b mb-10 md:hidden">
        {["info", "password"].map((tab) => (
          <span
            key={tab}
            className={`${
              tab === currentTab
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }
                  whitespace-nowrap border-b-2 pb-1 text-xs xs:text-sm font-medium cursor-pointer`}
            aria-current={tab === currentTab ? "page" : undefined}
            onClick={() => setCurrentTab(tab)}
          >
            {tab === "info"
              ? "编辑个人资料"
              : tab === "password"
              ? "修改密码"
              : ""}
          </span>
        ))}
      </div>

      <div className="flex justify-center items-start w-full h-full">
        {currentTab === "info" ? <EditInfoForm /> : <ResetPasswordForm />}
      </div>
    </div>
  );
};

export default AccountEdit;
