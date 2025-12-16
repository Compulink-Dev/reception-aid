// app/api/travel-logs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Get single travel log
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params

    const travelLog = await payload.findByID({
      collection: 'travel-logs',
      id,
      depth: 1,
    })

    return NextResponse.json({
      success: true,
      data: travelLog,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Travel log not found',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 404 },
    )
  }
}

// PATCH - Update travel log
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { id } = await params

    const travelLog = await payload.update({
      collection: 'travel-logs',
      id,
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: travelLog,
      message: 'Travel log updated successfully',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update travel log',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// DELETE - Delete travel log
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params

    await payload.delete({
      collection: 'travel-logs',
      id,
    })

    return NextResponse.json({
      success: true,
      message: 'Travel log deleted successfully',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete travel log',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
