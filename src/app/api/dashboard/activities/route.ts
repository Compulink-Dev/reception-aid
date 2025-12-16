// app/api/dashboard/activities/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { format } from 'date-fns'

interface Activity {
  time: string
  activity: string
  type: 'visitor' | 'vehicle' | 'parcel' | 'travel' | 'call'
  timestamp: Date
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const activities: Activity[] = []

    // Get today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Fetch recent visitors
    const recentVisitors = await payload.find({
      collection: 'visitors',
      limit: 10,
      sort: '-checkInTime',
    })

    recentVisitors.docs.forEach((visitor) => {
      const checkInTime = visitor.checkInTime ? new Date(visitor.checkInTime) : null
      const checkOutTime = visitor.checkOutTime ? new Date(visitor.checkOutTime) : null

      if (checkOutTime) {
        activities.push({
          time: format(checkOutTime, 'hh:mm a'),
          activity: `${visitor.name} checked out`,
          type: 'visitor',
          timestamp: checkOutTime,
        })
      } else if (checkInTime) {
        activities.push({
          time: format(checkInTime, 'hh:mm a'),
          activity: `${visitor.name} checked in`,
          type: 'visitor',
          timestamp: checkInTime,
        })
      }
    })

    // Fetch recent vehicles
    const recentVehicles = await payload.find({
      collection: 'vehicles',
      limit: 10,
      sort: '-entryTime',
    })

    recentVehicles.docs.forEach((vehicle) => {
      const exitTime = vehicle.exitTime ? new Date(vehicle.exitTime) : null
      const entryTime = vehicle.entryTime ? new Date(vehicle.entryTime) : null

      if (exitTime) {
        activities.push({
          time: format(exitTime, 'hh:mm a'),
          activity: `Vehicle ${vehicle.registrationNumber} checked out`,
          type: 'vehicle',
          timestamp: exitTime,
        })
      } else if (entryTime) {
        activities.push({
          time: format(entryTime, 'hh:mm a'),
          activity: `Vehicle ${vehicle.registrationNumber} checked in`,
          type: 'vehicle',
          timestamp: entryTime,
        })
      }
    })

    // Fetch recent parcels
    const recentParcels = await payload.find({
      collection: 'parcel-logs',
      limit: 10,
      sort: '-receivedAt',
    })

    recentParcels.docs.forEach((parcel) => {
      const collectedAt = parcel.collectedAt ? new Date(parcel.collectedAt) : null
      const receivedAt = parcel.receivedAt ? new Date(parcel.receivedAt) : null

      if (collectedAt) {
        activities.push({
          time: format(collectedAt, 'hh:mm a'),
          activity: `Parcel collected from ${parcel.sender}`,
          type: 'parcel',
          timestamp: collectedAt,
        })
      } else if (receivedAt) {
        activities.push({
          time: format(receivedAt, 'hh:mm a'),
          activity: `Parcel received from ${parcel.sender}`,
          type: 'parcel',
          timestamp: receivedAt,
        })
      }
    })

    // Fetch recent travel logs
    const recentTravels = await payload.find({
      collection: 'travel-logs',
      limit: 10,
      sort: '-departureTime',
      depth: 1,
    })

    recentTravels.docs.forEach((travel) => {
      const actualReturn = travel.actualReturn ? new Date(travel.actualReturn) : null
      const departureTime = travel.departureTime ? new Date(travel.departureTime) : null

      const employeeName =
        typeof travel.employee === 'object' && travel.employee !== null
          ? travel.employee.name
          : 'Unknown'

      if (actualReturn) {
        activities.push({
          time: format(actualReturn, 'hh:mm a'),
          activity: `${employeeName} returned from ${travel.destination}`,
          type: 'travel',
          timestamp: actualReturn,
        })
      } else if (departureTime) {
        activities.push({
          time: format(departureTime, 'hh:mm a'),
          activity: `${employeeName} departed for ${travel.destination}`,
          type: 'travel',
          timestamp: departureTime,
        })
      }
    })

    // Fetch recent phone calls
    const recentCalls = await payload.find({
      collection: 'phone-calls',
      limit: 10,
      sort: '-startTime',
      depth: 1,
    })

    recentCalls.docs.forEach((call) => {
      const startTime = call.startTime ? new Date(call.startTime) : null

      const employeeName =
        typeof call.employee === 'object' && call.employee !== null ? call.employee.name : 'Unknown'

      if (startTime) {
        activities.push({
          time: format(startTime, 'hh:mm a'),
          activity: `${employeeName} made call to ${call.callerNumber}`,
          type: 'call',
          timestamp: startTime,
        })
      }
    })

    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    // Return top 15 most recent activities
    return NextResponse.json({
      activities: activities.slice(0, 15).map(({ timestamp, ...rest }) => rest),
    })
  } catch (error) {
    console.error('Error fetching recent activities:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch recent activities',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
