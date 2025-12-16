//@ts-nocheck
// components/reception/PhoneCallLog.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { phoneCallSchema } from '@/lib/validations'
import { z } from 'zod'

type PhoneCallFormData = z.infer<typeof phoneCallSchema>

interface PhoneCall {
  id: string
  employee: string
  callerName: string
  callerNumber: string
  purpose: string
  startTime: string
  duration: number
  cost: number
}

export default function PhoneCallLog() {
  const [calls, setCalls] = useState<PhoneCall[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<PhoneCallFormData>({
    resolver: zodResolver(phoneCallSchema),
  })

  const startTime = watch('startTime')

  useEffect(() => {
    fetchCalls()
  }, [])

  useEffect(() => {
    if (startTime) {
      const start = new Date(startTime)
      const end = new Date()
      const duration = Math.round((end.getTime() - start.getTime()) / 60000) // minutes
      setValue('duration', duration)
      // Simple cost calculation: $0.10 per minute
      setValue('cost', duration * 0.1)
    }
  }, [startTime, setValue])

  const fetchCalls = async () => {
    try {
      const response = await fetch('/api/phone-calls')
      const data = await response.json()
      setCalls(data.docs || [])
    } catch (error) {
      console.error('Error fetching calls:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: PhoneCallFormData) => {
    try {
      const response = await fetch('/api/phone-calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          endTime: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        alert('Call logged successfully!')
        reset()
        setShowForm(false)
        fetchCalls()
      }
    } catch (error) {
      console.error('Error logging call:', error)
    }
  }

  const handleStartCall = () => {
    setValue('startTime', new Date().toISOString())
    setShowForm(true)
  }

  if (loading) return <div>Loading calls...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Phone Call Management</h2>
          <p className="text-gray-600">Track outgoing phone calls and costs</p>
        </div>
        <button
          onClick={handleStartCall}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          Start New Call
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Log Phone Call</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Employee *</label>
                <select {...register('employee')} className="w-full p-2 border rounded-md">
                  <option value="">Select employee</option>
                  <option value="john-doe">John Doe</option>
                  <option value="jane-smith">Jane Smith</option>
                  <option value="bob-johnson">Bob Johnson</option>
                </select>
                {errors.employee && (
                  <p className="text-sm text-red-600 mt-1">{errors.employee.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Caller Number *</label>
                <input
                  {...register('callerNumber')}
                  className="w-full p-2 border rounded-md"
                  placeholder="0712345678"
                />
                {errors.callerNumber && (
                  <p className="text-sm text-red-600 mt-1">{errors.callerNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Caller Name (optional)</label>
                <input
                  {...register('callerName')}
                  className="w-full p-2 border rounded-md"
                  placeholder="Caller's name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input
                  {...register('startTime')}
                  type="datetime-local"
                  className="w-full p-2 border rounded-md"
                  readOnly
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Purpose *</label>
                <textarea
                  {...register('purpose')}
                  rows={3}
                  className="w-full p-2 border rounded-md"
                  placeholder="Purpose of the call..."
                />
                {errors.purpose && (
                  <p className="text-sm text-red-600 mt-1">{errors.purpose.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  {...register('duration', { valueAsNumber: true })}
                  className="w-full p-2 border rounded-md bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Estimated Cost ($)</label>
                <input
                  {...register('cost', { valueAsNumber: true })}
                  className="w-full p-2 border rounded-md bg-gray-50"
                  readOnly
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Ending Call...' : 'End & Save Call'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-gray-300 py-2 px-6 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Caller
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {calls.map((call) => (
              <tr key={call.id}>
                <td className="px-6 py-4">{call.employee}</td>
                <td className="px-6 py-4">
                  <div>{call.callerName || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">{call.callerNumber}</div>
                </td>
                <td className="px-6 py-4">{new Date(call.startTime).toLocaleString()}</td>
                <td className="px-6 py-4">{call.duration} min</td>
                <td className="px-6 py-4">${call.cost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
