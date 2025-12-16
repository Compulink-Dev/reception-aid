// components/reception/TravelLog.tsx - Updated version
'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import TravelLogForm from './travel-form'

export default function TravelLog() {
  const [showForm, setShowForm] = useState(false)

  const handleSubmitSuccess = () => {
    setShowForm(false)
    // You can add a toast notification here
    alert('Travel log created successfully!')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Employee Travel Logs</h2>
          <p className="text-gray-600">Track employee departures and returns</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          {showForm ? 'Cancel' : 'Log Departure'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Log Employee Departure</CardTitle>
          </CardHeader>
          <CardContent>
            <TravelLogForm
              onSubmitSuccess={handleSubmitSuccess}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Note: The table view is now handled by the main travel page */}
      <div className="text-center py-8 text-muted-foreground">
        <p>Travel logs are now managed from the main Travel page.</p>
        <Button variant="link" className="mt-2">
          Go to Travel Dashboard
        </Button>
      </div>
    </div>
  )
}
