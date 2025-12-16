// app/api/employees/available/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const searchParams = request.nextUrl.searchParams

    const department = searchParams.get('department')
    const search = searchParams.get('search')

    const query: any = {
      isActive: { equals: true },
    }

    // Add department filter if provided
    if (department && department !== 'all') {
      query.department = { equals: department }
    }

    // Add search filter if provided
    if (search) {
      query.or = [
        { name: { contains: search, options: 'i' } },
        { email: { contains: search, options: 'i' } },
        { employeeId: { contains: search, options: 'i' } },
      ]
    }

    const employees = await payload.find({
      collection: 'employees',
      where: query,
      limit: 100,
      sort: 'name',
    })

    return NextResponse.json({
      success: true,
      data: employees.docs,
    })
  } catch (error: any) {
    console.error('Error fetching available employees:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch employees' },
      { status: 500 },
    )
  }
}
