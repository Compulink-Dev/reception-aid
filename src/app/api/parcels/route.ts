// app/api/parcels/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

// app/api/parcels/route.ts - Update the GET function
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
        { from: { contains: search } },
        { to: { contains: search } },
        { notes: { contains: search } },
        // Note: Cannot directly query nested array fields in Payload
        // We'll filter results client-side or use a different approach
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

    // If there's a search term, we need to filter results to include item descriptions
    let filteredDocs = result.docs
    if (search) {
      filteredDocs = result.docs.filter((parcel: any) => {
        // Check basic fields
        if (
          parcel.from?.toLowerCase().includes(search.toLowerCase()) ||
          parcel.to?.toLowerCase().includes(search.toLowerCase()) ||
          parcel.notes?.toLowerCase().includes(search.toLowerCase())
        ) {
          return true
        }

        // Check items and their serial numbers
        if (parcel.items && Array.isArray(parcel.items)) {
          for (const item of parcel.items) {
            // Check item description
            if (item.description?.toLowerCase().includes(search.toLowerCase())) {
              return true
            }

            // Check serial numbers
            if (item.serialNumbers && Array.isArray(item.serialNumbers)) {
              for (const serial of item.serialNumbers) {
                if (serial.serialNumber?.toLowerCase().includes(search.toLowerCase())) {
                  return true
                }
              }
            }
          }
        }

        return false
      })
    }

    return NextResponse.json({
      success: true,
      data: filteredDocs,
      pagination: {
        totalDocs: search ? filteredDocs.length : result.totalDocs,
        totalPages: search ? Math.ceil(filteredDocs.length / limit) : result.totalPages,
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

// app/api/parcels/route.ts - Update POST handler
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    // Validate required fields
    if (!body.from || !body.senderType || !body.to) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          details: 'from, senderType, and to are required',
        },
        { status: 400 },
      )
    }

    const parcel = await payload.create({
      collection: 'parcel-logs',
      data: {
        ...body,
        items: body.items || [],
      },
    })

    return NextResponse.json({
      success: true,
      data: parcel,
      message: 'Parcel logged successfully',
    })
  } catch (error) {
    console.error('Error creating parcel:', error)
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
