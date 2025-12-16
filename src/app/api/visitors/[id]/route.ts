// app/api/visitors/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

interface RouteParams {
  params: Promise<{ id: string }>
}
// PUT - Update single visitor
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const data = await request.json()
    const { id } = await params

    console.log('Updating visitor ID:', id, 'with data:', data)

    const updateData: any = { ...data }

    if (
      data.employeeToMeet &&
      typeof data.employeeToMeet === 'string' &&
      data.employeeToMeet.length === 24
    ) {
      updateData.employeeToMeet = data.employeeToMeet
    } else if (data.employeeToMeet) {
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

    const result = await payload.update({
      collection: 'visitors',
      id,
      data: updateData,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating visitor:', error)

    if (error instanceof Error && error.message.includes('BSONError')) {
      return NextResponse.json(
        {
          error: 'Invalid ID format',
          message: 'The visitor ID must be a valid MongoDB ObjectId',
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to update visitor',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params

    console.log('Deleting visitor ID:', id)

    await payload.delete({
      collection: 'visitors',
      id: id,
    })

    return NextResponse.json({
      success: true,
      message: 'Visitor deleted successfully',
      deletedId: id,
    })
  } catch (error) {
    console.error('Error deleting visitor:', error)

    if (error instanceof Error && error.message.includes('BSONError')) {
      return NextResponse.json(
        {
          error: 'Invalid ID format',
          message: 'The visitor ID must be a valid MongoDB ObjectId',
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to delete visitor',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params

    const result = await payload.findByID({
      collection: 'visitors',
      id: id,
      depth: 1, // Populate relationships
    })

    if (!result) {
      return NextResponse.json({ error: 'Visitor not found' }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching visitor:', error)

    if (error instanceof Error && error.message.includes('BSONError')) {
      return NextResponse.json(
        {
          error: 'Invalid ID format',
          message: 'The visitor ID must be a valid MongoDB ObjectId',
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch visitor',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
