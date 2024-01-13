import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { downloadableByMe } from "@/utils/download";

export const useDownloadableByMe = (id: string) =>
  useQuery<boolean>({
    queryKey: ["user", "downloadable", id],
    queryFn: async () => {
      try {
        return await downloadableByMe(id);
      } catch (e) {
        return false;
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
