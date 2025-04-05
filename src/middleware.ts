import { NextRequest, NextResponse } from "next/server";

const AUTH_REDIRECT_PATHS = ["/login"] as const;
const AUTH_REQUIRED_PATHS = ["/made", "/mypage", "/write"] as const;

type Pathname = (typeof AUTH_REDIRECT_PATHS)[number];

export async function middleware(req: NextRequest, _res: NextResponse) {
  const pathname = req.nextUrl.pathname as Pathname;

  // get Token
  const token = req.cookies.get("authjs.session-token")?.value;

  //로그인 페이지인데 로그인 되어있을때 ReDirect 시켜버리기
  if (AUTH_REDIRECT_PATHS.includes(pathname) && token) {
    const path = "/";
    return NextResponse.redirect(new URL(path, req.nextUrl.origin));
  }

  const authPath = AUTH_REQUIRED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (authPath) {
    const encodedPath = encodeURIComponent(pathname);
    const redirectPath = `/auth/login?redirect=${encodedPath}}`;
    //권한이 필요 한페이지인데 TOken이 없을떄 ,
    if (!token)
      return NextResponse.redirect(new URL(redirectPath, req.nextUrl.origin));
  }
}

export const config = {
  matcher: ["/login", "/write"],
};
