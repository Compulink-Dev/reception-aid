// app/api/visitors/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const searchParams = request.nextUrl.searchParams

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Filters
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = { equals: status }
    }

    if (search) {
      where.or = [
        { name: { contains: search } },
        { company: { contains: search } },
        { phone: { contains: search } },
      ]
    }

    if (dateFrom || dateTo) {
      where.checkInTime = {}
      if (dateFrom) {
        where.checkInTime.greater_than_equal = new Date(dateFrom).toISOString()
      }
      if (dateTo) {
        const endDate = new Date(dateTo)
        endDate.setHours(23, 59, 59, 999)
        where.checkInTime.less_than_equal = endDate.toISOString()
      }
    }

    const result = await payload.find({
      collection: 'visitors',
      where: Object.keys(where).length > 0 ? where : undefined,
      page,
      limit,
      sort: '-checkInTime',
      depth: 1,
    })

    // Transform the data to match your frontend interface
    const transformedData = result.docs.map((visitor: any) => ({
      ...visitor,
      _id: visitor.id, // Add _id field for compatibility with your frontend
      // Ensure other fields are properly structured
      checkInTime: visitor.checkInTime,
      checkOutTime: visitor.checkOutTime || null,
      createdAt: visitor.createdAt,
      updatedAt: visitor.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      data: transformedData, // Use transformed data
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
    console.error('Error fetching visitors:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch visitors',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Starting POST request to create visitor...')

    const payload = await getPayload({ config })
    console.log('Payload initialized successfully')

    const data = await request.json()
    console.log('Request data received:', JSON.stringify(data, null, 2))

    // Validate required fields
    if (!data.name || !data.phone || !data.purpose) {
      return NextResponse.json(
        {
          success: false, // Add success flag
          error: 'Missing required fields: name, phone, purpose are required',
        },
        { status: 400 },
      )
    }

    // Prepare data for Payload WITHOUT employeeToMeet initially
    const visitorData: any = {
      name: data.name,
      email: data.email || '',
      phone: data.phone,
      company: data.company || '',
      purpose: data.purpose,
      status: data.status || 'checked-in',
      checkInTime: data.checkInTime || new Date().toISOString(),
      checkOutTime: data.checkOutTime || null,
      notes: data.notes || '',
      badgeNumber: data.badgeNumber || '',
    }

    console.log('Creating visitor with data:', JSON.stringify(visitorData, null, 2))

    const result = await payload.create({
      collection: 'visitors',
      data: visitorData,
    })

    console.log('Visitor created successfully:', result.id)

    // If we have an employeeToMeet value, try to update it
    if (data.employeeToMeet && result.id) {
      try {
        // Try to find employee by name
        const employees = await payload.find({
          collection: 'employees',
          where: {
            name: {
              equals: data.employeeToMeet,
            },
          },
          limit: 1,
        })

        if (employees.docs.length > 0) {
          // Update the visitor with the employee ID
          await payload.update({
            collection: 'visitors',
            id: result.id,
            data: {
              employeeToMeet: employees.docs[0].id,
            },
          })
          console.log('Updated visitor with employee ID:', employees.docs[0].id)
        } else {
          // If employee not found, add as text to notes
          await payload.update({
            collection: 'visitors',
            id: result.id,
            data: {
              notes: `Requested to meet: ${data.employeeToMeet}. ${visitorData.notes || ''}`,
            },
          })
          console.log('Added employee name to notes:', data.employeeToMeet)
        }
      } catch (employeeError) {
        console.error('Error handling employee relationship:', employeeError)
        // Continue without failing the entire request
      }
    }

    // Fetch the updated visitor to return
    const updatedVisitor = await payload.findByID({
      collection: 'visitors',
      id: result.id,
      depth: 1,
    })

    // Transform the response to match your frontend interface
    const transformedVisitor = {
      ...updatedVisitor,
      _id: updatedVisitor.id, // Add _id field for compatibility
    }

    return NextResponse.json(
      {
        success: true, // Add success flag
        data: transformedVisitor,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('❌ Error creating visitor:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')

    // More detailed error info
    if (error instanceof Error && error.message.includes('BSONError')) {
      return NextResponse.json(
        {
          success: false, // Add success flag
          error: 'Database error',
          message: 'There was an issue with the database ID format',
          suggestion: 'Check if the employee ID is valid (24 character hex string)',
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        success: false, // Add success flag
        error: 'Failed to create visitor',
        message: error instanceof Error ? error.message : String(error),
        details:
          process.env.NODE_ENV === 'development'
            ? { stack: error instanceof Error ? error.stack : undefined }
            : undefined,
      },
      { status: 500 },
    )
  }
}
