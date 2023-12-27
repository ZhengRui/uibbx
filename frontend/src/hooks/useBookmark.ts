import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { bookmarkedByMe, bookmark, unbookmark } from "@/utils/bookmark";

export const useBookmarkedByMe = (id: string) =>
  useQuery<boolean>({
    queryKey: ["whoami", "bookmarked", id],
    queryFn: async () => {
      try {
        return await bookmarkedByMe(id);
      } catch (e) {
        return false;
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

export const useBookmark = () => {
  const queryClient = useQueryClient();

  const bookmarkMutation = useMutation({
    mutationFn: bookmark,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["whoami", "bookmarked", id] });
    },
  });

  return (id: string) => bookmarkMutation.mutate(id);
};

export const useUnbookmark = () => {
  const queryClient = useQueryClient();

  const unbookmarkMutation = useMutation({
    mutationFn: unbookmark,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["whoami", "bookmarked", id] });
    },
  });

  return (id: string) => unbookmarkMutation.mutate(id);
};
