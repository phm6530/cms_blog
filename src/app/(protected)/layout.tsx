import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }
  return <div className="mt-8">{children}</div>;
}
