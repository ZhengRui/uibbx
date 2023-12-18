import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBundle } from "@/utils/bundle";
import { BundleIF } from "@/interfaces";

export const useBundle = (id: string) =>
  useQuery<BundleIF>({
    queryKey: ["bundle", id],
    queryFn: async () => await getBundle(id),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
