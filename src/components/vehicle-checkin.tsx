// components/security/VehicleCheckin.tsx
'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import { vehicleSchema } from '@/lib/validations'

// Extend the vehicle schema for the form - make gate required
const vehicleCheckinSchema = vehicleSchema.extend({
  gate: z.enum(['main-gate', 'north-gate', 'south-gate', 'east-gate']),
  notes: z.string().optional(),
})

type VehicleFormData = z.infer<typeof vehicleCheckinSchema>

interface VehicleCheckinProps {
  onSuccess?: () => void
}

export default function VehicleCheckin({ onSuccess }: VehicleCheckinProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleCheckinSchema),
    defaultValues: {
      registrationNumber: '',
      vehicleType: undefined,
      ownerName: '',
      ownerPhone: '',
      purpose: '',
      currentMileage: undefined,
      gate: 'main-gate',
      notes: '',
    },
  })

  const onSubmit = async (data: VehicleFormData) => {
    try {
      setIsLoading(true)

      // Prepare data for API
      const vehicleData = {
        registrationNumber: data.registrationNumber,
        vehicleType: data.vehicleType,
        ownerName: data.ownerName,
        ownerPhone: data.ownerPhone || undefined,
        purpose: data.purpose || undefined,
        currentMileage: data.currentMileage || undefined,
        notes: data.notes || undefined,
        // These will be set by the API
        entryTime: new Date().toISOString(),
        securityGuard: 'Security Guard', // This should come from auth context
      }

      console.log('Submitting vehicle data:', vehicleData)

      // Make API call
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Vehicle checked in successfully!')
        form.reset()
        if (onSuccess) {
          onSuccess()
        }
      } else {
        console.error('Failed to check in vehicle:', result)
        toast.error(`Failed to check in vehicle: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error checking in vehicle:', error)
      toast.error('An error occurred while checking in the vehicle')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="registrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Number *</FormLabel>
                <FormControl>
                  <Input placeholder="ABC 123 XYZ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Type *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="company-car">Company Car</SelectItem>
                    <SelectItem value="employee-personal">Employee Personal</SelectItem>
                    <SelectItem value="visitor">Visitor</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ownerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Driver Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ownerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="0712345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Purpose of Visit</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Client meeting, delivery, site visit..."
                    className="min-h-20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentMileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Mileage (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="12345"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value === '' ? undefined : parseInt(value, 10))
                    }}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gate</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gate" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="main-gate">Main Gate</SelectItem>
                    <SelectItem value="north-gate">North Gate</SelectItem>
                    <SelectItem value="south-gate">South Gate</SelectItem>
                    <SelectItem value="east-gate">East Gate</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional information..."
                    className="min-h-15"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? 'Processing...' : 'Check In Vehicle'}
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isLoading}>
            Clear Form
          </Button>
        </div>
      </form>
    </Form>
  )
}
