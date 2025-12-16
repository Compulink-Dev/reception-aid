// app/api/travel-logs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

// GET - List all travel logs
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
      where.or = [{ destination: { contains: search } }, { purpose: { contains: search } }]
    }

    if (dateFrom || dateTo) {
      where.departureTime = {}
      if (dateFrom) {
        where.departureTime.greater_than_equal = new Date(dateFrom).toISOString()
      }
      if (dateTo) {
        const endDate = new Date(dateTo)
        endDate.setHours(23, 59, 59, 999)
        where.departureTime.less_than_equal = endDate.toISOString()
      }
    }

    const result = await payload.find({
      collection: 'travel-logs',
      where: Object.keys(where).length > 0 ? where : undefined,
      page,
      limit,
      sort: '-departureTime',
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
    console.error('Error fetching travel logs:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch travel logs',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// POST - Create new travel log
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    // Validate required fields
    if (!body.employee || !body.destination || !body.purpose || !body.departureTime) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          details: 'employee, destination, purpose, and departureTime are required',
        },
        { status: 400 },
      )
    }

    // Validate employee is a valid ObjectID
    const objectIdRegex = /^[0-9a-fA-F]{24}$/
    if (!objectIdRegex.test(body.employee)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid employee ID',
          details: 'Employee must be a valid employee ID (24 character hex string)',
        },
        { status: 400 },
      )
    }

    const travelLog = await payload.create({
      collection: 'travel-logs',
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: travelLog,
      message: 'Travel log created successfully',
    })
  } catch (error) {
    console.error('Error creating travel log:', error)

    if (error instanceof Error && error.message.includes('BSONError')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid ID format',
          details: 'Employee ID must be a valid 24-character hex string',
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create travel log',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
