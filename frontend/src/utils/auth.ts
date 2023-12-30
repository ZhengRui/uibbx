import {
  responseHandlerTemplate,
  requestTemplate,
  formConstructor,
} from "./requestTemplate";

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const cellFmt = /^1[3456789]\d{9}$/;
export const emailFmt =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const passwordFmt =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*_=+-]).{8,12}$/;

export const whoami = async (token?: string) => {
  const token_ = token || localStorage.getItem("token");

  if (!token_) {
    return null;
  }

  const headers = new Headers({ Accept: "application/json" });
  headers.set("Authorization", `Bearer ${token_}`);

  const request = new Request(apiEndpoint + "/whoami", {
    method: "GET",
    headers: headers,
  });

  const response = await fetch(request);
  if (response.status !== 200) {
    return null;
  }

  const user = await response.json();

  if (user.avatar) user.avatar = `${apiEndpoint}/static/avatars/${user.avatar}`;

  return user;
};

export const requestEmailVerify = requestTemplate(
  (
    email: string,
    expectRegistered: boolean,
    expectSecondLife: boolean = false
  ) => ({
    url:
      apiEndpoint +
      "/verification/email?email=" +
      email +
      "&expect_registered=" +
      expectRegistered +
      "&expect_secondlife=" +
      expectSecondLife,
    method: "GET",
  }),
  responseHandlerTemplate
);

export const signupByEmail = requestTemplate(
  (email: string, password: string, code: string, token: string) => ({
    url: apiEndpoint + "/signup/email",
    method: "POST",
    body: formConstructor({ email, password, code, token }),
  }),
  async (res: Response) => {
    const data = await responseHandlerTemplate(res);
    localStorage.setItem("token", data["access_token"]);
    return data;
  }
);

export const signinByEmail = requestTemplate(
  (email: string, password: string) => ({
    url: apiEndpoint + "/token/email",
    method: "POST",
    body: formConstructor({ email, password }),
  }),
  async (res: Response) => {
    const data = await responseHandlerTemplate(res);
    localStorage.setItem("token", data["access_token"]);
    return data;
  }
);

export const verifyEmail = requestTemplate(
  (email: string, code: string, token: string) => ({
    url: apiEndpoint + "/verification/email",
    method: "POST",
    body: formConstructor({ email, code, token }),
  })
);

export const resetPasswdByEmail = requestTemplate(
  (email: string, code: string, password: string, token: string) => ({
    url: apiEndpoint + "/reset/password/email",
    method: "POST",
    body: formConstructor({ email, code, password, token }),
  })
);

export const requestCellVerify = requestTemplate(
  (
    cell: string,
    expectRegistered: boolean,
    expectSecondLife: boolean = false
  ) => ({
    url:
      apiEndpoint +
      "/verification/cellnum?cellnum=" +
      cell +
      "&expect_registered=" +
      expectRegistered +
      "&expect_secondlife=" +
      expectSecondLife,
    method: "GET",
  }),
  responseHandlerTemplate
);

export const signupByCell = requestTemplate(
  (cell: string, password: string, code: string, token: string) => ({
    url: apiEndpoint + "/signup/cellnum",
    method: "POST",
    body: formConstructor({ cellnum: cell, password, code, token }),
  }),
  async (res: Response) => {
    const data = await responseHandlerTemplate(res);
    localStorage.setItem("token", data["access_token"]);
    return data;
  }
);

export const signinByCell = requestTemplate(
  (cell: string, password: string) => ({
    url: apiEndpoint + "/token/cellnum",
    method: "POST",
    body: formConstructor({ cellnum: cell, password }),
  }),
  async (res: Response) => {
    const data = await responseHandlerTemplate(res);
    localStorage.setItem("token", data["access_token"]);
    return data;
  }
);

export const verifyCell = requestTemplate(
  (cell: string, code: string, token: string) => ({
    url: apiEndpoint + "/verification/cellnum",
    method: "POST",
    body: formConstructor({ cellnum: cell, code, token }),
  })
);

export const resetPasswdByCell = requestTemplate(
  (cell: string, code: string, password: string, token: string) => ({
    url: apiEndpoint + "/reset/password/cellnum",
    method: "POST",
    body: formConstructor({ cellnum: cell, code, password, token }),
  })
);

export const setUsername = requestTemplate(
  (username: string) => ({
    url: apiEndpoint + "/username",
    method: "POST",
    body: formConstructor({ username }),
  }),
  responseHandlerTemplate,
  null,
  true
);

export const updateUserInfo = requestTemplate(
  (updates: {
    nickname: string;
    description: string;
    username: string;
    avatar: File;
  }) => ({
    url: apiEndpoint + "/whoami",
    method: "PUT",
    body: formConstructor(updates),
  }),
  responseHandlerTemplate,
  null,
  true
);

export const resetPasswdByOldPasswd = requestTemplate(
  (oldPassword: string, newPassword: string) => ({
    url: apiEndpoint + "/reset/password",
    method: "POST",
    body: formConstructor({
      old_password: oldPassword,
      new_password: newPassword,
    }),
  }),
  responseHandlerTemplate,
  null,
  true
);
