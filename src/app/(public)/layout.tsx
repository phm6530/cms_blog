import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[500px] mx-auto w-[calc(100%-10px)]">{children}</div>
  );
}
