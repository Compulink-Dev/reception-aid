// app/(app)/(dashboard)/security/logs/page.tsx
import SecurityLogs from '@/components/security-log'
import React from 'react'

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Logs</h1>
        <p className="text-gray-600">View all security gate activity and logs</p>
      </div>
      <SecurityLogs />
    </div>
  )
}
