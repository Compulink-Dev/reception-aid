// app/(app)/(dashboard)/reception/clients/page.tsx
import ClientManagement from '@/components/client-management'
import React from 'react'

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Client Management</h1>
        <p className="text-gray-600">Manage client relationships and interactions</p>
      </div>
      <ClientManagement />
    </div>
  )
}
