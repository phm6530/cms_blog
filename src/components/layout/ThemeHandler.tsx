"use client";

import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeHandler() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 클라이언트에서만 렌더링되도록 보장
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant={"outline"}
        className="size-8 rounded-full md:ml-0 ml-auto bg-transparent!"
        disabled
      ></Button>
    );
  }

  const curTheme = theme === "light" ? "dark" : "light";

  return (
    <Button
      onClick={() => setTheme(curTheme)}
      className="size-8 order-1 mr-1"
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
