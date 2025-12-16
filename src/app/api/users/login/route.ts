//@ts-nocheck
// app/api/users/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  console.log('🚀 Login request received to /api/users/login')

  // Log headers for debugging
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    headers[key] = value
  })
  console.log('📋 Request headers:', {
    contentType: headers['content-type'],
    contentLength: headers['content-length'],
  })

  try {
    let email: string = ''
    let password: string = ''

    const contentType = headers['content-type'] || ''

    if (contentType.includes('multipart/form-data')) {
      console.log('📝 Handling multipart/form-data request')

      // Parse form data
      const formData = await request.formData()
      const payloadField = formData.get('_payload')

      if (payloadField && typeof payloadField === 'string') {
        console.log('📦 Found _payload field in form data')
        try {
          const payloadData = JSON.parse(payloadField)
          email = payloadData.email || ''
          password = payloadData.password || ''
          console.log('✅ Parsed JSON from _payload field:', {
            email,
            password: password ? '***' : 'empty',
          })
        } catch (parseError) {
          console.error('❌ Error parsing _payload field:', parseError)
          return NextResponse.json(
            {
              error: 'Invalid JSON in _payload field',
              details: parseError instanceof Error ? parseError.message : String(parseError),
            },
            { status: 400 },
          )
        }
      } else {
        // Try to get email and password directly from form data
        const formEmail = formData.get('email')
        const formPassword = formData.get('password')

        if (formEmail && formPassword) {
          email = formEmail.toString()
          password = formPassword.toString()
          console.log('✅ Got credentials from form fields:', {
            email,
            password: '***',
          })
        } else {
          console.log('❌ No valid credentials found in form data')
          return NextResponse.json({ error: 'No credentials found in form data' }, { status: 400 })
        }
      }
    } else if (contentType.includes('application/json')) {
      console.log('📝 Handling application/json request')

      // Parse JSON request
      const bodyText = await request.text()
      console.log('📦 Raw body text length:', bodyText.length)

      if (!bodyText || bodyText.trim() === '') {
        console.log('❌ Empty JSON request body')
        return NextResponse.json({ error: 'Request body is empty' }, { status: 400 })
      }

      try {
        const data = JSON.parse(bodyText)
        email = data.email || ''
        password = data.password || ''
        console.log('✅ Parsed JSON request:', {
          email,
          password: password ? '***' : 'empty',
        })
      } catch (parseError) {
        console.error('❌ Error parsing JSON:', parseError)
        return NextResponse.json(
          {
            error: 'Invalid JSON format',
            details: parseError instanceof Error ? parseError.message : String(parseError),
          },
          { status: 400 },
        )
      }
    } else {
      console.log('❌ Unsupported content type:', contentType)
      return NextResponse.json(
        {
          error: 'Unsupported Content-Type',
          supportedTypes: ['application/json', 'multipart/form-data'],
          received: contentType,
        },
        { status: 400 },
      )
    }

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password')
      return NextResponse.json(
        {
          error: 'Email and password are required',
          received: { email: !!email, password: !!password },
        },
        { status: 400 },
      )
    }

    console.log('🔑 Attempting login for:', email)

    try {
      const payload = await getPayload({ config })
      console.log('✅ Payload initialized')

      const result = await payload.login({
        collection: 'users',
        data: {
          email,
          password,
        },
      })

      console.log('🎉 Login successful for user:', email)

      // Create response with user data
      const response = NextResponse.json({
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
        },
        token: result.token,
        exp: result.exp,
      })

      // Set the payload-token cookie
      // This is crucial for subsequent authenticated requests
      response.cookies.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7200, // 2 hours (matching the tokenExpiration in Users collection)
        path: '/',
      })

      // Also set a user cookie for middleware role checks
      response.cookies.set(
        'user',
        JSON.stringify({
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
        }),
        {
          httpOnly: false, // Client needs to read this for role-based UI
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7200,
          path: '/',
        },
      )

      console.log('🍪 Cookies set: payload-token and user')

      return response
    } catch (loginError) {
      console.error('🔐 Payload login error:', loginError)

      // Check if it's an authentication error
      if (loginError instanceof Error) {
        const errorMsg = loginError.message.toLowerCase()
        if (
          errorMsg.includes('invalid') ||
          errorMsg.includes('not found') ||
          errorMsg.includes('incorrect')
        ) {
          return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
        }

        // Check if no users exist
        if (errorMsg.includes('no documents') || errorMsg.includes('empty')) {
          return NextResponse.json(
            {
              error: 'No users found in database',
              hint: 'Create a user first via Payload Admin panel',
            },
            { status: 404 },
          )
        }

        // Specific Payload CMS errors
        if (errorMsg.includes('lock')) {
          return NextResponse.json(
            {
              error: 'Account is locked',
              hint: 'Try again later or contact administrator',
            },
            { status: 423 },
          )
        }
      }

      return NextResponse.json(
        {
          error: 'Login failed',
          details: loginError instanceof Error ? loginError.message : String(loginError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('💥 Unexpected error in login:', error)
    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        details:
          process.env.NODE_ENV === 'development'
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 },
    )
  }
}
