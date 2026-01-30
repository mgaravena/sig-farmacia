import { auth } from "./lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // IMPORTANTE: Permitir todas las rutas de API de next-auth
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Permitir rutas públicas
  const isPublicRoute =
      pathname === "/" ||
      pathname.startsWith("/auth/");

  // Si no está logueado y trata de acceder a ruta protegida
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};