// app/api/employees/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

// GET - List all employees
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const searchParams = request.nextUrl.searchParams

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const department = searchParams.get('department')
    const search = searchParams.get('search')
    const isActive = searchParams.get('isActive')

    const where: any = {}

    if (department) {
      where.department = { equals: department }
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = { equals: isActive === 'true' }
    }

    if (search) {
      where.or = [
        { name: { contains: search } },
        { email: { contains: search } },
        { employeeId: { contains: search } },
      ]
    }

    const result = await payload.find({
      collection: 'employees',
      where: Object.keys(where).length > 0 ? where : undefined,
      page,
      limit,
      sort: 'name',
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
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch employees',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// POST - Create new employee
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    const employee = await payload.create({
      collection: 'employees',
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: employee,
      message: 'Employee created successfully',
    })
  } catch (error) {
    console.error('Error creating employee:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create employee',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
