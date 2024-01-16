import {
  responseHandlerTemplate,
  requestTemplate,
  formConstructor,
} from "./requestTemplate";

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const getSubscriptionOptions = requestTemplate(
  () => ({
    url: apiEndpoint + "/subscription/options",
    method: "GET",
  }),
  responseHandlerTemplate,
  null,
  true
);

export const getSubscriptions = requestTemplate(
  (offset: number, limit: number) => ({
    url: apiEndpoint + `/subscription/all?offset=${offset}&limit=${limit}`,
    method: "GET",
  }),
  responseHandlerTemplate,
  null,
  true
);

export const getSubscriptionQRCode = requestTemplate(
  (tier: string, option: string) => ({
    url: apiEndpoint + `/subscription?tier=${tier}&option=${option}`,
    method: "POST",
    body: formConstructor({ dummyField: "dummyField" }),
  }),
  responseHandlerTemplate,
  null,
  true,
  true
);

export const getSubscriptionOrderStatus = requestTemplate(
  (order_id: string) => ({
    url: apiEndpoint + `/subscription/status?order_id=${order_id}`,
    method: "GET",
  }),
  responseHandlerTemplate,
  null,
  true
);
