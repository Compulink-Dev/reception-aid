// components/reception/VisitorCheckin.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { visitorSchema } from '@/lib/validations'
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
import { Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'

// Define Employee interface
interface Employee {
  id: string
  name: string
  employeeId?: string
  department?: string
  position?: string
  email: string
  phone?: string
  isActive?: boolean
  availableForMeetings?: boolean
}

type VisitorFormData = z.infer<typeof visitorSchema>

interface VisitorCheckinProps {
  onSubmitSuccess?: (data: VisitorFormData) => void
  onCancel?: () => void
}

export default function VisitorCheckin({ onSubmitSuccess, onCancel }: VisitorCheckinProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [employeeSearch, setEmployeeSearch] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<VisitorFormData>({
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      company: '',
      purpose: '',
      employeeToMeet: undefined,
      notes: '',
      department: '',
    },
  })

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees()
  }, [])

  // Filter employees when search changes
  useEffect(() => {
    if (employeeSearch.trim() === '') {
      setFilteredEmployees(employees)
    } else {
      const filtered = employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
          employee.email.toLowerCase().includes(employeeSearch.toLowerCase()) ||
          employee.position?.toLowerCase().includes(employeeSearch.toLowerCase()) ||
          employee.department?.toLowerCase().includes(employeeSearch.toLowerCase()),
      )
      setFilteredEmployees(filtered)
    }
  }, [employeeSearch, employees])

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true)
      const params = new URLSearchParams()
      params.append('isActive', 'true')
      params.append('limit', '100')

      const response = await fetch(`/api/employees?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setEmployees(result.data)
        setFilteredEmployees(result.data)
      } else {
        toast.error('Failed to load employees')
        console.error('Failed to fetch employees:', result.error)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
      toast.error('Error loading employees list')
    } finally {
      setLoadingEmployees(false)
    }
  }

  const onSubmit = async (data: VisitorFormData) => {
    try {
      const response = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          checkInTime: new Date().toISOString(),
          status: 'checked-in',
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Visitor checked in successfully!')
        reset()
        if (onSubmitSuccess) {
          onSubmitSuccess(data)
        }
      }
    } catch (error) {
      console.error('Error checking in visitor:', error)
      toast.error('Error checking in visitor. Please try again.')
    }
  }

  // Group employees by department for better organization
  const employeesByDepartment = filteredEmployees.reduce(
    (acc, employee) => {
      const dept = employee.department || 'other'
      if (!acc[dept]) {
        acc[dept] = []
      }
      acc[dept].push(employee)
      return acc
    },
    {} as Record<string, Employee[]>,
  )

  const formatDepartment = (dept: string) => {
    if (!dept || dept === 'other') return 'Other'
    return dept.charAt(0).toUpperCase() + dept.slice(1)
  }

  const departmentOptions = [
    { value: 'it', label: 'IT' },
    { value: 'hr', label: 'HR' },
    { value: 'finance', label: 'Finance' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'operations', label: 'Operations' },
    { value: 'executive', label: 'Executive' },
    { value: 'legal', label: 'Legal' },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('name')}
            placeholder="John Doe"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('phone')}
            placeholder="0712345678"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email (optional)</label>
          <Input {...register('email')} type="email" placeholder="john@example.com" />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Company</label>
          <Input {...register('company')} placeholder="Company Name" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">
            Purpose of Visit <span className="text-red-500">*</span>
          </label>
          <Textarea
            {...register('purpose')}
            placeholder="Brief description of the visit purpose..."
            className={errors.purpose ? 'border-red-500' : ''}
            rows={3}
          />
          {errors.purpose && <p className="text-sm text-red-500">{errors.purpose.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Employee to Meet</label>
          <Select
            onValueChange={(value) => {
              // Convert empty string to undefined
              if (value === 'not-specified') {
                setValue('employeeToMeet', undefined)
              } else {
                setValue('employeeToMeet', value)
              }
            }}
            disabled={loadingEmployees}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingEmployees
                    ? 'Loading employees...'
                    : employees.length === 0
                      ? 'No employees available'
                      : 'Select employee'
                }
              />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {loadingEmployees ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Loading employees...</span>
                </div>
              ) : employees.length === 0 ? (
                <SelectItem value="no-employees" disabled>
                  No employees available
                </SelectItem>
              ) : (
                <>
                  {/* Optional search input within dropdown */}
                  <div className="p-2 border-b sticky top-0 bg-background z-10">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search employees..."
                        value={employeeSearch}
                        onChange={(e) => setEmployeeSearch(e.target.value)}
                        className="h-8 text-sm pl-8"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  {/* "Not specified" option */}
                  <SelectItem value="not-specified">
                    <span className="text-muted-foreground">Not specified</span>
                  </SelectItem>

                  {/* Group employees by department */}
                  {Object.entries(employeesByDepartment).map(([department, deptEmployees]) => (
                    <div key={department}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {formatDepartment(department)} ({deptEmployees.length})
                      </div>
                      {deptEmployees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          <div className="flex flex-col py-1">
                            <span className="font-medium">{employee.name}</span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {employee.position && <span>{employee.position}</span>}
                              {employee.position && employee.department && <span>•</span>}
                              {employee.department && (
                                <span>{formatDepartment(employee.department)}</span>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Department</label>
          <Select
            onValueChange={(value) => {
              // Convert empty string to undefined
              if (value === 'not-specified') {
                setValue('department', undefined)
              } else {
                setValue('department', value)
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-specified">
                <span className="text-muted-foreground">Not specified</span>
              </SelectItem>
              {departmentOptions.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Additional Notes</label>
          <Textarea {...register('notes')} placeholder="Any additional information..." rows={2} />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Check In Visitor'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset()
            if (onCancel) onCancel()
          }}
          disabled={isSubmitting}
        >
          Clear Form
        </Button>
      </div>
    </form>
  )
}
