// components/reception/ParcelLog.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { parcelSchema } from '@/lib/validations'
import { z } from 'zod'
import { Plus, Trash2 } from 'lucide-react'

type ParcelFormData = z.infer<typeof parcelSchema>

interface Parcel {
  id: string
  trackingNumber?: string
  deliveryNoteNumber?: string
  serialNumbers?: Array<{ id: string; serialNumber: string }>
  from: string
  senderType: 'incoming' | 'outgoing' | 'other'
  to: string | { id: string; name: string; email: string }
  description: string
  receivedAt: string
  collectedAt: string | null
  status: 'received' | 'collected' | 'returned'
  weight?: string
  dimensions?: string
  deliveryService?: string
  notes?: string
}

interface Employee {
  id: string
  name: string
  department?: string
  email: string
}

export default function ParcelLog() {
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [serialNumbers, setSerialNumbers] = useState<Array<{ id: string; serialNumber: string }>>(
    [],
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ParcelFormData>({
    resolver: zodResolver(parcelSchema),
    defaultValues: {
      senderType: 'incoming',
    },
  })

  useEffect(() => {
    fetchParcels()
    fetchEmployees()
  }, [])

  const fetchParcels = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/parcels')
      const data = await response.json()
      if (data.success) {
        setParcels(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching parcels:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true)
      const response = await fetch('/api/employees?limit=100&isActive=true')
      const result = await response.json()
      if (result.success) {
        setEmployees(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoadingEmployees(false)
    }
  }

  const onSubmit = async (data: ParcelFormData) => {
    try {
      // Prepare serial numbers array
      const formattedData = {
        ...data,
        serialNumbers: serialNumbers.map((item) => ({ serialNumber: item.serialNumber })),
        status: 'received',
        receivedAt: new Date().toISOString(),
      }

      const response = await fetch('/api/parcels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      })

      if (response.ok) {
        alert('Parcel logged successfully!')
        reset()
        setSerialNumbers([])
        setShowForm(false)
        fetchParcels()
      } else {
        const errorData = await response.json()
        alert(`Failed to log parcel: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error logging parcel:', error)
      alert('Failed to log parcel. Please try again.')
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
      alert('Parcel marked as collected')
    } catch (error) {
      console.error('Error updating parcel:', error)
      alert('Failed to update parcel')
    }
  }

  const addSerialNumber = () => {
    setSerialNumbers([...serialNumbers, { id: Date.now().toString(), serialNumber: '' }])
  }

  const removeSerialNumber = (id: string) => {
    setSerialNumbers(serialNumbers.filter((item) => item.id !== id))
  }

  const updateSerialNumber = (id: string, value: string) => {
    setSerialNumbers(
      serialNumbers.map((item) => (item.id === id ? { ...item, serialNumber: value } : item)),
    )
  }

  const getEmployeeName = (to: string | { id: string; name: string; email: string }) => {
    if (!to) return 'Unknown'
    if (typeof to === 'object' && to.name) {
      return to.name
    }
    return 'Unknown Employee'
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
              {/* Tracking Number */}
              <div>
                <label className="block text-sm font-medium mb-1">Tracking Number</label>
                <input
                  {...register('trackingNumber')}
                  className="w-full p-2 border rounded-md"
                  placeholder="TRK123456789"
                />
              </div>

              {/* Delivery Note Number */}
              <div>
                <label className="block text-sm font-medium mb-1">Delivery Note Number</label>
                <input
                  {...register('deliveryNoteNumber')}
                  className="w-full p-2 border rounded-md"
                  placeholder="DN-2024-001"
                />
              </div>

              {/* From (Sender) */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  From (Sender) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('from')}
                  className="w-full p-2 border rounded-md"
                  placeholder="Sender name or company"
                />
                {errors.from && <p className="text-sm text-red-600 mt-1">{errors.from.message}</p>}
              </div>

              {/* Sender Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sender Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('senderType')}
                  className="w-full p-2 border rounded-md"
                  defaultValue="incoming"
                >
                  <option value="incoming">Incoming</option>
                  <option value="outgoing">Outgoing</option>
                  <option value="other">Other</option>
                </select>
                {errors.senderType && (
                  <p className="text-sm text-red-600 mt-1">{errors.senderType.message}</p>
                )}
              </div>

              {/* To (Recipient) */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  To (Recipient) <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('to')}
                  className="w-full p-2 border rounded-md"
                  disabled={loadingEmployees}
                >
                  <option value="">Select recipient</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                      {employee.department && ` (${employee.department})`}
                    </option>
                  ))}
                </select>
                {errors.to && <p className="text-sm text-red-600 mt-1">{errors.to.message}</p>}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium mb-1">Weight</label>
                <input
                  {...register('weight')}
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., 2.5 kg"
                />
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-sm font-medium mb-1">Dimensions</label>
                <input
                  {...register('dimensions')}
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., 30x20x15 cm"
                />
              </div>

              {/* Delivery Service */}
              <div>
                <label className="block text-sm font-medium mb-1">Delivery Service</label>
                <select {...register('deliveryService')} className="w-full p-2 border rounded-md">
                  <option value="">Select service</option>
                  <option value="fedex">FedEx</option>
                  <option value="ups">UPS</option>
                  <option value="dhl">DHL</option>
                  <option value="amazon">Amazon Logistics</option>
                  <option value="usps">USPS</option>
                  <option value="internal">Internal</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Serial Numbers */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Serial Numbers</label>
                <div className="space-y-2">
                  {serialNumbers.map((item) => (
                    <div key={item.id} className="flex gap-2 items-center">
                      <input
                        value={item.serialNumber}
                        onChange={(e) => updateSerialNumber(item.id, e.target.value)}
                        placeholder="Enter serial number"
                        className="w-full p-2 border rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeSerialNumber(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSerialNumber}
                    className="text-blue-600 hover:text-blue-900 text-sm flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Serial Number
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
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

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  {...register('notes')}
                  rows={2}
                  className="w-full p-2 border rounded-md"
                  placeholder="Additional notes, special instructions..."
                />
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
                onClick={() => {
                  reset()
                  setSerialNumbers([])
                }}
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
                Tracking/DN #
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                To (Recipient)
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
                <td className="px-6 py-4">
                  <div className="font-medium">{parcel.trackingNumber || 'No Tracking #'}</div>
                  <div className="text-xs text-gray-500">
                    {parcel.deliveryNoteNumber || 'No DN#'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">{parcel.from}</div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        parcel.senderType === 'incoming'
                          ? 'bg-blue-100 text-blue-800'
                          : parcel.senderType === 'outgoing'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {parcel.senderType}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">{getEmployeeName(parcel.to)}</td>
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
