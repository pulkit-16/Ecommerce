import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verifyAuth } from './lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value; // Access the token from cookies
  
  let verifiedToken = null;
  if (token) {
    try {
      verifiedToken = await verifyAuth(token);
      console.log('Token verification successful:', verifiedToken);
    } catch (err) {
      console.log('Token verification failed:', err);
    }
  }

  if (request.nextUrl.pathname.startsWith('/login') && !verifiedToken) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/register') && !verifiedToken) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/verifyOtp') && !verifiedToken) {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname.startsWith('/verifyOtp') && verifiedToken) {
    return NextResponse.redirect(new URL('/categories', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/login') && verifiedToken) {
    return NextResponse.redirect(new URL('/categories', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/register') && verifiedToken) {
    return NextResponse.redirect(new URL('/categories', request.url));
  }

  if (!verifiedToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
 
  return NextResponse.next();
}

export const config = {
  matcher: ['/categories', '/login', '/register', '/verifyOtp'], // Apply middleware to these paths
};
