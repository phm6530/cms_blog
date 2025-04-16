import type { Metadata } from "next";
import "./globals.css";
import "./output.css";
import ClientProvider from "@/provider/client-provider";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/layout/footer";
import SideArea from "@/components/slide-area";
import MouseClickEffect from "@/components/shared/mouse-clickeffect";
import HeaderNav from "@/components/layout/header-nav";
import GlobalNav from "@/components/layout/global-nav";

export const metadata: Metadata = {
  title: "퍼블리셔와 개발자 그 어딘가",
  description: "퍼블리셔와 개발자 그 어딘가",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientProvider>
          <MouseClickEffect>
            <HeaderNav />
            <GlobalNav />
            <main className="grid-layout">
              <div className="grid grid-cols-[250px_auto]  gap-10  ">
                {/* slide bar */}
                <SideArea />

                <div className="pt-10 w-full ">{children}</div>
              </div>
            </main>
            <Toaster />
            <Footer />
          </MouseClickEffect>
        </ClientProvider>
      </body>
    </html>
  );
}
