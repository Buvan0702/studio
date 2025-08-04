import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/firebase';
import { AppUser } from './lib/types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

async function getUserRole(uid: string): Promise<AppUser['role'] | null> {
    try {
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            return userDocSnap.data().role || 'police';
        }
        return null;
    } catch (error) {
        console.error("Error fetching user role:", error);
        return null;
    }
}


export async function middleware(request: NextRequest) {
  const token = request.cookies.get('firebaseIdToken');
  const { pathname } = request.nextUrl

  const protectedRoutes = ['/dashboard', '/cases', '/admin'];
  const adminRoutes = ['/admin'];

  if (!token && protectedRoutes.some(path => pathname.startsWith(path))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  
  if (token) {
    if (pathname === '/login' || pathname === '/signup') {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    if (adminRoutes.some(path => pathname.startsWith(path))) {
        try {
            // This is a simplified token verification for middleware.
            // For production, consider using a more robust solution like `firebase-admin` on a backend.
            const decodedToken = JSON.parse(Buffer.from(token.value.split('.')[1], 'base64').toString());
            const userRole = await getUserRole(decodedToken.user_id);

            if (userRole !== 'admin') {
                const url = request.nextUrl.clone()
                url.pathname = '/dashboard'
                return NextResponse.redirect(url)
            }
        } catch (error) {
            console.error("Token verification failed:", error);
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
