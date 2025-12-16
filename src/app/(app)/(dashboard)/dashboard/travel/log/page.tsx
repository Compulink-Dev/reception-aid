// app/(app)/(dashboard)/travel/log/page.tsx
import TravelLog from '@/components/travel-log'
import React from 'react'

export default function NewTravelPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Log New Travel</h1>
        <p className="text-gray-600">Create a new travel entry for an employee</p>
      </div>
      <TravelLog />
    </div>
  )
}
