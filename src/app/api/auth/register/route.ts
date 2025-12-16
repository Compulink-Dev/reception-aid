//@ts-nocheck
// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const data = await request.json()

    const result = await payload.create({
      collection: 'users',
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: {
          id: result.id,
          email: result.email,
          name: result.name,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 })
  }
}
