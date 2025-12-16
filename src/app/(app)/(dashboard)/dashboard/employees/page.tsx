// app/(app)/(dashboard)/reception/employees/page.tsx
import EmployeeManagement from '@/components/employee-managemnet'
import React from 'react'

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <p className="text-gray-600">Manage employee information, attendance, and profiles</p>
      </div>
      <EmployeeManagement />
    </div>
  )
}
