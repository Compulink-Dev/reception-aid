// components/parcel/ParcelEditForm.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { parcelSchema } from '@/lib/validations'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'

type ParcelFormData = z.infer<typeof parcelSchema>

interface Employee {
  id: string
  name: string
  department?: string
  email: string
}

interface ParcelEditFormProps {
  parcel: any
  onSuccess: () => void
  onCancel: () => void
}

export default function ParcelEditForm({ parcel, onSuccess, onCancel }: ParcelEditFormProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [serialNumbers, setSerialNumbers] = useState<Array<{ id: string; serialNumber: string }>>(
    parcel.serialNumbers?.map((sn: any, index: number) => ({
      id: sn.id || `existing-${index}`,
      serialNumber: sn.serialNumber,
    })) || [],
  )
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ParcelFormData>({
    resolver: zodResolver(parcelSchema),
    defaultValues: {
      trackingNumber: parcel.trackingNumber || '',
      deliveryNoteNumber: parcel.deliveryNoteNumber || '',
      from: parcel.from,
      senderType: parcel.senderType,
      to: typeof parcel.to === 'object' ? parcel.to.id : parcel.to,
      description: parcel.description,
      weight: parcel.weight || '',
      dimensions: parcel.dimensions || '',
      deliveryService: parcel.deliveryService || '',
      notes: parcel.notes || '',
    },
  })

  // Fetch employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true)
        const response = await fetch('/api/employees?limit=100&isActive=true')
        const result = await response.json()
        if (result.success) {
          setEmployees(result.data)
        }
      } catch (error) {
        console.error('Error fetching employees:', error)
        toast.error('Failed to load employees')
      } finally {
        setLoadingEmployees(false)
      }
    }
    fetchEmployees()
  }, [])

  const onSubmit = async (data: ParcelFormData) => {
    try {
      setLoading(true)

      // Prepare serial numbers array
      const formattedData = {
        ...data,
        serialNumbers: serialNumbers.map((item) => ({ serialNumber: item.serialNumber })),
      }

      const response = await fetch(`/api/parcels/${parcel.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      })

      if (response.ok) {
        toast.success('Parcel updated successfully!')
        onSuccess()
      } else {
        const errorData = await response.json()
        toast.error(
          `Failed to update parcel: ${errorData.error || 'Unknown error'}\n${errorData.details || ''}`,
        )
      }
    } catch (error) {
      console.error('Error updating parcel:', error)
      toast.error('Failed to update parcel. Please try again.')
    } finally {
      setLoading(false)
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tracking Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tracking Number</label>
          <Input {...register('trackingNumber')} placeholder="TRK123456789" />
        </div>

        {/* Delivery Note Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Delivery Note Number</label>
          <Input {...register('deliveryNoteNumber')} placeholder="DN-2024-001" />
        </div>

        {/* From (Sender) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            From (Sender) <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('from')}
            placeholder="Sender name or company"
            className={errors.from ? 'border-red-500' : ''}
          />
          {errors.from && <p className="text-sm text-red-500">{errors.from.message}</p>}
        </div>

        {/* Sender Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Sender Type <span className="text-red-500">*</span>
          </label>
          <Select
            onValueChange={(value) => setValue('senderType', value as ParcelFormData['senderType'])}
            defaultValue={parcel.senderType}
          >
            <SelectTrigger className={errors.senderType ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="incoming">Incoming</SelectItem>
              <SelectItem value="outgoing">Outgoing</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.senderType && <p className="text-sm text-red-500">{errors.senderType.message}</p>}
        </div>

        {/* To (Recipient) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            To (Recipient) <span className="text-red-500">*</span>
          </label>
          <Select
            onValueChange={(value) => setValue('to', value)}
            defaultValue={typeof parcel.to === 'object' ? parcel.to.id : parcel.to}
          >
            <SelectTrigger className={errors.to ? 'border-red-500' : ''}>
              <SelectValue
                placeholder={loadingEmployees ? 'Loading employees...' : 'Select recipient'}
              />
            </SelectTrigger>
            <SelectContent>
              {loadingEmployees && (
                <SelectItem key="loading" value="loading" disabled>
                  Loading...
                </SelectItem>
              )}
              {!loadingEmployees && employees.length === 0 && (
                <SelectItem key="none" value="none" disabled>
                  No employees found
                </SelectItem>
              )}
              {!loadingEmployees &&
                employees.length > 0 &&
                employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                    {employee.department && ` (${employee.department.toUpperCase()})`}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.to && <p className="text-sm text-red-500">{errors.to.message}</p>}
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Weight</label>
          <Input {...register('weight')} placeholder="e.g., 2.5 kg" />
        </div>

        {/* Dimensions */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Dimensions</label>
          <Input {...register('dimensions')} placeholder="e.g., 30x20x15 cm" />
        </div>

        {/* Delivery Service */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Delivery Service</label>
          <Select
            onValueChange={(value) => setValue('deliveryService', value)}
            defaultValue={parcel.deliveryService || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fedex">FedEx</SelectItem>
              <SelectItem value="ups">UPS</SelectItem>
              <SelectItem value="dhl">DHL</SelectItem>
              <SelectItem value="amazon">Amazon Logistics</SelectItem>
              <SelectItem value="usps">USPS</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Serial Numbers */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Serial Numbers</label>
          <div className="space-y-2">
            {serialNumbers.map((item) => (
              <div key={item.id} className="flex gap-2 items-center">
                <Input
                  value={item.serialNumber}
                  onChange={(e) => updateSerialNumber(item.id, e.target.value)}
                  placeholder="Enter serial number"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeSerialNumber(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSerialNumber}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Serial Number
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">
            Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            {...register('description')}
            placeholder="Package contents and details..."
            className={errors.description ? 'border-red-500' : ''}
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Notes</label>
          <Textarea
            {...register('notes')}
            placeholder="Additional notes, special instructions..."
            rows={2}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? 'Updating...' : 'Update Parcel'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset()
            onCancel()
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
