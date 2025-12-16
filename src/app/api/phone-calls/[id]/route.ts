// app/api/phone-calls/[id]/route.ts
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
    const { id } = await params

    const phoneCall = await payload.findByID({
      collection: 'phone-calls',
      id,
      depth: 1,
    })

    return NextResponse.json({
      success: true,
      data: phoneCall,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Phone call not found',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 404 },
    )
  }
}

// PATCH/PUT - Update phone call
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { id } = await params

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
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update phone call',
        details: error instanceof Error ? error.message : String(error),
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

    await payload.delete({
      collection: 'phone-calls',
      id,
    })

    return NextResponse.json({
      success: true,
      message: 'Phone call deleted successfully',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete phone call',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
