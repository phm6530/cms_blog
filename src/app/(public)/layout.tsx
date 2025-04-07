import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return <div className="max-w-[800px] mx-auto">{children}</div>;
}
