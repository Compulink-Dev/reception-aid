// app/api/payload/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = request.nextUrl

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const date = searchParams.get('date')
    const employee = searchParams.get('employee')
    const search = searchParams.get('search')
    const upcoming = searchParams.get('upcoming')

    // Build query
    const query: any = {}

    if (status && status !== 'all') {
      query.status = { equals: status }
    }

    if (date) {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)

      query.scheduledTime = {
        greater_than_equal: startDate,
        less_than_equal: endDate,
      }
    }

    if (employee) {
      query.employeeToMeet = { equals: employee }
    }

    if (upcoming === 'true') {
      query.scheduledTime = { greater_than_equal: new Date() }
      query.status = { in: ['scheduled', 'confirmed'] }
    }

    if (search) {
      query.or = [
        { visitorName: { contains: search } },
        { company: { contains: search } },
        { email: { contains: search } },
        { purpose: { contains: search } },
      ]
    }

    // Fetch appointments
    const result = await payload.find({
      collection: 'appointments',
      where: query,
      page,
      limit,
      sort: 'scheduledTime',
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
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointments' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const data = await request.json()

    // Validate required fields
    const requiredFields = [
      'visitorName',
      'company',
      'email',
      'phone',
      'purpose',
      'employeeToMeet',
      'scheduledTime',
    ]
    const missingFields = requiredFields.filter((field) => !data[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 },
      )
    }

    // Create appointment
    const appointment = await payload.create({
      collection: 'appointments',
      data: {
        ...data,
        duration: data.duration || 60,
        status: data.status || 'pending',
      },
    })

    return NextResponse.json({
      success: true,
      data: appointment,
      message: 'Appointment scheduled successfully',
    })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create appointment' },
      { status: 500 },
    )
  }
}
