import { ReactNode } from "react";

export default function Grid({ children }: { children: ReactNode }) {
  return <div className="w-[1200px] mx-auto">{children}</div>;
}
