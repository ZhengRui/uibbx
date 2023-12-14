import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { whoami } from "@/utils/auth";

export const useAuth = () =>
  useQuery({
    queryKey: ["whoami"],
    queryFn: () => whoami(),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
