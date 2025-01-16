import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl

    const isAuthRoute = publicRoutes.includes(pathname)

    if (token && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (!token && !publicRoutes.includes(pathname)) {
        const loginUrl = new URL('/login', request.url)
        if (pathname !== '/') {
            loginUrl.searchParams.set('callbackUrl', pathname)
        }
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
    ],
}