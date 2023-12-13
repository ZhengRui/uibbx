"use client";

import { Popover, Transition } from "@headlessui/react";
import { authPanelOpenAtom, authModeAtom } from "@/atoms";
import { useAtom, useSetAtom } from "jotai";
import { Fragment, useRef } from "react";
import { WechatIcon } from "./icons";
import { useState, useEffect } from "react";
import {
  requestEmailVerify,
  requestCellVerify,
  signupByEmail,
  signupByCell,
  signinByEmail,
  signinByCell,
  whoami,
} from "@/utils/auth";
import toast from "react-hot-toast";

import Image from "next/image";

const cellFmt = /^1[3456789]\d{9}$/;
const emailFmt =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordFmt = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*_=+-]).{8,12}$/;

const Login = () => {
  const setMode = useSetAtom(authModeAtom);

  const handleLogin = async (evt: React.FormEvent) => {
    evt.preventDefault();
    const target = evt.target as HTMLFormElement;
    const cellOrEmail = target.cellOrEmail.value;
    const password = target.password.value;

    const isCell = cellOrEmail.match(cellFmt);
    const isEmail = cellOrEmail.match(emailFmt);

    if (!isCell && !isEmail) {
      toast.error("手机号/邮箱格式不正确");
      return;
    }

    try {
      const data = isCell
        ? await signinByCell(cellOrEmail, password)
        : isEmail
        ? await signinByEmail(cellOrEmail, password)
        : null;

      if (data) {
        const user = await whoami(data["access_token"]);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : (err as string));
    }
  };

  return (
    <div className="flex flex-col justify-end items-center w-full h-full space-y-16">
      <form
        className="flex flex-col justify-between items-center w-full"
        onSubmit={handleLogin}
      >
        <div className="w-full">
          <label className="hidden" htmlFor="cellOrEmail">
            手机号/邮箱
          </label>
          <input
            id="cellOrEmail"
            name="cellOrEmail"
            type="text"
            placeholder="手机号/邮箱"
            required
            className="w-full border py-3 px-6 rounded-full border-[#c8d8f5] focus:outline-none text-sm text-gray-600"
          />
        </div>

        <div className="mt-3 w-full">
          <label className="hidden" htmlFor="password">
            密码
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="密码"
            required
            className="w-full border py-3 px-6 rounded-full border-[#c8d8f5] focus:outline-none text-sm text-gray-600"
          />
        </div>

        <div className="mt-6 w-full flex justify-end items-center space-x-10 text-gray-500">
          <span
            className="text-sm cursor-pointer hover:text-[#936efe]"
            onClick={() => setMode("signup")}
          >
            还没有账号？
          </span>
          <span
            className="text-sm cursor-pointer hover:text-[#936efe]"
            onClick={() => setMode("reset")}
          >
            忘记密码？
          </span>
        </div>

        <button className="mt-10 w-full bg-[#936efe] py-2 rounded-full text-white">
          登录
        </button>
      </form>
      <div className="flex flex-col justify-between items-center w-full">
        <div className="relative w-2/3 border-t border-t-gray-200 flex justify-center items-center">
          <span className="absolute px-6 bg-white text-gray-400">OR</span>
        </div>
        <div className="flex justify-center items-center mt-12">
          <WechatIcon className="w-9 h-9 text-[#00c800] border rounded-full p-2 border-[#c8d8f5]" />
        </div>
      </div>
    </div>
  );
};

