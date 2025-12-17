import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Get single phone call
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })

    // Await the params properly
    const resolvedParams = await params
    const { id } = resolvedParams

    console.log('🔍 [API] Fetching phone call with ID:', id)
    console.log('🔍 [API] Type of id:', typeof id)
    console.log('🔍 [API] ID length:', id?.length || 0)

    // Validate ID
    if (!id || id === 'undefined' || id === 'null' || id.trim() === '') {
      console.error('❌ [API] Invalid ID received:', id)
      return NextResponse.json(
        {
          success: false,
          message: 'Phone call ID is required',
          receivedId: id,
        },
        { status: 400 },
      )
    }

    // Validate MongoDB ObjectId format (24 hex chars)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/
    if (!objectIdRegex.test(id)) {
      console.error('❌ [API] Invalid ObjectId format:', id)
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid phone call ID format',
          details: 'ID must be a 24-character hex string',
          receivedId: id,
        },
        { status: 400 },
      )
    }

    console.log('🔍 [API] Attempting to fetch from Payload with ID:', id)

    const phoneCall = await payload.findByID({
      collection: 'phone-calls',
      id,
      depth: 1,
    })

    console.log('🔍 [API] Payload response:', phoneCall ? 'Found' : 'Not found')

    if (!phoneCall) {
      return NextResponse.json(
        {
          success: false,
          message: 'Phone call not found',
          receivedId: id,
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: phoneCall,
    })
  } catch (error: any) {
    console.error('❌ [API] Error fetching phone call:', error)
    console.error('❌ [API] Error name:', error.name)
    console.error('❌ [API] Error message:', error.message)

    if (error.name === 'NotFound' || error.status === 404) {
      return NextResponse.json(
        {
          success: false,
          message: 'Phone call not found',
        },
        { status: 404 },
      )
    }

    if (error.message.includes('BSONError') || error.message.includes('ObjectId')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid ID format',
          details: error.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching phone call',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}

// PATCH - Update phone call
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { id } = await params

    console.log('Updating phone call ID:', id, 'with data:', body)

    if (!id || id === 'undefined') {
      return NextResponse.json(
        {
          success: false,
          message: 'Phone call ID is required',
        },
        { status: 400 },
      )
    }

    const phoneCall = await payload.update({
      collection: 'phone-calls',
      id,
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: phoneCall,
      message: 'Phone call updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating phone call:', error)

    if (error.name === 'NotFound' || error.status === 404) {
      return NextResponse.json(
        {
          success: false,
          message: 'Phone call not found',
        },
        { status: 404 },
      )
    }

    if (error.message.includes('BSONError')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid ID format',
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Error updating phone call',
      },
      { status: 500 },
    )
  }
}

// DELETE - Delete phone call
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params

    console.log('Deleting phone call ID:', id)

    if (!id || id === 'undefined') {
      return NextResponse.json(
        {
          success: false,
          message: 'Phone call ID is required',
        },
        { status: 400 },
      )
    }

    const result = await payload.delete({
      collection: 'phone-calls',
      id: id,
    })

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: 'Phone call not found',
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Phone call deleted successfully',
      data: { id: result.id },
    })
  } catch (error: any) {
    console.error('Error deleting phone call:', error)

    if (error.name === 'NotFound' || error.status === 404) {
      return NextResponse.json(
        {
          success: false,
          message: 'Phone call not found',
        },
        { status: 404 },
      )
    }

    if (error.message.includes('BSONError')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid ID format',
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting phone call',
      },
      { status: 500 },
    )
  }
}

// PUT - For complete replacement
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { id } = await params

    console.log('Replacing phone call ID:', id, 'with data:', body)

    if (!id || id === 'undefined') {
      return NextResponse.json(
        {
          success: false,
          message: 'Phone call ID is required',
        },
        { status: 400 },
      )
    }

    const phoneCall = await payload.update({
      collection: 'phone-calls',
      id,
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: phoneCall,
    })
  } catch (error: any) {
    console.error('Error replacing phone call:', error)

    if (error.name === 'NotFound' || error.status === 404) {
      return NextResponse.json(
        {
          success: false,
          message: 'Phone call not found',
        },
        { status: 404 },
      )
    }

    if (error.message.includes('BSONError')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid ID format',
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Error replacing phone call',
      },
      { status: 500 },
    )
  }
}
