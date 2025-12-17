// components/travel-log-edit-form.tsx
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

interface TravelLog {
  _id: string
  employee:
    | {
        _id: string
        name: string
        email: string
        department?: string
        employeeId?: string
      }
    | string
  destination: string
  purpose: string
  departureTime: string
  expectedReturn?: string
  actualReturn?: string
  status: 'pending' | 'approved' | 'departed' | 'returned' | 'cancelled'
  travelType: 'business' | 'client_visit' | 'conference' | 'training' | 'other'
  transportation: 'flight' | 'car' | 'train' | 'other'
  accommodation?: string
  estimatedCost?: number
  actualCost?: number
  notes?: string
  approvedBy?:
    | string
    | {
        _id: string
        name: string
        email: string
      }
}

interface TravelLogEditFormProps {
  travelLog: TravelLog
  onSuccess: () => void
  onCancel: () => void
}

export default function TravelLogEditForm({
  travelLog,
  onSuccess,
  onCancel,
}: TravelLogEditFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    destination: travelLog.destination,
    purpose: travelLog.purpose,
    departureDate: travelLog.departureTime.split('T')[0],
    departureTime: travelLog.departureTime.split('T')[1]?.substring(0, 5) || '09:00',
    expectedReturnDate: travelLog.expectedReturn ? travelLog.expectedReturn.split('T')[0] : '',
    expectedReturnTime: travelLog.expectedReturn
      ? travelLog.expectedReturn.split('T')[1]?.substring(0, 5)
      : '17:00',
    travelType: travelLog.travelType,
    transportation: travelLog.transportation,
    accommodation: travelLog.accommodation || '',
    estimatedCost: travelLog.estimatedCost || 0,
    actualCost: travelLog.actualCost || 0,
    status: travelLog.status,
    notes: travelLog.notes || '',
  })

  const [employees, setEmployees] = useState<
    Array<{ _id: string; name: string; email: string; department?: string }>
  >([])
  const [selectedEmployee, setSelectedEmployee] = useState<string>('')

  useEffect(() => {
    fetchEmployees()

    // Set selected employee
    if (travelLog.employee) {
      if (typeof travelLog.employee === 'object') {
        setSelectedEmployee(travelLog.employee._id)
      } else {
        setSelectedEmployee(travelLog.employee)
      }
    }
  }, [travelLog.employee])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees?isActive=true&limit=100')
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
      const departureDateTime = `${formData.departureDate}T${formData.departureTime}:00`
      const expectedReturnDateTime = formData.expectedReturnDate
        ? `${formData.expectedReturnDate}T${formData.expectedReturnTime}:00`
        : undefined

      const updateData: any = {
        destination: formData.destination,
        purpose: formData.purpose,
        departureTime: departureDateTime,
        expectedReturn: expectedReturnDateTime,
        travelType: formData.travelType,
        transportation: formData.transportation,
        accommodation: formData.accommodation || undefined,
        estimatedCost: formData.estimatedCost ? Number(formData.estimatedCost) : undefined,
        actualCost: formData.actualCost ? Number(formData.actualCost) : undefined,
        status: formData.status,
        notes: formData.notes || undefined,
      }

      // Add employee if selected
      if (selectedEmployee) {
        updateData.employee = selectedEmployee
      }

      const response = await fetch(`/api/travel-logs/${travelLog._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Travel log updated successfully')
        onSuccess()
      } else {
        toast.error(result.message || 'Failed to update travel log')
      }
    } catch (error) {
      console.error('Error updating travel log:', error)
      toast.error('Error updating travel log')
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

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value === '' ? 0 : Number(value) }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination">Destination *</Label>
            <Input
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="New York, NY"
              required
            />
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose *</Label>
            <Input
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Client meeting"
              required
            />
          </div>

          {/* Employee */}
          <div className="space-y-2">
            <Label htmlFor="employee">Employee *</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee._id} value={employee._id}>
                    {employee.name} ({employee.department || 'No Department'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Travel Type */}
          <div className="space-y-2">
            <Label htmlFor="travelType">Travel Type *</Label>
            <Select
              value={formData.travelType}
              onValueChange={(value) => handleSelectChange('travelType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="client_visit">Client Visit</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transportation */}
          <div className="space-y-2">
            <Label htmlFor="transportation">Transportation *</Label>
            <Select
              value={formData.transportation}
              onValueChange={(value) => handleSelectChange('transportation', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transportation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flight">Flight</SelectItem>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="train">Train</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="departed">Departed</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Accommodation */}
          <div className="space-y-2">
            <Label htmlFor="accommodation">Accommodation</Label>
            <Input
              id="accommodation"
              name="accommodation"
              value={formData.accommodation}
              onChange={handleChange}
              placeholder="Hilton Hotel"
            />
          </div>

          {/* Estimated Cost */}
          <div className="space-y-2">
            <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
            <Input
              id="estimatedCost"
              name="estimatedCost"
              type="number"
              step="0.01"
              value={formData.estimatedCost}
              onChange={handleNumberChange}
              min="0"
            />
          </div>

          {/* Actual Cost */}
          <div className="space-y-2">
            <Label htmlFor="actualCost">Actual Cost ($)</Label>
            <Input
              id="actualCost"
              name="actualCost"
              type="number"
              step="0.01"
              value={formData.actualCost}
              onChange={handleNumberChange}
              min="0"
            />
          </div>

          {/* Departure Date */}
          <div className="space-y-2">
            <Label htmlFor="departureDate">Departure Date *</Label>
            <Input
              id="departureDate"
              name="departureDate"
              type="date"
              value={formData.departureDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Departure Time */}
          <div className="space-y-2">
            <Label htmlFor="departureTime">Departure Time *</Label>
            <Input
              id="departureTime"
              name="departureTime"
              type="time"
              value={formData.departureTime}
              onChange={handleChange}
              required
            />
          </div>

          {/* Expected Return Date */}
          <div className="space-y-2">
            <Label htmlFor="expectedReturnDate">Expected Return Date</Label>
            <Input
              id="expectedReturnDate"
              name="expectedReturnDate"
              type="date"
              value={formData.expectedReturnDate}
              onChange={handleChange}
            />
          </div>

          {/* Expected Return Time */}
          <div className="space-y-2">
            <Label htmlFor="expectedReturnTime">Expected Return Time</Label>
            <Input
              id="expectedReturnTime"
              name="expectedReturnTime"
              type="time"
              value={formData.expectedReturnTime}
              onChange={handleChange}
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
            placeholder="Additional details, flight numbers, hotel information, etc..."
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Travel Log'}
        </Button>
      </div>
    </form>
  )
}
