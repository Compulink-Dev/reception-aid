// app/(app)/(dashboard)/travel/page.tsx
import TravelDashboard from '@/components/travel-dashboard'
import React from 'react'

export default function TravelPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Travel Management</h1>
        <p className="text-gray-600">Track, manage, and analyze employee travel</p>
      </div>
      <TravelDashboard />
    </div>
  )
}
