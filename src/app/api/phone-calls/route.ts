// app/api/phone-calls/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

// GET - List all phone calls
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const searchParams = request.nextUrl.searchParams

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const where: any = {}

    if (search) {
      where.or = [
        { callerName: { contains: search } },
        { callerNumber: { contains: search } },
        { purpose: { contains: search } },
        { 'employee.name': { contains: search } },
      ]
    }

    if (dateFrom || dateTo) {
      where.startTime = {}
      if (dateFrom) {
        where.startTime.greater_than_equal = new Date(dateFrom).toISOString()
      }
      if (dateTo) {
        const endDate = new Date(dateTo)
        endDate.setHours(23, 59, 59, 999)
        where.startTime.less_than_equal = endDate.toISOString()
      }
    }

    const result = await payload.find({
      collection: 'phone-calls',
      where: Object.keys(where).length > 0 ? where : undefined,
      page,
      limit,
      sort: '-startTime',
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
    console.error('Error fetching phone calls:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch phone calls',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// POST - Create new phone call
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    console.log('Creating phone call with data:', body)

    // Validate required fields
    if (!body.employee || !body.callerNumber || !body.purpose) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          details: 'employee, callerNumber, and purpose are required',
        },
        { status: 400 },
      )
    }

    // Validate employee is a valid ObjectID
    const objectIdRegex = /^[0-9a-fA-F]{24}$/
    if (typeof body.employee === 'string' && !objectIdRegex.test(body.employee)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid employee ID',
          details: 'Employee must be a valid employee ID (24 character hex string)',
        },
        { status: 400 },
      )
    }

    const phoneCall = await payload.create({
      collection: 'phone-calls',
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: phoneCall,
      message: 'Phone call logged successfully',
    })
  } catch (error) {
    console.error('Error creating phone call:', error)

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
        error: 'Failed to create phone call',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
