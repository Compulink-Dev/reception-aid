// app/(app)/(dashboard)/security/mileage/page.tsx
import VehicleMileage from '@/components/vehicle-mileage'
import React from 'react'

export default function MileagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vehicle Mileage Tracking</h1>
        <p className="text-gray-600">Monitor and analyze vehicle mileage</p>
      </div>
      <VehicleMileage />
    </div>
  )
}
