import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body: unknown = await request.json()

    const email = typeof body === 'object' && body !== null && 'email' in body ? (body as any).email : null
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''

    if (!normalizedEmail) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    // For now we disable email delivery because this repo may not be configured with an email adapter.
    // Payload still generates and stores a reset token, which we return to the client for the reset flow.
    const token = await payload.forgotPassword({
      collection: 'users',
      data: { email: normalizedEmail },
      disableEmail: true,
    })

    return NextResponse.json({
      success: true,
      token, // string | null (null when user not found)
      message: 'If the account exists, a password reset token has been generated.',
    })
  } catch (error) {
    console.error('Error in /api/auth/forgot-password:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate password reset token',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

