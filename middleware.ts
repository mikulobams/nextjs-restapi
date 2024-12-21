import { NextResponse } from "next/server";

export const config = {
  matcher: "/api/:path*",
};

export default function middleware(req: Request) {
  return NextResponse.next();
}
