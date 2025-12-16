// app/api/dashboard/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get today's date range (start and end of day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get yesterday's date range for comparison
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // 1. Today's Visitors (checked in today)
    const todayVisitors = await payload.find({
      collection: 'visitors',
      where: {
        and: [
          {
            checkInTime: {
              greater_than_equal: today.toISOString(),
            },
          },
          {
            checkInTime: {
              less_than: tomorrow.toISOString(),
            },
          },
        ],
      },
    })

    // Yesterday's visitors for comparison
    const yesterdayVisitors = await payload.find({
      collection: 'visitors',
      where: {
        and: [
          {
            checkInTime: {
              greater_than_equal: yesterday.toISOString(),
            },
          },
          {
            checkInTime: {
              less_than: today.toISOString(),
            },
          },
        ],
      },
    })

    // 2. Parked Vehicles (vehicles with entry but no exit)
    const parkedVehicles = await payload.find({
      collection: 'vehicles',
      where: {
        exitTime: {
          exists: false,
        },
      },
    })

    // 3. Pending Parcels (received but not collected)
    const pendingParcels = await payload.find({
      collection: 'parcel-logs',
      where: {
        status: {
          equals: 'received',
        },
      },
    })

    // 4. Today's Phone Calls
    const todayCalls = await payload.find({
      collection: 'phone-calls',
      where: {
        and: [
          {
            startTime: {
              greater_than_equal: today.toISOString(),
            },
          },
          {
            startTime: {
              less_than: tomorrow.toISOString(),
            },
          },
        ],
      },
    })

    // Yesterday's calls for comparison
    const yesterdayCalls = await payload.find({
      collection: 'phone-calls',
      where: {
        and: [
          {
            startTime: {
              greater_than_equal: yesterday.toISOString(),
            },
          },
          {
            startTime: {
              less_than: today.toISOString(),
            },
          },
        ],
      },
    })

    // 5. Active Travel Logs (departed but not returned)
    const activeTravelLogs = await payload.find({
      collection: 'travel-logs',
      where: {
        status: {
          equals: 'departed',
        },
      },
    })

    // 6. All checked-in visitors (for security checks count)
    const checkedInVisitors = await payload.find({
      collection: 'visitors',
      where: {
        status: {
          equals: 'checked-in',
        },
      },
    })

    // Calculate changes/differences
    const visitorChange =
      yesterdayVisitors.totalDocs > 0
        ? Math.round(
            ((todayVisitors.totalDocs - yesterdayVisitors.totalDocs) / yesterdayVisitors.totalDocs) *
              100,
          )
        : todayVisitors.totalDocs > 0
          ? 100
          : 0

    const callsChange =
      yesterdayCalls.totalDocs > 0
        ? Math.round(
            ((todayCalls.totalDocs - yesterdayCalls.totalDocs) / yesterdayCalls.totalDocs) * 100,
          )
        : todayCalls.totalDocs > 0
          ? 100
          : 0

    return NextResponse.json({
      stats: {
        todayVisitors: {
          value: todayVisitors.totalDocs,
          change: visitorChange > 0 ? `+${visitorChange}%` : `${visitorChange}%`,
        },
        parkedVehicles: {
          value: parkedVehicles.totalDocs,
          change: `${parkedVehicles.totalDocs} active`,
        },
        pendingParcels: {
          value: pendingParcels.totalDocs,
          change: `${pendingParcels.totalDocs} waiting`,
        },
        todayCalls: {
          value: todayCalls.totalDocs,
          change: callsChange > 0 ? `+${callsChange}%` : `${callsChange}%`,
        },
        activeTravelLogs: {
          value: activeTravelLogs.totalDocs,
          change: `${activeTravelLogs.totalDocs} active`,
        },
        securityChecks: {
          value: checkedInVisitors.totalDocs,
          change: `${checkedInVisitors.totalDocs} total`,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch dashboard statistics',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
