import { responseHandlerTemplate, requestTemplate } from "./requestTemplate";

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const like = requestTemplate(
  (id: string) => ({
    url: apiEndpoint + "/bundle/like?id=" + id,
    method: "POST",
  }),
  responseHandlerTemplate,
  null,
  true
);

export const unlike = requestTemplate(
  (id: string) => ({
    url: apiEndpoint + "/bundle/unlike?id=" + id,
    method: "DELETE",
  }),
  responseHandlerTemplate,
  null,
  true
);

export const getNumOfLikes = requestTemplate((id: string) => ({
  url: apiEndpoint + "/bundle/num_of_likes?id=" + id,
  method: "GET",
}));

export const likedByMe = requestTemplate(
  (id: string) => ({
    url: apiEndpoint + "/bundle/liked?id=" + id,
    method: "GET",
  }),
  responseHandlerTemplate,
  null,
  true
);
