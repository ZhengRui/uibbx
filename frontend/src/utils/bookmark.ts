import { responseHandlerTemplate, requestTemplate } from "./requestTemplate";

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const bookmark = requestTemplate(
  (id: string) => ({
    url: apiEndpoint + "/bundle/bookmark?id=" + id,
    method: "POST",
  }),
  responseHandlerTemplate,
  null,
  true
);

export const unbookmark = requestTemplate(
  (id: string) => ({
    url: apiEndpoint + "/bundle/unbookmark?id=" + id,
    method: "DELETE",
  }),
  responseHandlerTemplate,
  null,
  true
);

export const bookmarkedByMe = requestTemplate(
  (id: string) => ({
    url: apiEndpoint + "/bundle/bookmarked?id=" + id,
    method: "GET",
  }),
  responseHandlerTemplate,
  null,
  true
);
