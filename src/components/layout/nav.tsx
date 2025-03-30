// Nav.tsx (서버 컴포넌트 유지)
import { cn } from "@/lib/utils";
import Link from "next/link";

const navlist = [
  {
    href: "/",
    name: "Home",
  },
  {
    href: "/login",
    name: "Login",
  },
];

export default function Nav() {
  return (
    <nav className="py-5 border-b mb-5 flex gap-5">
      {navlist.map((link, idx) => (
        <Link key={`${link.href}-${idx}`} href={link.href} className={cn("")}>
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
