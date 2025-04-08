"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";

const errorHandler = (error: Error) => {
  toast.warning(error.message, {
    style: {
      background: "#7f1d1d", // tailwind red-900
      color: "#fef2f2", // 거의 흰색에 가까운 연핑 (가독성 높음)
    },
  });
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: errorHandler,
  }),
  mutationCache: new MutationCache({
    onError: errorHandler,
  }),
});

export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        enableSystem={false}
        defaultTheme="dark"
        enableColorScheme={false}
      >
        <SessionProvider>{children}</SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
