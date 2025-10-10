"use client";

import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Sun, Moon } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";

export default function ThemeHandler() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 클라이언트에서만 렌더링되도록 보장
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  // 서버 사이드에서는 중립적인 UI 표시 (hydration mismatch 방지)
  if (!mounted) {
    return (
      <Button
        variant={"outline"}
        className="size-10 rounded-full md:ml-0 ml-auto bg-transparent!"
        disabled
      >
        {/* <Sun className="opacity-0" /> */}
      </Button>
    );
  }

  const curTheme = theme === "light" ? "dark" : "light";

  return (
    <Button
      onClick={() => setTheme(curTheme)}
      variant={"outline"}
      className="size-10 rounded-full md:ml-0 ml-auto bg-transparent!"
      aria-label={`Switch to ${curTheme} mode`}
    >
      {curTheme === "dark" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}
