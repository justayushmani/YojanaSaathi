import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // If the user does not have a jwt cookie and is trying to access a protected route
  // Right now, this is a placeholder. You can define specific protected routes.
  const path = request.nextUrl.pathname;
  
  // Example of protecting a route like /dashboard
  // if (path.startsWith('/dashboard') && !request.cookies.has('jwt')) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
