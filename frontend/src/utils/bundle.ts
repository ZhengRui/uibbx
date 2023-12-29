import {
  responseHandlerTemplate,
  requestTemplate,
  formConstructor,
} from "./requestTemplate";
import { BundleIF } from "@/interfaces";

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const uploadBundle = requestTemplate(
  (bundle: BundleIF) => ({
    url: apiEndpoint + "/bundle",
    method: "POST",
    body: formConstructor({
      title: bundle.title,
      subtitle: bundle.subtitle,
      description: bundle.description,
      tags: bundle.tags,
      images: bundle.images,
      bundle_url: bundle.bundle_url,
      bundle_format: bundle.format,
    }),
  }),
  responseHandlerTemplate,
  null,
  true
);

export const updateBundle = requestTemplate(
  (bundle: BundleIF) => ({
    url: apiEndpoint + "/bundle",
    method: "PUT",
    body: formConstructor({
      id: bundle.id,
      title: bundle.title,
      subtitle: bundle.subtitle,
      description: bundle.description,
      tags: bundle.tags,
      images: bundle.images.map((img) =>
        typeof img === "string" ? img.split("/").slice(-1)[0] : img
      ),
      bundle_url: bundle.bundle_url,
      bundle_format: bundle.format,
    }),
  }),
  responseHandlerTemplate,
  null,
  true
);

export const getBundlePublic = requestTemplate(
  (id: string) => ({
    url: apiEndpoint + "/bundle/public?id=" + id,
    method: "GET",
  }),
  responseHandlerTemplate,
  (data: any) => ({
    id: data.id,
    creator_uid: data.creator_uid,
    created_at: data.created_at,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    tags: data.tags,
    images: [data.cover, ...data.carousel].map(
      (img: string) => `${apiEndpoint}/static/bundles/${data.id}/${img}`
    ),
    bundle_url: data.bundle_url,
    format: data.format,
    creator_username: data.creator_username,
  })
);

export const getBundle = requestTemplate(
  (id: string) => ({
    url: apiEndpoint + "/bundle?id=" + id,
    method: "GET",
  }),
  responseHandlerTemplate,
  (data: any) => ({
    id: data.id,
    creator_uid: data.creator_uid,
    created_at: data.created_at,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    tags: data.tags,
    images: [data.cover, ...data.carousel].map(
      (img: string) => `${apiEndpoint}/static/bundles/${data.id}/${img}`
    ),
    bundle_url: data.bundle_url,
    format: data.format,
    creator_username: data.creator_username,
  }),
  true
);

export const getNumOfBundlesPublished = requestTemplate(
  () => ({
    url: apiEndpoint + "/bundle/num_of_all_published",
    method: "GET",
  }),
  responseHandlerTemplate,
  null,
  true
);

export const getBundlesPublished = requestTemplate(
  (
    offset: number,
    limit: number,
    with_liked: boolean = false,
    with_bookmarked: boolean = false
  ) => ({
    url:
      apiEndpoint +
      `/bundle/all_published?offset=${offset}&limit=${limit}&with_liked=${with_liked}&with_bookmarked=${with_bookmarked}`,
    method: "GET",
  }),
  responseHandlerTemplate,
  (data: any) =>
    data.map((bundle: any) => {
      const { cover, carousel, ...rest } = bundle;

      return {
        ...rest,
        images: [cover, ...carousel].map(
          (img: string) => `${apiEndpoint}/static/bundles/${bundle.id}/${img}`
        ),
      };
    }),
  true
);

export const getNumOfBundlesLiked = requestTemplate(
  () => ({
    url: apiEndpoint + "/bundle/num_of_all_liked",
    method: "GET",
  }),
  responseHandlerTemplate,
  null,
  true
);

export const getBundlesLiked = requestTemplate(
  (offset: number, limit: number, with_bookmarked: boolean = false) => ({
    url:
      apiEndpoint +
      `/bundle/all_liked?offset=${offset}&limit=${limit}&with_bookmarked=${with_bookmarked}`,
    method: "GET",
  }),
  responseHandlerTemplate,
  (data: any) =>
    data.map((bundle: any) => {
      const { cover, carousel, ...rest } = bundle;

      return {
        ...rest,
        images: [cover, ...carousel].map(
          (img: string) => `${apiEndpoint}/static/bundles/${bundle.id}/${img}`
        ),
      };
    }),
  true
);

export const getNumOfBundlesBookmarked = requestTemplate(
  () => ({
    url: apiEndpoint + "/bundle/num_of_all_bookmarked",
    method: "GET",
  }),
  responseHandlerTemplate,
  null,
  true
);

export const getBundlesBookmarked = requestTemplate(
  (offset: number, limit: number, with_liked: boolean = false) => ({
    url:
      apiEndpoint +
      `/bundle/all_bookmarked?offset=${offset}&limit=${limit}&with_liked=${with_liked}`,
    method: "GET",
  }),
  responseHandlerTemplate,
  (data: any) =>
    data.map((bundle: any) => {
      const { cover, carousel, ...rest } = bundle;

      return {
        ...rest,
        images: [cover, ...carousel].map(
          (img: string) => `${apiEndpoint}/static/bundles/${bundle.id}/${img}`
        ),
      };
    }),
  true
);
