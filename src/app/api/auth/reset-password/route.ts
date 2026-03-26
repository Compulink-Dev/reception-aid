import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body: unknown = await request.json()

    const token = typeof body === 'object' && body !== null && 'token' in body ? (body as any).token : null
    const password =
      typeof body === 'object' && body !== null && 'password' in body ? (body as any).password : null

    const normalizedToken = typeof token === 'string' ? token.trim() : ''
    const normalizedPassword = typeof password === 'string' ? password : ''

    if (!normalizedToken) {
      return NextResponse.json({ success: false, error: 'Reset token is required' }, { status: 400 })
    }
    if (!normalizedPassword || normalizedPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 },
      )
    }

    const result = await payload.resetPassword({
      collection: 'users',
      data: {
        token: normalizedToken,
        password: normalizedPassword,
      },
      overrideAccess: false,
    })

    const response = NextResponse.json({
      success: true,
      message: 'Password reset successful',
    })

    // Mirror login behavior so middleware can recognize the session immediately.
    if (result?.token && typeof result?.user === 'object' && result.user !== null) {
      response.cookies.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7200,
        path: '/',
      })

      response.cookies.set(
        'user',
        JSON.stringify({
          id: (result.user as any).id,
          email: (result.user as any).email,
          name: (result.user as any).name,
          role: (result.user as any).role,
        }),
        {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7200,
          path: '/',
        },
      )
    }

    return response
  } catch (error) {
    console.error('Error in /api/auth/reset-password:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reset password',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

