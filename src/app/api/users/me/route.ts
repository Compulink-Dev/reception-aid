//@ts-nocheck
// app/api/users/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get the cookies from the request
    const cookieStore = await cookies()
    const payloadCookie = cookieStore.get('payload-token')

    if (!payloadCookie) {
      console.log('❌ No payload-token cookie found')
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    console.log('🔍 Found payload-token cookie')

    // Verify the token with Payload
    try {
      // Verify token by making a Payload API call
      const { user } = await payload.auth({
        collection: 'users',
        headers: request.headers,
      })

      if (!user) {
        console.log('❌ Token verification failed - no user found')
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }

      console.log('✅ User verified:', user.email)

      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      })
    } catch (authError) {
      console.error('❌ Auth error:', authError)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
  } catch (error) {
    console.error('❌ Error in /api/users/me:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
