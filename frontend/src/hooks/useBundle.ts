import {
  keepPreviousData,
  useQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import {
  getBundlePublic,
  getBundle,
  getNumOfBundlesBookmarked,
  getNumOfBundlesPublished,
  getNumOfBundlesLiked,
  getBundlesPublished,
  getBundlesLiked,
  getBundlesBookmarked,
  uploadBundle,
  updateBundle,
  deleteBundle,
} from "@/utils/bundle";
import { BundleIF } from "@/interfaces";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useBundlePublic = (id: string) =>
  useQuery<BundleIF>({
    queryKey: ["bundle", id, "public"],
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
    queryKey: ["user", "numOfBundlesPublished"],
    queryFn: getNumOfBundlesPublished,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

export const useNumOfBundlesLiked = () =>
  useQuery<number>({
    queryKey: ["user", "numOfBundlesLiked"],
    queryFn: getNumOfBundlesLiked,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

export const useNumOfBundlesBookmarked = () =>
  useQuery<number>({
    queryKey: ["user", "numOfBundlesBookmarked"],
    queryFn: getNumOfBundlesBookmarked,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

export const useBundlesPublished = (
  offset: number,
  limit: number,
  with_liked: boolean = false,
  with_bookmarked: boolean = false
) =>
  useQuery<BundleIF[]>({
    queryKey: [
      "user",
      "bundlesPublished",
      offset,
      limit,
      with_liked,
      with_bookmarked,
    ],
    queryFn: async () =>
      await getBundlesPublished(offset, limit, with_liked, with_bookmarked),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

export const useBundlesLiked = (
  offset: number,
  limit: number,
  with_bookmarked: boolean = false
) =>
  useQuery<BundleIF[]>({
    queryKey: ["user", "bundlesLiked", offset, limit, with_bookmarked],
    queryFn: async () => await getBundlesLiked(offset, limit, with_bookmarked),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

export const useBundlesBookmarked = (
  offset: number,
  limit: number,
  with_liked: boolean = false
) =>
  useQuery<BundleIF[]>({
    queryKey: ["user", "bundlesBookmarked", offset, limit, with_liked],
    queryFn: async () => await getBundlesBookmarked(offset, limit, with_liked),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

export const usePublishBundle = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const publishBundleMutation = useMutation({
    mutationFn: uploadBundle,
    onSuccess: (data, bundle) => {
      queryClient.invalidateQueries({
        queryKey: ["user", "numOfBundlesPublished"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user", "bundlesPublished"],
      });

      toast.success("发布成功");
      router.push(`/bundle/preview/${data.id}`);
    },
  });

  return (bundle: BundleIF) => publishBundleMutation.mutate(bundle);
};

export const useUpdateBundle = () => {
  const queryClient = useQueryClient();
  // const router = useRouter();

  const updateBundleMutation = useMutation({
    mutationFn: updateBundle,
    onSuccess: (data, bundle) => {
      queryClient.invalidateQueries({
        queryKey: ["bundle", bundle.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["user", "bundlesPublished"],
      });

      toast.success("更新成功");
      // router.push(`/bundle/preview/${data.id}`);
    },
  });

  return (bundle: BundleIF) => updateBundleMutation.mutate(bundle);
};

export const useDeleteBundle = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteBundleMutation = useMutation({
    mutationFn: deleteBundle,
    onSuccess: (data, id) => {
      queryClient.removeQueries({
        queryKey: ["bundle", id],
      });
      queryClient.removeQueries({
        queryKey: ["numOfLikes", id],
      });
      queryClient.removeQueries({
        queryKey: ["user", "liked", id],
      });
      queryClient.removeQueries({
        queryKey: ["user", "bookmarked", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["user", "numOfBundlesPublished"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user", "bundlesPublished"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user", "numOfBundlesLiked"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user", "bundlesLiked"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user", "numOfBundlesBookmarked"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user", "bundlesBookmarked"],
      });

      toast.success("删除成功");
      router.push(`/account`);
    },
  });

  return (id: string) => deleteBundleMutation.mutate(id);
};
