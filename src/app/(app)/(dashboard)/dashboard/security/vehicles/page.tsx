// app/(app)/(dashboard)/security/vehicles/page.tsx
import VehicleManagement from '@/components/vehicle-management'
import React from 'react'

export default function VehiclesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vehicle Management</h1>
        <p className="text-gray-600">Manage and track company and personal vehicles</p>
      </div>
      <VehicleManagement />
    </div>
  )
}
