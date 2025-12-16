// app/api/clients/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params // Await the params promise

    const client = await payload.findByID({
      collection: 'clients',
      id: id,
      depth: 1,
    })

    return NextResponse.json({
      success: true,
      data: client,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Client not found',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 404 },
    )
  }
}

// PATCH - Update client
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params // Await the params promise
    const body = await request.json()

    const client = await payload.update({
      collection: 'clients',
      id: id,
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: client,
      message: 'Client updated successfully',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update client',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// DELETE - Delete client
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params // Await the params promise

    await payload.delete({
      collection: 'clients',
      id: id,
    })

    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete client',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
