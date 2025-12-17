// app/api/visitors/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

interface RouteParams {
  params: Promise<{ id: string }>
}

// In your GET function in app/api/visitors/[id]/route.ts
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params

    console.log('Fetching visitor with ID:', id) // Debug log

    if (!id || id === 'undefined') {
      return NextResponse.json(
        {
          success: false,
          message: 'Visitor ID is required',
        },
        { status: 400 },
      )
    }

    const result = await payload.findByID({
      collection: 'visitors',
      id: id,
      depth: 1, // Populate relationships
    })

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: 'Visitor not found',
        },
        { status: 404 },
      )
    }

    // Transform the data to match your frontend interface
    const transformedData = {
      ...result,
      _id: result.id, // Add _id field for compatibility
    }

    return NextResponse.json({
      success: true,
      data: transformedData, // Use transformed data
    })
  } catch (error: any) {
    console.error('Error fetching visitor:', error)

    if (error.name === 'NotFound' || error.status === 404) {
      return NextResponse.json(
        {
          success: false,
          message: 'Visitor not found',
        },
        { status: 404 },
      )
    }

    if (error.message.includes('BSONError')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid ID format',
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching visitor',
      },
      { status: 500 },
    )
  }
}

// PATCH - Update single visitor (using PATCH instead of PUT)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const data = await request.json()
    const { id } = await params

    console.log('Patching visitor ID:', id, 'with data:', data)

    if (!id || id === 'undefined') {
      return NextResponse.json(
        {
          success: false,
          message: 'Visitor ID is required',
        },
        { status: 400 },
      )
    }

    const updateData: any = { ...data }

    // Handle employeeToMeet field
    if (data.employeeToMeet) {
      if (typeof data.employeeToMeet === 'string' && data.employeeToMeet.length === 24) {
        // It's already a MongoDB ID
        updateData.employeeToMeet = data.employeeToMeet
      } else if (typeof data.employeeToMeet === 'object' && data.employeeToMeet.id) {
        // It's an object with an id property
        updateData.employeeToMeet = data.employeeToMeet.id
      } else if (typeof data.employeeToMeet === 'string') {
        // It's a name, find the employee
        const employees = await payload.find({
          collection: 'employees',
          where: {
            name: {
              equals: data.employeeToMeet,
            },
          },
          limit: 1,
        })

        updateData.employeeToMeet = employees.docs.length > 0 ? employees.docs[0].id : null
      }
    }

    const result = await payload.update({
      collection: 'visitors',
      id,
      data: updateData,
      depth: 1,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error('Error updating visitor:', error)

    if (error.name === 'NotFound' || error.status === 404) {
      return NextResponse.json(
        {
          success: false,
          message: 'Visitor not found',
        },
        { status: 404 },
      )
    }

    if (error.message.includes('BSONError')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid ID format',
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Error updating visitor',
      },
      { status: 500 },
    )
  }
}

// DELETE - Delete single visitor
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params

    console.log('Deleting visitor ID:', id)

    if (!id || id === 'undefined') {
      return NextResponse.json(
        {
          success: false,
          message: 'Visitor ID is required',
        },
        { status: 400 },
      )
    }

    const result = await payload.delete({
      collection: 'visitors',
      id: id,
    })

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: 'Visitor not found',
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Visitor deleted successfully',
      data: { id: result.id },
    })
  } catch (error: any) {
    console.error('Error deleting visitor:', error)

    if (error.name === 'NotFound' || error.status === 404) {
      return NextResponse.json(
        {
          success: false,
          message: 'Visitor not found',
        },
        { status: 404 },
      )
    }

    if (error.message.includes('BSONError')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid ID format',
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting visitor',
      },
      { status: 500 },
    )
  }
}

// PUT - For complete replacement (optional, if needed)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const data = await request.json()
    const { id } = await params

    console.log('Replacing visitor ID:', id, 'with data:', data)

    if (!id || id === 'undefined') {
      return NextResponse.json(
        {
          success: false,
          message: 'Visitor ID is required',
        },
        { status: 400 },
      )
    }

    const result = await payload.update({
      collection: 'visitors',
      id,
      data,
      depth: 1,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error('Error replacing visitor:', error)

    if (error.name === 'NotFound' || error.status === 404) {
      return NextResponse.json(
        {
          success: false,
          message: 'Visitor not found',
        },
        { status: 404 },
      )
    }

    if (error.message.includes('BSONError')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid ID format',
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Error replacing visitor',
      },
      { status: 500 },
    )
  }
}
