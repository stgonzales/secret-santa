import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
 
export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/auth") || request.nextUrl.pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    const sessionCookie = getSessionCookie(request);

	if (!sessionCookie) {
		return NextResponse.redirect(new URL("/auth/signin", request.url));
	}
 
	return NextResponse.next();
}
 
export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|auth).*)"],
};