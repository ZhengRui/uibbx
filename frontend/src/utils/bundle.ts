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
      images: bundle.images,
      bundle_url: bundle.bundle_url,
      bundle_format: bundle.format,
    }),
  }),
  responseHandlerTemplate,
  null,
  true
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
    images: [data.cover, ...data.carousel],
    bundle_url: data.bundle_url,
    format: data.format,
  })
);
