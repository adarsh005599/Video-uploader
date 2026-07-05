import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
      signOut: "/login",
    },
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        if (
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/login") ||
          pathname.startsWith("/register") ||
          pathname.startsWith("/_next")
        ) {
          return true;
        }

        if(pathname === "/" || pathname.startsWith("/api/videos")){
            return true;
        } 
        
        // Presence of a token means a valid session exists.
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/upload/:path*",
    "/profile/:path*",
  ],
};