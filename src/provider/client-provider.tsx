import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      enableSystem={false}
      defaultTheme="dark"
      enableColorScheme={false}
    >
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
