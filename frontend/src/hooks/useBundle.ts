import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBundlePublic, getBundle } from "@/utils/bundle";
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
