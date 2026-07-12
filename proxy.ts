import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname.startsWith("/login");
  const isAuthApi = req.nextUrl.pathname.startsWith("/api/auth");
  const isPublicPage = req.nextUrl.pathname === "/";

  if (isAuthApi || isPublicPage) return;

  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
});

export const config = {
  // Pomijamy zasoby statyczne i API Next.js - reszta ścieżek przechodzi
  // przez sprawdzenie zalogowania powyżej.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};