const Signup = () => {
  const setMode = useSetAtom(authModeAtom);
  const [counterLife, setCounterLife] = useState(0);
  const [token, setToken] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleVerification = async () => {
    const cellOrEmail = formRef.current?.cellOrEmail.value;
    const isCell = cellOrEmail.match(cellFmt);
    const isEmail = cellOrEmail.match(emailFmt);

    if (!isCell && !isEmail) {
      toast.error("手机号/邮箱格式不正确");
      return;
    }

    try {
      setCounterLife(119);
      const tokenData = isCell
        ? await requestCellVerify(cellOrEmail, false)
        : isEmail
        ? await requestEmailVerify(cellOrEmail, false)
        : null;

      if (tokenData) {
        setToken(tokenData.token);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : (err as string));
    }
  };

  const handleSignup = async (evt: React.FormEvent) => {
    evt.preventDefault();
    const target = evt.target as HTMLFormElement;
    const cellOrEmail = target.cellOrEmail.value;
    const password = target.password.value;
    const code = target.code.value;

    const isCell = cellOrEmail.match(cellFmt);
    const isEmail = cellOrEmail.match(emailFmt);

    if (!isCell && !isEmail) {
      toast.error("手机号/邮箱格式不正确");
      return;
    }

    const correctPassword = password.match(passwordFmt);
    if (!correctPassword) {
      toast.error(
        "密码格式错误，要求8-12个字符，数字、字母、特殊字符至少各有一个。"
      );
      return;
    }

    if (!code) {
      toast.error("验证码不能为空");
      return;
    }

    if (!token) {
      toast.error("请先获取验证码");
      return;
    }

    try {
      isCell
        ? await signupByCell(cellOrEmail, password, code, token)
        : isEmail
        ? await signupByEmail(cellOrEmail, password, code, token)
        : null;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : (err as string));
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (counterLife > 0) setCounterLife(counterLife - 1);
    }, 1000);
  }, [counterLife]);

  return (
    <div className="flex flex-col justify-end items-center w-full h-full space-y-10">
      <form
        className="flex flex-col justify-between items-center w-full"
        ref={formRef}
        onSubmit={handleSignup}
      >
        <div className="w-full">
          <label className="hidden" htmlFor="cellOrEmail">
            手机号/邮箱
          </label>
          <input
            id="cellOrEmail"
            name="cellOrEmail"
            type="text"
            placeholder="手机号/邮箱"
            required
            className="w-full border py-3 px-6 rounded-full border-[#c8d8f5] focus:outline-none text-sm text-gray-600"
          />
        </div>

        <div className="mt-3 w-full">
          <label className="hidden" htmlFor="password">
            密码
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="密码"
            required
            className="w-full border py-3 px-6 rounded-full border-[#c8d8f5] focus:outline-none text-sm text-gray-600"
          />
        </div>

        <div className="mt-3 w-full relative">
          <label className="hidden" htmlFor="code">
            验证码
          </label>
          <input
            id="code"
            name="code"
            type="text"
            placeholder="验证码"
            required
            className="w-full border py-3 px-6 rounded-full border-[#c8d8f5] focus:outline-none text-sm text-gray-600"
          />

          {counterLife ? (
            <div className="absolute top-0 right-1 h-full py-1">
              <button
                className="px-8 h-full bg-[#936efe] rounded-full text-sm text-white"
                type="button"
              >
                {counterLife}s
              </button>
            </div>
          ) : (
            <div className="absolute top-0 right-1 h-full py-1">
              <button
                className="px-8 h-full bg-[#936efe] rounded-full text-sm text-white"
                type="button"
                onClick={handleVerification}
              >
                <span>发送</span>
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 w-full flex justify-end items-center space-x-10 text-gray-500">
          <span
            className="text-sm cursor-pointer hover:text-[#936efe]"
            onClick={() => setMode("login")}
          >
            返回登录
          </span>
        </div>

        <button className="mt-10 w-full bg-[#936efe] py-2 rounded-full text-white">
          注册
        </button>
      </form>
      <div className="flex flex-col justify-between items-center w-full">
        <div className="relative w-2/3 border-t border-t-gray-200 flex justify-center items-center">
          <span className="absolute px-6 bg-white text-gray-400">OR</span>
        </div>
        <div className="flex justify-center items-center mt-12">
          <WechatIcon className="w-9 h-9 text-[#00c800] border rounded-full p-2 border-[#c8d8f5]" />
        </div>
      </div>
    </div>
  );
};

const Reset = () => {
  const setMode = useSetAtom(authModeAtom);

  return (
    <div className="flex flex-col justify-end items-center w-full h-full space-y-16">
      <form className="flex flex-col justify-between items-center w-full">
        <div className="w-full">
          <label className="hidden" htmlFor="cellOrEmail">
            手机号/邮箱
          </label>
          <input
            id="cellOrEmail"
            name="cellOrEmail"
            type="text"
            placeholder="手机号/邮箱"
            required
            className="w-full border py-3 px-6 rounded-full border-[#c8d8f5] focus:outline-none text-sm text-gray-600"
          />
        </div>

        <div className="mt-3 w-full">
          <label className="hidden" htmlFor="code">
            验证码
          </label>
          <input
            id="code"
            name="code"
            type="text"
            placeholder="验证码"
            required
            className="w-full border py-3 px-6 rounded-full border-[#c8d8f5] focus:outline-none text-sm text-gray-600"
          />
        </div>

        <div className="mt-6 w-full flex justify-end items-center space-x-10 text-gray-500">
          <span
            className="text-sm cursor-pointer hover:text-[#936efe]"
            onClick={() => setMode("login")}
          >
            返回登录
          </span>
        </div>

        <button className="mt-10 w-full bg-[#936efe] py-2 rounded-full text-white">
          继续
        </button>
      </form>
      <div className="flex flex-col justify-between items-center w-full">
        <div className="relative w-2/3 border-t border-t-gray-200 flex justify-center items-center">
          <span className="absolute px-6 bg-white text-gray-400">OR</span>
        </div>
        <div className="flex justify-center items-center mt-12">
          <WechatIcon className="w-9 h-9 text-[#00c800] border rounded-full p-2 border-[#c8d8f5]" />
        </div>
      </div>
    </div>
  );
};

const AuthPanel = () => {
  const [open, setOpen] = useAtom(authPanelOpenAtom);
  const [mode, setMode] = useAtom(authModeAtom);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Popover className="fixed inset-0 z-40 overflow-y-auto">
        <div className="flex justify-center items-center h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-50"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Popover.Overlay
              className="fixed inset-0 bg-[#1e1e1e] bg-opacity-50 transition-opacity backdrop-blur-sm"
              onClick={() => {
                setOpen(false);
                setMode("login");
              }}
            />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-50"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Popover.Panel className="relative bg-white flex justify-center items-center rounded-3xl overflow-clip">
              <div className="relative flex justify-center items-center h-[540px] w-[960px]">
                <Image
                  src="/authpanel-bg.png"
                  alt="authpanel background"
                  fill={true}
                  className="object-cover"
                />
              </div>

              <div className="bg-white w-1/2 h-full absolute right-0 flex justify-center items-center px-16 py-16">
                {mode === "login" ? (
                  <Login />
                ) : mode === "signup" ? (
                  <Signup />
                ) : mode === "reset" ? (
                  <Reset />
                ) : null}
              </div>
            </Popover.Panel>
          </Transition.Child>
        </div>
      </Popover>
    </Transition.Root>
  );
};

export default AuthPanel;
