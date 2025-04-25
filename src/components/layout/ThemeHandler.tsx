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
      className="size-10 rounded-full md:ml-0 ml-auto bg-transparent!"
    >
      {curTheme === "dark" ? <Moon /> : <Sun />}
    </Button>
  );
}
