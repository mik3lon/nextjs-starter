import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    // Only apply the middleware to routes under /admin
    if (req.nextUrl.pathname.startsWith('/admin')) {
        // Retrieve the token from cookies
        const sessionToken = req.cookies.get('next-auth.session-token')?.value;

        if (!sessionToken) {
            return NextResponse.redirect(new URL('/auth/signin', req.url));
        }

        // Optionally, verify token properties here if needed (e.g., ttl, refreshTtl)
        // Proceed if token exists
    }

    // Allow request to proceed if route is not protected or token is present
    return NextResponse.next();
}
