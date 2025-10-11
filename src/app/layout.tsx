import type { Metadata } from "next";
import "./globals.css";
import "../styles/editor.css";
import ClientProvider from "@/provider/client-provider";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/layout/footer";
import MouseClickEffect from "@/components/shared/mouse-clickeffect";
import GlobalNav from "@/components/layout/global-nav";
import { Analytics } from "@vercel/analytics/react";
import { auth } from "@/auth";
import HeaderNav from "@/components/layout/header-nav";

export const metadata: Metadata = {
  title: "퍼블리셔와 개발자 그 어딘가",
  description: "퍼블리셔와 개발자 그 어딘가",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <div id="backdrop-portal"></div>{" "}
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <Analytics />
            <ClientProvider session={session}>
              <MouseClickEffect>
                <GlobalNav />
                <div className="grid-layout pt-15">{children}</div>
                <Toaster />
                <Footer />
              </MouseClickEffect>
              <div className="block md:hidden">
                <HeaderNav />
              </div>
            </ClientProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
