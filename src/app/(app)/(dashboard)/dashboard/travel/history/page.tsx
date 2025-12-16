// app/(app)/(dashboard)/travel/history/page.tsx
import TravelHistory from '@/components/travel-history'
import React from 'react'

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Travel History</h1>
        <p className="text-gray-600">View and search past travel records</p>
      </div>
      <TravelHistory />
    </div>
  )
}
