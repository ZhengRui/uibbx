"use client";
import toast from "react-hot-toast";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: string | Error | { msg: string }[], query) => {
      toast.error(
        `错误: ${
          query.meta?.errorMessage ||
          (error instanceof Error
            ? error.message
            : typeof error === "string"
            ? error
            : error[0].msg)
        }`
      );
    },
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
