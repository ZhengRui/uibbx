import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { getSubscriptionOptions } from "@/utils/subscription";
import { SubscriptionOption } from "@/interfaces";

export const useSubscriptionOptions = () =>
  useQuery<SubscriptionOption[]>({
    queryKey: ["subscriptionOptions"],
    queryFn: async () => await getSubscriptionOptions(),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
