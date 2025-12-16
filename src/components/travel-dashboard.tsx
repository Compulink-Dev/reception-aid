// components/travel/TravelDashboard.tsx
'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plane,
  Car,
  Hotel,
  Download,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const mockTravelStats = {
  activeTravels: 8,
  completedThisMonth: 42,
  pendingApprovals: 3,
  totalCostThisMonth: 15680,
  upcomingTrips: [
    {
      id: '1',
      employee: 'John Doe',
      destination: 'New York',
      departure: '2024-01-20',
      status: 'approved',
    },
    {
      id: '2',
      employee: 'Jane Smith',
      destination: 'London',
      departure: '2024-01-22',
      status: 'pending',
    },
    {
      id: '3',
      employee: 'Mike Chen',
      destination: 'Tokyo',
      departure: '2024-01-25',
      status: 'approved',
    },
  ],
  recentReturns: [
    { id: '1', employee: 'Sarah Johnson', destination: 'Berlin', returnDate: '2024-01-18' },
    { id: '2', employee: 'Tom Harris', destination: 'Paris', returnDate: '2024-01-17' },
  ],
  travelByType: [
    { type: 'Business Meeting', count: 25, percentage: 45 },
    { type: 'Client Visit', count: 18, percentage: 33 },
    { type: 'Conference', count: 8, percentage: 14 },
    { type: 'Training', count: 4, percentage: 8 },
  ],
}

export default function TravelDashboard() {
  const [timeRange, setTimeRange] = useState('month')

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Travels</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTravelStats.activeTravels}</div>
            <p className="text-xs text-muted-foreground">Employees currently traveling</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTravelStats.completedThisMonth}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTravelStats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockTravelStats.totalCostThisMonth.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Travel expenses this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/travel/log">
          <Button>
            <Plane className="h-4 w-4 mr-2" />
            Log New Travel
          </Button>
        </Link>
        <Link href="/dashboard/travel/history">
          <Button variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            View History
          </Button>
        </Link>
        <Link href="/dashboard/travel/reports">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Generate Reports
          </Button>
        </Link>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Travel Calendar
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Trips */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTravelStats.upcomingTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Plane className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{trip.employee}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{trip.destination}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Departs: {new Date(trip.departure).toLocaleDateString()}
                    </p>
                    <Badge
                      className={
                        trip.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {trip.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Returns */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTravelStats.recentReturns.map((travel) => (
                <div
                  key={travel.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{travel.employee}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{travel.destination}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Returned</p>
                    <p className="font-medium">
                      {new Date(travel.returnDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Travel Types */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Travel by Purpose</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {mockTravelStats.travelByType.map((item) => (
                <div key={item.type} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{item.type}</p>
                      <p className="text-2xl font-bold">{item.count}</p>
                    </div>
                    <Badge variant="outline">{item.percentage}%</Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
