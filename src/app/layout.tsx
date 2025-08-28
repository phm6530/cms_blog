import type { Metadata } from "next";
import "./globals.css";
import "../styles/editor.css";

import ClientProvider from "@/provider/client-provider";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/layout/footer";
import SideArea from "@/components/slide-area";
import MouseClickEffect from "@/components/shared/mouse-clickeffect";
import HeaderNav from "@/components/layout/header-nav";
import GlobalNav from "@/components/layout/global-nav";
import MainLayout from "@/components/layout/main-layout";
import { Analytics } from "@vercel/analytics/react";
import { auth } from "@/auth";

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
  console.log("세션 ~ ", session);
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div id="backdrop-portal"></div>
        <Analytics />
        <ClientProvider session={session}>
          <MouseClickEffect>
            <HeaderNav />
            <GlobalNav />

            <MainLayout>
              <SideArea />

              <div className="w-full ">{children}</div>
            </MainLayout>

            <Toaster />
            <Footer />
          </MouseClickEffect>
        </ClientProvider>
      </body>
    </html>
  );
}
