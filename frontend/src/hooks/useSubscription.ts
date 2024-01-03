import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getSubscriptionOptions, getSubscriptions } from "@/utils/subscription";
import { SubscriptionOptionIF, SubscriptionIF } from "@/interfaces";

export const useSubscriptionOptions = () =>
  useQuery<SubscriptionOptionIF[]>({
    queryKey: ["subscriptionOptions"],
    queryFn: async () => await getSubscriptionOptions(),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

export const useSubscriptions = (offset: number, limit: number) =>
  useQuery<SubscriptionIF[]>({
    queryKey: ["user", "subscriptions", offset, limit],
    queryFn: async () => await getSubscriptions(offset, limit),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
