// app/(app)/(dashboard)/reception/visitors/page.tsx
import VisitorManagement from '@/components/visitors-management'
import React from 'react'

export default function VisitorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Visitor Management</h1>
        <p className="text-gray-600">Track and manage all visitors</p>
      </div>
      <VisitorManagement />
    </div>
  )
}
