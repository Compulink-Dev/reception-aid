//@ts-nocheck
// components/security/VehicleCheckin.tsx
'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { vehicleSchema } from '@/lib/validations'
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

type VehicleFormData = z.infer<typeof vehicleSchema>

interface VehicleCheckinProps {
  onSuccess?: () => void
}

export default function VehicleCheckin({ onSuccess }: VehicleCheckinProps) {
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registrationNumber: '',
      vehicleType: '',
      ownerName: '',
      ownerPhone: '',
      purpose: '',
      currentMileage: undefined,
    },
  })

  const onSubmit = async (data: VehicleFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log('Vehicle check-in data:', data)
      alert('Vehicle checked in successfully!')

      form.reset()
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error checking in vehicle:', error)
      alert('Failed to check in vehicle. Please try again.')
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="service">Service Vehicle</SelectItem>
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
                    className="min-h-[80px]"
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
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Gate</FormLabel>
            <Select defaultValue="main-gate">
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
          </FormItem>

          <FormItem className="md:col-span-2">
            <FormLabel>Additional Notes</FormLabel>
            <FormControl>
              <Textarea placeholder="Any additional information..." className="min-h-[60px]" />
            </FormControl>
          </FormItem>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting} className="flex-1">
            {form.formState.isSubmitting ? 'Processing...' : 'Check In Vehicle'}
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Clear Form
          </Button>
        </div>
      </form>
    </Form>
  )
}
