// app/api/vehicles/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Get single travel log
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const data = await request.json()
    const { id } = await params

    const vehicle = await payload.update({
      collection: 'vehicles',
      id,
      data,
    })

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error updating vehicle:', error)
    return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 })
  }
}
