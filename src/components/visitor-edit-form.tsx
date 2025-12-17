// components/visitor-edit-form.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface Visitor {
  _id: string
  name: string
  email: string
  phone: string
  company: string
  purpose: string
  employeeToMeet?:
    | {
        _id: string
        name: string
        email: string
        department?: string
      }
    | string
  checkInTime: string
  checkOutTime: string | null
  status: 'checked-in' | 'checked-out'
  notes?: string
  badgeNumber?: string
  identificationType?: string
  identificationNumber?: string
}

interface VisitorEditFormProps {
  visitor: Visitor
  onSuccess: () => void
  onCancel: () => void
}

export default function VisitorEditForm({ visitor, onSuccess, onCancel }: VisitorEditFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: visitor.name,
    email: visitor.email,
    phone: visitor.phone,
    company: visitor.company,
    purpose: visitor.purpose,
    checkInTime: visitor.checkInTime.split('T')[0],
    checkInTimeTime: visitor.checkInTime.split('T')[1]?.substring(0, 5) || '09:00',
    checkOutTime: visitor.checkOutTime ? visitor.checkOutTime.split('T')[0] : '',
    checkOutTimeTime: visitor.checkOutTime
      ? visitor.checkOutTime.split('T')[1]?.substring(0, 5)
      : '17:00',
    status: visitor.status,
    notes: visitor.notes || '',
    badgeNumber: visitor.badgeNumber || '',
    identificationType: visitor.identificationType || '',
    identificationNumber: visitor.identificationNumber || '',
  })

  const [employees, setEmployees] = useState<
    Array<{ _id: string; name: string; email: string; department?: string }>
  >([])
  const [selectedEmployee, setSelectedEmployee] = useState<string>('')

  useEffect(() => {
    fetchEmployees()

    // Set selected employee
    if (visitor.employeeToMeet) {
      if (typeof visitor.employeeToMeet === 'object') {
        setSelectedEmployee(visitor.employeeToMeet._id)
      } else {
        setSelectedEmployee(visitor.employeeToMeet)
      }
    }
  }, [visitor.employeeToMeet])

  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        '/api/employees?isActive=true&availableForMeetings=true&limit=100',
      )
      const result = await response.json()
      if (result.success) {
        setEmployees(result.data)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Combine date and time
      const checkInDateTime = `${formData.checkInTime}T${formData.checkInTimeTime}:00`
      const checkOutDateTime = formData.checkOutTime
        ? `${formData.checkOutTime}T${formData.checkOutTimeTime}:00`
        : null

      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        purpose: formData.purpose,
        checkInTime: checkInDateTime,
        checkOutTime: checkOutDateTime,
        status: formData.status,
        notes: formData.notes || undefined,
        badgeNumber: formData.badgeNumber || undefined,
        identificationType: formData.identificationType || undefined,
        identificationNumber: formData.identificationNumber || undefined,
      }

      // Add employee to meet if selected
      if (selectedEmployee) {
        updateData.employeeToMeet = selectedEmployee
      } else {
        // Clear employeeToMeet if none selected
        updateData.employeeToMeet = null
      }

      console.log('Updating visitor with ID:', visitor._id)
      console.log('Update data:', updateData)

      const response = await fetch(`/api/visitors/${visitor._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Visitor updated successfully')
        onSuccess()
      } else {
        toast.error(result.message || 'Failed to update visitor')
      }
    } catch (error) {
      console.error('Error updating visitor:', error)
      toast.error('Error updating visitor')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Helper to handle employee selection
  const handleEmployeeChange = (value: string) => {
    setSelectedEmployee(value)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Visitor Information */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john.doe@company.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="ABC Corporation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose *</Label>
            <Input
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Business meeting"
              required
            />
          </div>

          {/* Employee to Meet */}
          <div className="space-y-2">
            <Label htmlFor="employeeToMeet">Employee to Meet</Label>
            <Select value={selectedEmployee} onValueChange={handleEmployeeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not specified</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee._id} value={employee._id}>
                    {employee.name} ({employee.department || 'No Department'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Identification */}
          <div className="space-y-2">
            <Label htmlFor="identificationType">Identification Type</Label>
            <Select
              value={formData.identificationType}
              onValueChange={(value) => handleSelectChange('identificationType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ID type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="drivers_license">{`Driver's License`}</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="national_id">National ID</SelectItem>
                <SelectItem value="employee_id">Employee ID</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="identificationNumber">Identification Number</Label>
            <Input
              id="identificationNumber"
              name="identificationNumber"
              value={formData.identificationNumber}
              onChange={handleChange}
              placeholder="ID123456789"
            />
          </div>

          {/* Badge Number */}
          <div className="space-y-2">
            <Label htmlFor="badgeNumber">Badge Number</Label>
            <Input
              id="badgeNumber"
              name="badgeNumber"
              value={formData.badgeNumber}
              onChange={handleChange}
              placeholder="VIS-001"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checked-in">Checked In</SelectItem>
                <SelectItem value="checked-out">Checked Out</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Check-in Date */}
          <div className="space-y-2">
            <Label htmlFor="checkInTime">Check-in Date *</Label>
            <Input
              id="checkInTime"
              name="checkInTime"
              type="date"
              value={formData.checkInTime}
              onChange={handleChange}
              required
            />
          </div>

          {/* Check-in Time */}
          <div className="space-y-2">
            <Label htmlFor="checkInTimeTime">Check-in Time *</Label>
            <Input
              id="checkInTimeTime"
              name="checkInTimeTime"
              type="time"
              value={formData.checkInTimeTime}
              onChange={handleChange}
              required
            />
          </div>

          {/* Check-out Date */}
          <div className="space-y-2">
            <Label htmlFor="checkOutTime">Check-out Date</Label>
            <Input
              id="checkOutTime"
              name="checkOutTime"
              type="date"
              value={formData.checkOutTime}
              onChange={handleChange}
              disabled={formData.status === 'checked-in'}
            />
          </div>

          {/* Check-out Time */}
          <div className="space-y-2">
            <Label htmlFor="checkOutTimeTime">Check-out Time</Label>
            <Input
              id="checkOutTimeTime"
              name="checkOutTimeTime"
              type="time"
              value={formData.checkOutTimeTime}
              onChange={handleChange}
              disabled={formData.status === 'checked-in'}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional visitor information..."
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Visitor'}
        </Button>
      </div>
    </form>
  )
}
