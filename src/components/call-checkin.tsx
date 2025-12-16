// components/call-checkin.tsx
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

const formSchema = z.object({
  employee: z.string().min(1, 'Employee is required'),
  callerName: z.string().optional(),
  callerNumber: z.string().min(1, 'Phone number is required'),
  purpose: z.string().min(5, 'Purpose is required'),
  duration: z.number().min(1, 'Duration must be at least 1 minute').optional(),
  cost: z.number().min(0, 'Cost cannot be negative').optional(),
})

interface CallCheckinProps {
  onSubmitSuccess: (data: any) => void
}

interface Employee {
  _id: string
  name: string
  department?: string
  employeeId: string
  email: string
}

export default function CallCheckin({ onSubmitSuccess }: CallCheckinProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [employeesLoading, setEmployeesLoading] = useState(true)

  // Fetch employees for the select dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setEmployeesLoading(true)
        const response = await fetch('/api/employees?isActive=true&limit=100')
        const result = await response.json()
        if (result.success) {
          setEmployees(result.data)
        }
      } catch (error) {
        console.error('Error fetching employees:', error)
      } finally {
        setEmployeesLoading(false)
      }
    }
    fetchEmployees()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee: '',
      callerName: '',
      callerNumber: '',
      purpose: '',
      duration: undefined,
      cost: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      setError(null)

      console.log('Submitting call data:', values)

      // Validate employee ID format
      const objectIdRegex = /^[0-9a-fA-F]{24}$/
      if (!objectIdRegex.test(values.employee)) {
        throw new Error('Invalid employee ID format. Please select a valid employee.')
      }

      const response = await fetch('/api/phone-calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          startTime: new Date().toISOString(),
          // Calculate end time based on duration
          endTime: values.duration
            ? new Date(Date.now() + values.duration * 60000).toISOString()
            : new Date().toISOString(),
        }),
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        let errorMessage = 'Failed to log call'
        try {
          const errorData = await response.json()
          console.error('API Error Data:', errorData)
          errorMessage = errorData.error || errorData.message || errorData.details || errorMessage
        } catch (parseError) {
          console.error('Error parsing error response:', parseError)
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log('Call logged successfully:', result)

      form.reset()
      onSubmitSuccess(result.data)
    } catch (error) {
      console.error('Error submitting form:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="employee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={employeesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            employeesLoading
                              ? 'Loading employees...'
                              : employees.length === 0
                                ? 'No employees available'
                                : 'Select employee'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employeesLoading ? (
                        <SelectItem key="loading" value="loading" disabled>
                          Loading employees...
                        </SelectItem>
                      ) : employees.length === 0 ? (
                        <SelectItem key="no-employees" value="no-employees" disabled>
                          No employees found. Please add employees first.
                        </SelectItem>
                      ) : (
                        employees.map((employee) => (
                          <SelectItem key={employee._id} value={employee._id}>
                            {employee.name} ({employee.employeeId})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="callerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caller Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="callerNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 8900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Reason for the call..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="e.g., 30"
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : undefined)
                        }
                      />
                    </FormControl>
                    <FormDescription>Leave empty for unknown</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g., 3.00"
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : undefined)
                        }
                      />
                    </FormControl>
                    <FormDescription>Estimated cost of the call</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={loading}
              >
                Clear
              </Button>
              <Button
                type="submit"
                disabled={loading || employees.length === 0 || employeesLoading}
              >
                {loading ? 'Logging Call...' : 'Log Call'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
