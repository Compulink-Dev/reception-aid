// src/app/api/appointments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params

    const appointment = await payload.findByID({
      collection: 'appointments',
      id,
    })

    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: appointment,
    })
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointment' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params
    const data = await request.json()

    // Get current appointment
    const currentAppointment = await payload.findByID({
      collection: 'appointments',
      id,
    })

    if (!currentAppointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 })
    }

    // Handle check-in
    if (data.action === 'check-in') {
      data.visitorArrived = true
      data.status = 'completed'
      data.checkInTime = new Date().toISOString()
    }

    // Handle check-out
    if (data.action === 'check-out') {
      data.checkOutTime = new Date().toISOString()
    }

    // Remove action property before updating
    const { action, ...updateData } = data

    // Update appointment
    const updatedAppointment = await payload.update({
      collection: 'appointments',
      id,
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      data: updatedAppointment,
      message: 'Appointment updated successfully',
    })
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update appointment' },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params

    await payload.delete({
      collection: 'appointments',
      id,
    })

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete appointment' },
      { status: 500 },
    )
  }
}
