// app/(app)/(dashboard)/reception/company/page.tsx
import CompanyDirectory from '@/components/company-directory'
import React from 'react'

export default function CompanyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Company Directory</h1>
        <p className="text-gray-600">Manage company information and employees</p>
      </div>
      <CompanyDirectory />
    </div>
  )
}
