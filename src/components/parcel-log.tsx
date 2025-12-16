// components/reception/ParcelLog.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { parcelSchema } from '@/lib/validations'
import { z } from 'zod'

type ParcelFormData = z.infer<typeof parcelSchema>

interface Parcel {
  id: string
  trackingNumber: string
  sender: string
  senderType: string
  recipient: string
  description: string
  receivedAt: string
  status: string
}

export default function ParcelLog() {
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ParcelFormData>({
    resolver: zodResolver(parcelSchema),
  })

  useEffect(() => {
    fetchParcels()
  }, [])

  const fetchParcels = async () => {
    try {
      const response = await fetch('/api/parcels')
      const data = await response.json()
      setParcels(data.docs || [])
    } catch (error) {
      console.error('Error fetching parcels:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ParcelFormData) => {
    try {
      const response = await fetch('/api/parcels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        alert('Parcel logged successfully!')
        reset()
        setShowForm(false)
        fetchParcels()
      }
    } catch (error) {
      console.error('Error logging parcel:', error)
    }
  }

  const markAsCollected = async (parcelId: string) => {
    try {
      await fetch(`/api/parcels/${parcelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'collected',
          collectedAt: new Date().toISOString(),
        }),
      })
      fetchParcels()
    } catch (error) {
      console.error('Error updating parcel:', error)
    }
  }

  if (loading) return <div>Loading parcels...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Parcel Management</h2>
          <p className="text-gray-600">Track incoming and outgoing parcels</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Log New Parcel'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Log New Parcel</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sender *</label>
                <input
                  {...register('sender')}
                  className="w-full p-2 border rounded-md"
                  placeholder="Sender name or company"
                />
                {errors.sender && (
                  <p className="text-sm text-red-600 mt-1">{errors.sender.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sender Type *</label>
                <select {...register('senderType')} className="w-full p-2 border rounded-md">
                  <option value="">Select type</option>
                  <option value="supplier">Supplier</option>
                  <option value="employee">Employee</option>
                  <option value="client">Client</option>
                  <option value="other">Other</option>
                </select>
                {errors.senderType && (
                  <p className="text-sm text-red-600 mt-1">{errors.senderType.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Recipient *</label>
                <select {...register('recipient')} className="w-full p-2 border rounded-md">
                  <option value="">Select recipient</option>
                  <option value="john-doe">John Doe</option>
                  <option value="jane-smith">Jane Smith</option>
                  <option value="bob-johnson">Bob Johnson</option>
                </select>
                {errors.recipient && (
                  <p className="text-sm text-red-600 mt-1">{errors.recipient.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full p-2 border rounded-md"
                  placeholder="Package contents and details..."
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Parcel'}
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
                Tracking #
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sender
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recipient
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Received
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
            {parcels.map((parcel) => (
              <tr key={parcel.id}>
                <td className="px-6 py-4">{parcel.trackingNumber || 'N/A'}</td>
                <td className="px-6 py-4">{parcel.sender}</td>
                <td className="px-6 py-4">{parcel.recipient}</td>
                <td className="px-6 py-4">{new Date(parcel.receivedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      parcel.status === 'received'
                        ? 'bg-yellow-100 text-yellow-800'
                        : parcel.status === 'collected'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {parcel.status.charAt(0).toUpperCase() + parcel.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {parcel.status === 'received' && (
                    <button
                      onClick={() => markAsCollected(parcel.id)}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Mark as Collected
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
