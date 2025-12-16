// app/(app)/(dashboard)/settings/page.tsx
import SystemSettings from '@/components/system-setting'
import React from 'react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-gray-600">Configure system preferences and application settings</p>
      </div>
      <SystemSettings />
    </div>
  )
}
