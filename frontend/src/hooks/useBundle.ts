import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getBundlePublic,
  getBundle,
  getNumOfBundlesBookmarked,
  getNumOfBundlesPublished,
  getNumOfBundlesLiked,
} from "@/utils/bundle";
import { BundleIF } from "@/interfaces";

export const useBundlePublic = (id: string) =>
  useQuery<BundleIF>({
    queryKey: ["bundle", id],
    queryFn: async () => await getBundlePublic(id),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

export const useBundle = (id: string) =>
  useQuery<BundleIF>({
    queryKey: ["bundle", id],
    queryFn: async () => await getBundle(id),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

export const useNumOfBundlesPublished = () =>
  useQuery<number>({
    queryKey: ["whoami", "numOfBundlesPublished"],
    queryFn: getNumOfBundlesPublished,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

export const useNumOfBundlesLiked = () =>
  useQuery<number>({
    queryKey: ["whoami", "numOfBundlesLiked"],
    queryFn: getNumOfBundlesLiked,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

export const useNumOfBundlesBookmarked = () =>
  useQuery<number>({
    queryKey: ["whoami", "numOfBundlesBookmarked"],
    queryFn: getNumOfBundlesBookmarked,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
