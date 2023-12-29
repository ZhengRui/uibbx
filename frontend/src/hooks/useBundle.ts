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
} from "@/utils/bundle";
import { BundleIF } from "@/interfaces";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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

export const useBundlesPublished = (
  offset: number,
  limit: number,
  with_liked: boolean = false,
  with_bookmarked: boolean = false
) =>
  useQuery<BundleIF[]>({
    queryKey: [
      "whoami",
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
    queryKey: ["whoami", "bundlesLiked", offset, limit, with_bookmarked],
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
    queryKey: ["whoami", "bundlesBookmarked", offset, limit, with_liked],
    queryFn: async () => await getBundlesBookmarked(offset, limit, with_liked),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

export const usePublishBundle = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const publishBundleMutation = useMutation({
    mutationFn: uploadBundle,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: ["whoami", "numOfBundlesPublished"],
      });
      queryClient.invalidateQueries({
        queryKey: ["whoami", "bundlesPublished"],
      });

      toast.success("发布成功");
      router.push(`/bundle/preview/${data.id}`);
    },
  });

  return (bundle: BundleIF) => publishBundleMutation.mutate(bundle);
};

export const useUpdateBundle = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateBundleMutation = useMutation({
    mutationFn: updateBundle,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: ["whoami", "bundlesPublished"],
      });

      toast.success("更新成功");
      router.push(`/bundle/preview/${data.id}`);
    },
  });

  return (bundle: BundleIF) => updateBundleMutation.mutate(bundle);
};
