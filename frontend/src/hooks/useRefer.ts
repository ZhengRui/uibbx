import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ReferIF } from "@/interfaces";
import { getRefersRewarded } from "@/utils/refer";

export const useRefersRewarded = (offset: number, limit: number) =>
  useQuery<ReferIF[]>({
    queryKey: ["user", "refersRewarded", offset, limit],
    queryFn: async () => await getRefersRewarded(offset, limit),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
