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
import { Session } from "next-auth";

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

export default function ClientProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        enableSystem={false}
        defaultTheme="dark"
        enableColorScheme={false}
      >
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <SessionProvider session={session}>{children}</SessionProvider>{" "}
          </div>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
