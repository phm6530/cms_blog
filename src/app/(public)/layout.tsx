import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return <div className=" mx-auto">{children}</div>;
}
