// app/api/parcels/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Get single parcel
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })

    const { id } = await params

    const parcel = await payload.findByID({
      collection: 'parcel-logs',
      id,
      depth: 1,
    })

    return NextResponse.json({
      success: true,
      data: parcel,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Parcel not found',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 404 },
    )
  }
}

// PATCH - Update parcel
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { id } = await params

    const parcel = await payload.update({
      collection: 'parcel-logs',
      id,
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: parcel,
      message: 'Parcel updated successfully',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update parcel',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// DELETE - Delete parcel
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params

    await payload.delete({
      collection: 'parcel-logs',
      id,
    })

    return NextResponse.json({
      success: true,
      message: 'Parcel deleted successfully',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete parcel',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
