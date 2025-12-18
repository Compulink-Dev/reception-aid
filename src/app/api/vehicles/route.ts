// app/api/vehicles/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')

    const where: any = {}

    if (search) {
      where.or = [
        { registrationNumber: { contains: search } },
        { ownerName: { contains: search } },
        { purpose: { contains: search } },
      ]
    }

    const vehicles = await payload.find({
      collection: 'vehicles',
      where: Object.keys(where).length > 0 ? where : undefined,
      sort: '-entryTime',
      page,
      limit,
    })

    return NextResponse.json({
      success: true,
      data: vehicles.docs,
      pagination: {
        totalDocs: vehicles.totalDocs,
        totalPages: vehicles.totalPages,
        page: vehicles.page,
        limit: vehicles.limit,
        hasNextPage: vehicles.hasNextPage,
        hasPrevPage: vehicles.hasPrevPage,
      },
    })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch vehicles' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const data = await request.json()

    console.log('Creating vehicle with data:', data)

    // Validate required fields
    if (!data.registrationNumber || !data.vehicleType || !data.ownerName) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing required fields: registrationNumber, vehicleType, and ownerName are required',
        },
        { status: 400 },
      )
    }

    // Create the vehicle record
    const vehicle = await payload.create({
      collection: 'vehicles',
      data: {
        registrationNumber: data.registrationNumber,
        vehicleType: data.vehicleType,
        ownerName: data.ownerName,
        ownerPhone: data.ownerPhone,
        purpose: data.purpose,
        entryTime: data.entryTime || new Date().toISOString(),
        currentMileage: data.currentMileage,
        notes: data.notes,
        securityGuard: data.securityGuard || 'Security Guard',
      },
    })

    console.log('Vehicle created successfully:', vehicle)

    return NextResponse.json(
      {
        success: true,
        data: vehicle,
        message: 'Vehicle checked in successfully',
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating vehicle:', error)

    // Handle duplicate registration number error
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        {
          success: false,
          error: 'A vehicle with this registration number already exists',
        },
        { status: 409 },
      )
    }

    return NextResponse.json({ success: false, error: 'Failed to create vehicle' }, { status: 500 })
  }
}
