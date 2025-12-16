// app/(app)/(dashboard)/security/page.tsx
import SecurityDashboard from '@/components/security-dashboard'
import React from 'react'

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Gate Management</h1>
        <p className="text-gray-600">Manage vehicle entry and exit</p>
      </div>
      <SecurityDashboard />
    </div>
  )
}
