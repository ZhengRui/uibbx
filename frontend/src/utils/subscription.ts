import { responseHandlerTemplate, requestTemplate } from "./requestTemplate";

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
