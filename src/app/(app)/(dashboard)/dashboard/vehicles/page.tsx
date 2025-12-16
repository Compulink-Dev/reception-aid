// app/(app)/(dashboard)/reception/vehicles/page.tsx
import VehicleManagement from '@/components/vehicle-management'
import React from 'react'

export default function VehiclesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vehicle Management</h1>
        <p className="text-gray-600">Track and manage vehicle entries and exits</p>
      </div>
      <VehicleManagement />
    </div>
  )
}
