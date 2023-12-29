import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { likedByMe, getNumOfLikes, like, unlike } from "@/utils/like";

export const useNumOfLikes = (id: string) =>
  useQuery<number>({
    queryKey: ["numOfLikes", id],
    queryFn: async () => await getNumOfLikes(id),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

export const useLikedByMe = (id: string) =>
  useQuery<boolean>({
    queryKey: ["whoami", "liked", id],
    queryFn: async () => {
      try {
        return await likedByMe(id);
      } catch (e) {
        return false;
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

export const useLike = () => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: like,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["whoami", "liked", id] });
      queryClient.invalidateQueries({ queryKey: ["numOfLikes", id] });
      queryClient.invalidateQueries({
        queryKey: ["whoami", "numOfBundlesLiked"],
      });
      queryClient.invalidateQueries({
        queryKey: ["whoami", "bundlesLiked"],
      });
    },
  });

  return (id: string) => likeMutation.mutate(id);
};

export const useUnlike = () => {
  const queryClient = useQueryClient();

  const unlikeMutation = useMutation({
    mutationFn: unlike,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["whoami", "liked", id] });
      queryClient.invalidateQueries({ queryKey: ["numOfLikes", id] });
      queryClient.invalidateQueries({
        queryKey: ["whoami", "numOfBundlesLiked"],
      });
      queryClient.invalidateQueries({
        queryKey: ["whoami", "bundlesLiked"],
      });
    },
  });

  return (id: string) => unlikeMutation.mutate(id);
};
