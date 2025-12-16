// components/dashboard/Dashboard.tsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Users, Package, Phone, Car, Calendar } from 'lucide-react'

export const Dashboard = () => {
  const stats = [
    { title: 'Today Visitors', value: '12', icon: Users, change: '+2' },
    { title: 'Active Travel Logs', value: '8', icon: Activity, change: '+1' },
    { title: 'Pending Parcels', value: '5', icon: Package, change: '-1' },
    { title: 'Today Calls', value: '23', icon: Phone, change: '+5' },
    { title: 'Parked Vehicles', value: '15', icon: Car, change: '+3' },
    { title: 'Upcoming Appointments', value: '7', icon: Calendar, change: '+2' },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reception Dashboard</h1>
        <p className="text-gray-600">{`Welcome back! Here's what's happening today.`}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.change} from yesterday</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Visitors</CardTitle>
          </CardHeader>
          <CardContent>{/* Visitor list component */}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-primary">Check-in Visitor</button>
              <button className="btn btn-secondary">Log Parcel</button>
              <button className="btn btn-outline">Record Call</button>
              <button className="btn btn-outline">Vehicle Entry</button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
