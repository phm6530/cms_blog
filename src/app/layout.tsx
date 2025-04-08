import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "@/provider/client-provider";
import Nav from "@/components/layout/nav";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/layout/footer";
import SideArea from "@/components/slide-area";

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
      <body className={` antialiased`}>
        <ClientProvider>
          <Nav />
          <main className="grid-layout grid grid-cols-[2fr_8fr] gap-16 pt-20">
            <SideArea />
            <div>{children}</div>
          </main>
          <Toaster />
          <Footer />
        </ClientProvider>
      </body>
    </html>
  );
}
