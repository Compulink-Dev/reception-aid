// components/reception/TravelLog.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { travelLogSchema } from '@/lib/validations'
import { z } from 'zod'

type TravelLogFormData = z.infer<typeof travelLogSchema>

interface TravelLog {
  id: string
  employee: string
  destination: string
  purpose: string
  departureTime: string
  expectedReturn: string
  actualReturn: string
  status: string
}

export default function TravelLog() {
  const [travelLogs, setTravelLogs] = useState<TravelLog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TravelLogFormData>({
    resolver: zodResolver(travelLogSchema),
  })

  useEffect(() => {
    fetchTravelLogs()
  }, [])

  const fetchTravelLogs = async () => {
    try {
      const response = await fetch('/api/travel-logs')
      const data = await response.json()
      setTravelLogs(data.docs || [])
    } catch (error) {
      console.error('Error fetching travel logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: TravelLogFormData) => {
    try {
      const response = await fetch('/api/travel-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        alert('Travel log created successfully!')
        reset()
        setShowForm(false)
        fetchTravelLogs()
      }
    } catch (error) {
      console.error('Error creating travel log:', error)
    }
  }

  const markAsReturned = async (logId: string) => {
    try {
      await fetch(`/api/travel-logs/${logId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'returned',
          actualReturn: new Date().toISOString(),
        }),
      })
      fetchTravelLogs()
    } catch (error) {
      console.error('Error updating travel log:', error)
    }
  }

  if (loading) return <div>Loading travel logs...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Employee Travel Logs</h2>
          <p className="text-gray-600">Track employee departures and returns</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Log Departure'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Log Employee Departure</h3>
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
                <label className="block text-sm font-medium mb-1">Destination *</label>
                <input
                  {...register('destination')}
                  className="w-full p-2 border rounded-md"
                  placeholder="Client office, meeting venue..."
                />
                {errors.destination && (
                  <p className="text-sm text-red-600 mt-1">{errors.destination.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Purpose *</label>
                <textarea
                  {...register('purpose')}
                  rows={3}
                  className="w-full p-2 border rounded-md"
                  placeholder="Client meeting, site visit, training..."
                />
                {errors.purpose && (
                  <p className="text-sm text-red-600 mt-1">{errors.purpose.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Departure Time *</label>
                <input
                  {...register('departureTime', { valueAsDate: true })}
                  type="datetime-local"
                  className="w-full p-2 border rounded-md"
                />
                {errors.departureTime && (
                  <p className="text-sm text-red-600 mt-1">{errors.departureTime.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Expected Return</label>
                <input
                  {...register('expectedReturn', { valueAsDate: true })}
                  type="datetime-local"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Departure'}
              </button>
              <button
                type="button"
                onClick={() => reset()}
                className="border border-gray-300 py-2 px-6 rounded-md hover:bg-gray-50"
              >
                Clear
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
                Destination
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departure
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expected Return
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {travelLogs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4">{log.employee}</td>
                <td className="px-6 py-4">
                  <div className="font-medium">{log.destination}</div>
                  <div className="text-sm text-gray-500">{log.purpose}</div>
                </td>
                <td className="px-6 py-4">{new Date(log.departureTime).toLocaleString()}</td>
                <td className="px-6 py-4">
                  {log.expectedReturn
                    ? new Date(log.expectedReturn).toLocaleString()
                    : 'Not specified'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      log.status === 'departed'
                        ? 'bg-yellow-100 text-yellow-800'
                        : log.status === 'returned'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {log.status === 'departed' && (
                    <button
                      onClick={() => markAsReturned(log.id)}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Mark as Returned
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
