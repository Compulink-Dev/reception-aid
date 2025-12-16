// app/(app)/(dashboard)/travel/reports/page.tsx
import TravelReports from '@/components/travel-reports'
import React from 'react'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Travel Reports</h1>
        <p className="text-gray-600">Analytics and insights on employee travel</p>
      </div>
      <TravelReports />
    </div>
  )
}
