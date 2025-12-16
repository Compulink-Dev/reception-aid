// app/api/debug/cookies/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const allCookies: Record<string, string> = {}

    cookieStore.getAll().forEach((cookie) => {
      allCookies[cookie.name] = cookie.value
    })

    // Also check request cookies
    const requestCookies: Record<string, string> = {}
    request.cookies.getAll().forEach((cookie) => {
      requestCookies[cookie.name] = cookie.value
    })

    return NextResponse.json({
      serverCookies: allCookies,
      requestCookies: requestCookies,
      headers: {
        cookie: request.headers.get('cookie'),
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: String(error),
      },
      { status: 500 },
    )
  }
}
