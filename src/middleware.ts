import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Just pass through for now - let Next.js handle routing
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
