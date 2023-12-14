"use client";
import toast from "react-hot-toast";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) =>
      toast.error(`错误: ${query.meta?.errorMessage || error.message}`),
  }),
});

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
