//@ts-nocheck
// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body: unknown = await request.json()

    const name =
      typeof body === 'object' && body !== null && 'name' in body ? (body as any).name : undefined
    const email =
      typeof body === 'object' && body !== null && 'email' in body ? (body as any).email : undefined
    const password =
      typeof body === 'object' && body !== null && 'password' in body ? (body as any).password : undefined

    const role =
      typeof body === 'object' && body !== null && 'role' in body ? (body as any).role : undefined

    const normalizedName = typeof name === 'string' ? name.trim() : ''
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    const normalizedPassword = typeof password === 'string' ? password : ''

    const allowedRoles = ['admin', 'reception', 'security', 'employee']
    const normalizedRole =
      typeof role === 'string' && allowedRoles.includes(role) ? (role as string) : undefined

    if (!normalizedName || !normalizedEmail || !normalizedPassword) {
      return NextResponse.json(
        { success: false, error: 'name, email, and password are required' },
        { status: 400 },
      )
    }

    const result = await payload.create({
      collection: 'users',
      data: {
        email: normalizedEmail,
        password: normalizedPassword,
        name: normalizedName,
        ...(normalizedRole ? { role: normalizedRole } : {}),
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
