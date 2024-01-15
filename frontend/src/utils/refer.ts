import { ReferIF } from "@/interfaces";
import { responseHandlerTemplate, requestTemplate } from "./requestTemplate";

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const getRefersRewarded = requestTemplate(
  (offset: number, limit: number) => ({
    url: apiEndpoint + `/refer/all_rewarded?offset=${offset}&limit=${limit}`,
    method: "GET",
  }),
  responseHandlerTemplate,
  (refers: ReferIF[]) =>
    refers.map((refer) => ({
      ...refer,
      referent_avatar:
        refer.referent_avatar && !refer.referent_avatar.startsWith("http")
          ? `${apiEndpoint}/static/avatars/${refer.referent_avatar}`
          : refer.referent_avatar,
    })),
  true
);
