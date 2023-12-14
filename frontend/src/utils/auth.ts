import {
  responseHandlerTemplate,
  requestTemplate,
  formConstructor,
} from "./requestTemplate";

const authEndpoint = process.env.NEXT_PUBLIC_AUTH_ENDPOINT;

export const whoami = async (token?: string) => {
  const token_ = token || localStorage.getItem("token");

  if (!token_) {
    return null;
  }

  const headers = new Headers({ Accept: "application/json" });
  headers.set("Authorization", `Bearer ${token_}`);

  const request = new Request(authEndpoint + "/whoami", {
    method: "GET",
    headers: headers,
  });

  const response = await fetch(request);
  if (response.status !== 200) {
    return null;
  }

  const data = await response.json();

  return data;
};

export const requestEmailVerify = requestTemplate(
  (
    email: string,
    expectRegistered: boolean,
    expectSecondLife: boolean = false
  ) => ({
    url:
      authEndpoint +
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
    url: authEndpoint + "/signup/email",
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
    url: authEndpoint + "/token/email",
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
    url: authEndpoint + "/verification/email",
    method: "POST",
    body: formConstructor({ email, code, token }),
  })
);

export const resetPasswdByEmail = requestTemplate(
  (email: string, code: string, password: string, token: string) => ({
    url: authEndpoint + "/reset/password/email",
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
      authEndpoint +
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
    url: authEndpoint + "/signup/cellnum",
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
    url: authEndpoint + "/token/cellnum",
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
    url: authEndpoint + "/verification/cellnum",
    method: "POST",
    body: formConstructor({ cellnum: cell, code, token }),
  })
);

export const resetPasswdByCell = requestTemplate(
  (cell: string, code: string, password: string, token: string) => ({
    url: authEndpoint + "/reset/password/cellnum",
    method: "POST",
    body: formConstructor({ cellnum: cell, code, password, token }),
  })
);

export const setUsername = requestTemplate(
  (username: string) => ({
    url: authEndpoint + "/username",
    method: "POST",
    body: formConstructor({ username }),
  }),
  responseHandlerTemplate,
  null,
  true
);
