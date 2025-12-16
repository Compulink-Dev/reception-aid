// app/(app)/(dashboard)/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Car, Package, Phone, Calendar, BarChart3, Clock, Shield } from 'lucide-react'

interface Stats {
  todayVisitors: { value: number; change: string }
  parkedVehicles: { value: number; change: string }
  pendingParcels: { value: number; change: string }
  todayCalls: { value: number; change: string }
  activeTravelLogs: { value: number; change: string }
  securityChecks: { value: number; change: string }
}

interface Activity {
  time: string
  activity: string
  type: 'visitor' | 'vehicle' | 'parcel' | 'travel' | 'call'
}

export default function Dashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats and activities in parallel
        const [statsRes, activitiesRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/activities'),
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData.stats)
        }

        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json()
          setActivities(activitiesData.activities)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statsConfig = [
    { icon: <Users className="h-5 w-5" />, label: 'Today Visitors', key: 'todayVisitors' },
    { icon: <Car className="h-5 w-5" />, label: 'Parked Vehicles', key: 'parkedVehicles' },
    { icon: <Package className="h-5 w-5" />, label: 'Pending Parcels', key: 'pendingParcels' },
    { icon: <Phone className="h-5 w-5" />, label: 'Today Calls', key: 'todayCalls' },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: 'Active Travel Logs',
      key: 'activeTravelLogs',
    },
    { icon: <Shield className="h-5 w-5" />, label: 'Security Checks', key: 'securityChecks' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome to Reception Aide Dashboard</h1>
            <p className="text-blue-100">
              {`Here's what's happening with your reception management today.`}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm text-blue-200">System Status</p>
              <p className="text-xl font-bold">All Systems Operational</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => router.push('/dashboard/visitors')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Manage Visitors</h3>
              <p className="text-sm text-gray-600">Check-in/out visitors</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => router.push('/dashboard/security')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Car className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Security Gate</h3>
              <p className="text-sm text-gray-600">Vehicle management</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => router.push('/dashboard/parcels')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Parcel Logs</h3>
              <p className="text-sm text-gray-600">Track packages</p>
            </div>
          </div>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="animate-pulse">
                  <div className="h-10 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))
          : statsConfig.map((config, index) => {
              const statData = stats?.[config.key as keyof Stats]
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-2 rounded-lg ${
                        index === 0
                          ? 'bg-blue-100'
                          : index === 1
                            ? 'bg-green-100'
                            : index === 2
                              ? 'bg-purple-100'
                              : index === 3
                                ? 'bg-orange-100'
                                : index === 4
                                  ? 'bg-red-100'
                                  : 'bg-indigo-100'
                      }`}
                    >
                      {config.icon}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        statData?.change.startsWith('+')
                          ? 'text-green-600'
                          : statData?.change.startsWith('-')
                            ? 'text-red-600'
                            : 'text-gray-600'
                      }`}
                    >
                      {statData?.change || '0'}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {statData?.value ?? 0}
                  </div>
                  <div className="text-sm text-gray-600">{config.label}</div>
                </div>
              )
            })}
      </div>

      {/* Recent Activity and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button
              onClick={() => router.push('/dashboard/reports/activity')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
                  </div>
                </div>
              ))
            ) : activities.length > 0 ? (
              activities.slice(0, 10).map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-900">{activity.activity}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      activity.type === 'visitor'
                        ? 'bg-blue-100 text-blue-800'
                        : activity.type === 'vehicle'
                          ? 'bg-green-100 text-green-800'
                          : activity.type === 'parcel'
                            ? 'bg-purple-100 text-purple-800'
                            : activity.type === 'travel'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {activity.type}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activities</p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h2>
          {loading ? (
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Visitor Check-ins Today</span>
                  <span className="text-sm font-medium text-gray-900">
                    {stats?.todayVisitors.value || 0}/50
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${Math.min(((stats?.todayVisitors.value || 0) / 50) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Parking Space Usage</span>
                  <span className="text-sm font-medium text-gray-900">
                    {stats?.parkedVehicles.value || 0}/30
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 rounded-full"
                    style={{
                      width: `${Math.min(((stats?.parkedVehicles.value || 0) / 30) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Phone Calls Today</span>
                  <span className="text-sm font-medium text-gray-900">
                    {stats?.todayCalls.value || 0}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-600 rounded-full"
                    style={{
                      width: `${Math.min(((stats?.todayCalls.value || 0) / 30) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Pending Parcels</span>
                  <span className="text-sm font-medium text-gray-900">
                    {stats?.pendingParcels.value || 0}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{
                      width: `${Math.min(((stats?.pendingParcels.value || 0) / 20) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
