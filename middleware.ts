// middleware.ts - UPDATED
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('payload-token')?.value
  const user = request.cookies.get('user')?.value

  const { pathname } = request.nextUrl

  // 1. ALLOW PAYLOAD ADMIN ROUTES THROUGH WITHOUT AUTH CHECK
  // Payload CMS has its own authentication system
  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // 2. Allow Payload API routes
  if (pathname.startsWith('/api/payload')) {
    return NextResponse.next()
  }

  // 3. Public paths that don't require authentication
  const publicPaths = [
    '/signin',
    '/register',
    '/api/users/login',
    '/api/visitors', // Allow visitor API
    '/api/debug', // Allow debug endpoints
  ]

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  if (isPublicPath) {
    return NextResponse.next()
  }

  // 4. If no token and trying to access protected route, redirect to signin
  if (!token && !isPublicPath) {
    const signinUrl = new URL('/signin', request.url)
    signinUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(signinUrl)
  }

  // 5. Role-based access control (only for your custom app, not Payload)
  if (user) {
    try {
      const userData = JSON.parse(user)

      // Security routes - only security role can access
      if (pathname.startsWith('/security') && userData.role !== 'security') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      // Reception routes - only reception and admin can access
      if (pathname.startsWith('/reception') && !['reception', 'admin'].includes(userData.role)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      // Admin routes - only admin can access
      // Note: This is for YOUR /admin routes, not Payload's /admin
      if (pathname.startsWith('/dashboard/admin') && userData.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    } catch (error) {
      // Invalid user data, redirect to signin
      return NextResponse.redirect(new URL('/signin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/trpc (leave this to tRPC)
     * 2. /_next/static (static files)
     * 3. /_next/image (image optimization files)
     * 4. /favicon.ico (favicon file)
     * 5. /public (public files)
     */
    '/((?!api/trpc|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
