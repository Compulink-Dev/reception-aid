// app/api/parcels/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

// GET - List all parcels
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const searchParams = request.nextUrl.searchParams

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const where: any = {}

    if (status) {
      where.status = { equals: status }
    }

    if (search) {
      where.or = [
        { sender: { contains: search } },
        { description: { contains: search } },
        { trackingNumber: { contains: search } },
      ]
    }

    if (dateFrom || dateTo) {
      where.receivedAt = {}
      if (dateFrom) {
        where.receivedAt.greater_than_equal = new Date(dateFrom).toISOString()
      }
      if (dateTo) {
        const endDate = new Date(dateTo)
        endDate.setHours(23, 59, 59, 999)
        where.receivedAt.less_than_equal = endDate.toISOString()
      }
    }

    const result = await payload.find({
      collection: 'parcel-logs',
      where: Object.keys(where).length > 0 ? where : undefined,
      page,
      limit,
      sort: '-receivedAt',
      depth: 1,
    })

    return NextResponse.json({
      success: true,
      data: result.docs,
      pagination: {
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page,
        limit: result.limit,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    })
  } catch (error) {
    console.error('Error fetching parcels:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch parcels',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// POST - Create new parcel
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Parse and validate JSON body
    let body
    try {
      body = await request.json()
    } catch (jsonError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
          details: 'Request body must be valid JSON',
        },
        { status: 400 },
      )
    }

    // Validate required fields
    if (!body.sender || !body.senderType || !body.recipient || !body.description) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          details: 'sender, senderType, recipient, and description are required',
        },
        { status: 400 },
      )
    }

    // Validate recipient is a valid ObjectID (24 character hex string)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/
    if (!objectIdRegex.test(body.recipient)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid recipient ID',
          details: 'Recipient must be a valid employee ID (24 character hex string)',
        },
        { status: 400 },
      )
    }

    const parcel = await payload.create({
      collection: 'parcel-logs',
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: parcel,
      message: 'Parcel logged successfully',
    })
  } catch (error) {
    console.error('Error creating parcel:', error)

    // Handle specific MongoDB/BSON errors
    if (error instanceof Error && error.message.includes('BSONError')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid ID format',
          details:
            'One or more relationship fields contain invalid IDs. Please ensure all IDs are valid 24-character hex strings.',
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create parcel',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
