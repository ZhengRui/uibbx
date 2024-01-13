import { responseHandlerTemplate, requestTemplate } from "./requestTemplate";

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const downloadableByMe = requestTemplate(
  (id: string) => ({
    url: apiEndpoint + `/download?bundle_id=${id}&only_check_downloadable=true`,
    method: "GET",
  }),
  responseHandlerTemplate,
  null,
  true
);

export const download = requestTemplate(
  (id: string) => ({
    url: apiEndpoint + `/download?bundle_id=${id}`,
    method: "GET",
  }),
  responseHandlerTemplate,
  null,
  true
);
