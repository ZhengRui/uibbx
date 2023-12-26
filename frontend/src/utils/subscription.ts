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
