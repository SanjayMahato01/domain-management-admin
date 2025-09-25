import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("token")?.value;

    if (
        pathname.startsWith("/_next") ||
        pathname.includes(".") ||
        pathname.startsWith("/api")
    ) {
    
        return NextResponse.next();
    }

    try {
        if (token) {
            jwt.verify(token, JWT_SECRET);
            
            if (pathname === "/login") {
            
                return NextResponse.redirect(new URL("/", req.url));
            }

            return NextResponse.next();
        } else {

            if (pathname !== "/login") {
                return NextResponse.redirect(new URL("/login", req.url));
            }

            return NextResponse.next();
        }
    } catch (err) {
     

        if (pathname !== "/login") {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/", "/dashboard", "/login"],
    runtime: "nodejs"
};
