// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { email, password } = await request.json()

    const result = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })

    // Create session/token for the user
    // You might want to use JWT or cookies for session management
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        token: result.token || 'dummy-token-for-demo', // In real app, generate proper token
      },
    })
  } catch (error) {
    console.error('Error logging in:', error)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}
