"use client";

import { InputHTMLAttributes, useState, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

// forwardRef를 사용하여 ref 전달
const InputPassword = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  const [psView, setPsView] = useState<boolean>(false);

  const leaveToMouseHandler = () => {
    setPsView(false);
  };

  return (
    <div className="relative ">
      <Input
        ref={ref} // ref를 Input 컴포넌트로 전달
        autoComplete="off"
        type={psView ? "text" : "password"}
        className="w-full pr-10"
        {...props} // 나머지 속성은 그대로 전달
      />

      <div className="absolute h-full w-10 right-0 top-0 flex items-center justify-center">
        <div
          className="cursor-pointer text-input hover:text-muted-foreground"
          onMouseDown={() => setPsView(true)}
          onMouseUp={leaveToMouseHandler}
          onMouseLeave={leaveToMouseHandler}
        >
          {!psView ? (
            <Eye className="icon-hover" />
          ) : (
            <EyeOff className="icon-hover" />
          )}
        </div>
      </div>
    </div>
  );
});

InputPassword.displayName = "InputPassword";

export default InputPassword;
