"use client";

import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Sun, Moon } from "lucide-react";

export default function ThemeHandler() {
  const { theme, setTheme } = useTheme();
  const curTheme = theme === "light" ? "dark" : "light";

  return (
    <Button
      onClick={() => setTheme(curTheme)}
      variant={"outline"}
      className="size-12 rounded-full ml-auto"
    >
      {curTheme === "dark" ? <Moon /> : <Sun />}
    </Button>
  );
}
