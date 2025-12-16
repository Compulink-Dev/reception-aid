// app/api/employees/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params

    const employee = await payload.findByID({
      collection: 'employees',
      id,
    })

    return NextResponse.json({
      success: true,
      data: employee,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Employee not found',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 404 },
    )
  }
}

// PATCH - Update employee
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { id } = await params

    const employee = await payload.update({
      collection: 'employees',
      id,
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: employee,
      message: 'Employee updated successfully',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update employee',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// DELETE - Delete employee
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params
    await payload.delete({
      collection: 'employees',
      id,
    })

    return NextResponse.json({
      success: true,
      message: 'Employee deleted successfully',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete employee',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
