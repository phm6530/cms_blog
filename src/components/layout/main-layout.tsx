"use client";

import { ReactNode } from "react";
import SideArea from "../slide-area";
// import { Button } from "../ui/button";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      {/* <SideArea /> */}

      <div>{children}</div>
    </main>
  );
}
