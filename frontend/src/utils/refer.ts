import { responseHandlerTemplate, requestTemplate } from "./requestTemplate";

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const getRefersRewarded = requestTemplate(
  () => ({
    url: apiEndpoint + "/refer/all_rewarded",
    method: "GET",
  }),
  responseHandlerTemplate,
  null,
  true
);
