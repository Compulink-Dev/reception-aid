//@ts-nocheck
// components/travel/TravelLogForm.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { travelLogSchema } from '@/lib/validations'
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

type TravelLogFormData = z.infer<typeof travelLogSchema>

interface Employee {
  id: string
  name: string
  department?: string
  email: string
}

interface TravelLogFormProps {
  onSubmitSuccess?: (data: TravelLogFormData) => void
  onCancel?: () => void
}

export default function TravelLogForm({ onSubmitSuccess, onCancel }: TravelLogFormProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<TravelLogFormData>({
    resolver: zodResolver(travelLogSchema),
    defaultValues: {
      status: 'pending',
      travelType: 'business',
      transportation: 'flight',
    },
  })

  // Fetch employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
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

  const onSubmit = async (data: TravelLogFormData) => {
    try {
      console.log('Submitting travel log data:', data)

      // Format the data for Payload CMS
      const formattedData = {
        ...data,
        employee: data.employee, // Already an ID string
        departureTime: new Date(data.departureTime).toISOString(),
        expectedReturn: data.expectedReturn
          ? new Date(data.expectedReturn).toISOString()
          : undefined,
        estimatedCost: data.estimatedCost || 0,
        // Status will be set to 'pending' by default in the collection
      }

      console.log('Formatted data for API:', formattedData)

      const response = await fetch('/api/travel-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      })

      const responseData = await response.json()

      if (response.ok) {
        toast.success('Travel logged successfully!')
        reset()
        if (onSubmitSuccess) {
          onSubmitSuccess(data)
        }
      } else {
        console.error('API Error response:', responseData)
        toast.error(`Failed to log travel: ${responseData.error || 'Unknown error'}`)
        if (responseData.details) {
          console.error('Error details:', responseData.details)
        }
      }
    } catch (error) {
      console.error('Error logging travel:', error)
      toast.error('Failed to log travel. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Employee Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Employee <span className="text-red-500">*</span>
          </label>
          <Select onValueChange={(value) => setValue('employee', value)} defaultValue="">
            <SelectTrigger className={errors.employee ? 'border-red-500' : ''}>
              <SelectValue
                placeholder={loadingEmployees ? 'Loading employees...' : 'Select employee'}
              />
            </SelectTrigger>
            <SelectContent>
              {loadingEmployees ? (
                <SelectItem value="loading" disabled>
                  Loading...
                </SelectItem>
              ) : employees.length === 0 ? (
                <SelectItem value="none" disabled>
                  No employees found
                </SelectItem>
              ) : (
                employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                    {employee.department && ` (${employee.department.toUpperCase()})`}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.employee && <p className="text-sm text-red-500">{errors.employee.message}</p>}
        </div>

        {/* Destination */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Destination <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('destination')}
            placeholder="City, Country or Address"
            className={errors.destination ? 'border-red-500' : ''}
          />
          {errors.destination && (
            <p className="text-sm text-red-500">{errors.destination.message}</p>
          )}
        </div>

        {/* Travel Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Travel Type</label>
          <Select
            onValueChange={(value) =>
              setValue('travelType', value as TravelLogFormData['travelType'])
            }
            defaultValue="business"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business">Business Meeting</SelectItem>
              <SelectItem value="client_visit">Client Visit</SelectItem>
              <SelectItem value="conference">Conference/Event</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transportation */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Transportation</label>
          <Select
            onValueChange={(value) =>
              setValue('transportation', value as TravelLogFormData['transportation'])
            }
            defaultValue="flight"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transportation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flight">Flight</SelectItem>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="bus">Bus</SelectItem>
              <SelectItem value="train">Train</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Departure Time */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Departure Time <span className="text-red-500">*</span>
          </label>
          <Input
            type="datetime-local"
            {...register('departureTime')}
            className={errors.departureTime ? 'border-red-500' : ''}
          />
          {errors.departureTime && (
            <p className="text-sm text-red-500">{errors.departureTime.message}</p>
          )}
        </div>

        {/* Expected Return */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Expected Return</label>
          <Input type="datetime-local" {...register('expectedReturn')} />
        </div>

        {/* Accommodation */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Accommodation</label>
          <Input {...register('accommodation')} placeholder="Hotel name or address" />
        </div>

        {/* Estimated Cost */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Estimated Cost ($)</label>
          <Input
            type="number"
            step="0.01"
            {...register('estimatedCost', { valueAsNumber: true })}
            placeholder="0.00"
          />
        </div>

        {/* Purpose */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">
            Purpose <span className="text-red-500">*</span>
          </label>
          <Textarea
            {...register('purpose')}
            placeholder="Meeting details, client name, conference title..."
            className={errors.purpose ? 'border-red-500' : ''}
            rows={3}
          />
          {errors.purpose && <p className="text-sm text-red-500">{errors.purpose.message}</p>}
        </div>

        {/* Notes */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Notes</label>
          <Textarea
            {...register('notes')}
            placeholder="Special instructions, important contacts..."
            rows={2}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting ? 'Processing...' : 'Log Travel'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset()
            if (onCancel) onCancel()
          }}
        >
          Clear Form
        </Button>
      </div>
    </form>
  )
}
