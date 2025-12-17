// components/call-edit-form.tsx
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

interface PhoneCall {
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
  callerName?: string
  callerNumber: string
  callerCompany?: string
  purpose: string
  startTime: string
  endTime?: string
  duration?: number
  cost?: number
  callType?: 'incoming' | 'outgoing'
  status?: 'completed' | 'missed' | 'scheduled'
  notes?: string
  followUpRequired?: boolean
  followUpDate?: string
}

interface CallEditFormProps {
  call: PhoneCall
  onSuccess: () => void
  onCancel: () => void
}

export default function CallEditForm({ call, onSuccess, onCancel }: CallEditFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    callerName: call.callerName || '',
    callerNumber: call.callerNumber,
    callerCompany: call.callerCompany || '',
    purpose: call.purpose,
    startTime: call.startTime.split('T')[0],
    startTimeTime: call.startTime.split('T')[1]?.substring(0, 5) || '09:00',
    endTime: call.endTime ? call.endTime.split('T')[0] : '',
    endTimeTime: call.endTime ? call.endTime.split('T')[1]?.substring(0, 5) : '09:30',
    duration: call.duration || 0,
    cost: call.cost || 0,
    callType: call.callType || 'incoming',
    status: call.status || 'completed',
    notes: call.notes || '',
    followUpRequired: call.followUpRequired || false,
    followUpDate: call.followUpDate ? call.followUpDate.split('T')[0] : '',
  })

  const [employees, setEmployees] = useState<
    Array<{ _id: string; name: string; email: string; department?: string }>
  >([])
  const [selectedEmployee, setSelectedEmployee] = useState<string>('')

  useEffect(() => {
    fetchEmployees()

    // Set selected employee
    if (call.employee) {
      if (typeof call.employee === 'object') {
        setSelectedEmployee(call.employee._id)
      } else {
        setSelectedEmployee(call.employee)
      }
    }
  }, [call.employee])

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

  const calculateDuration = () => {
    const start = new Date(`${formData.startTime}T${formData.startTimeTime}`)
    const end = new Date(`${formData.endTime}T${formData.endTimeTime}`)

    if (formData.endTime && formData.endTimeTime && start < end) {
      const diffMs = end.getTime() - start.getTime()
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      setFormData((prev) => ({ ...prev, duration: diffMinutes }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Combine date and time
      const startDateTime = `${formData.startTime}T${formData.startTimeTime}:00`
      const endDateTime = formData.endTime
        ? `${formData.endTime}T${formData.endTimeTime}:00`
        : undefined

      const updateData: any = {
        callerName: formData.callerName,
        callerNumber: formData.callerNumber,
        callerCompany: formData.callerCompany,
        purpose: formData.purpose,
        startTime: startDateTime,
        endTime: endDateTime,
        duration: formData.duration,
        cost: Number(formData.cost),
        callType: formData.callType,
        status: formData.status,
        notes: formData.notes,
        followUpRequired: formData.followUpRequired,
        followUpDate: formData.followUpDate || undefined,
      }

      // Add employee if selected
      if (selectedEmployee) {
        updateData.employee = selectedEmployee
      }

      const response = await fetch(`/api/phone-calls/${call._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Call updated successfully')
        onSuccess()
      } else {
        toast.error(result.message || 'Failed to update call')
      }
    } catch (error) {
      console.error('Error updating call:', error)
      toast.error('Error updating call')
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
          {/* Caller Name */}
          <div className="space-y-2">
            <Label htmlFor="callerName">Caller Name</Label>
            <Input
              id="callerName"
              name="callerName"
              value={formData.callerName}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>

          {/* Caller Number */}
          <div className="space-y-2">
            <Label htmlFor="callerNumber">Caller Number *</Label>
            <Input
              id="callerNumber"
              name="callerNumber"
              value={formData.callerNumber}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              required
            />
          </div>

          {/* Caller Company */}
          <div className="space-y-2">
            <Label htmlFor="callerCompany">Caller Company</Label>
            <Input
              id="callerCompany"
              name="callerCompany"
              value={formData.callerCompany}
              onChange={handleChange}
              placeholder="ABC Corporation"
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
              placeholder="Meeting discussion"
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

          {/* Call Type */}
          <div className="space-y-2">
            <Label htmlFor="callType">Call Type *</Label>
            <Select
              value={formData.callType}
              onValueChange={(value) => handleSelectChange('callType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="incoming">Incoming</SelectItem>
                <SelectItem value="outgoing">Outgoing</SelectItem>
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cost */}
          <div className="space-y-2">
            <Label htmlFor="cost">Cost ($)</Label>
            <Input
              id="cost"
              name="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={handleNumberChange}
              min="0"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Date *</Label>
            <Input
              id="startTime"
              name="startTime"
              type="date"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>

          {/* Start Time */}
          <div className="space-y-2">
            <Label htmlFor="startTimeTime">Start Time *</Label>
            <Input
              id="startTimeTime"
              name="startTimeTime"
              type="time"
              value={formData.startTimeTime}
              onChange={handleChange}
              required
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endTime">End Date</Label>
            <Input
              id="endTime"
              name="endTime"
              type="date"
              value={formData.endTime}
              onChange={handleChange}
            />
          </div>

          {/* End Time */}
          <div className="space-y-2">
            <Label htmlFor="endTimeTime">End Time</Label>
            <Input
              id="endTimeTime"
              name="endTimeTime"
              type="time"
              value={formData.endTimeTime}
              onChange={handleChange}
              onBlur={calculateDuration}
            />
          </div>

          {/* Duration (auto-calculated but editable) */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleNumberChange}
              min="0"
            />
          </div>

          {/* Follow-up Date */}
          <div className="space-y-2">
            <Label htmlFor="followUpDate">Follow-up Date</Label>
            <Input
              id="followUpDate"
              name="followUpDate"
              type="date"
              value={formData.followUpDate}
              onChange={handleChange}
            />
          </div>

          {/* Follow-up Required */}
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="followUpRequired"
              name="followUpRequired"
              checked={formData.followUpRequired}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, followUpRequired: e.target.checked }))
              }
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="followUpRequired">Follow-up Required</Label>
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
            placeholder="Call details, action items, etc..."
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Call'}
        </Button>
      </div>
    </form>
  )
}
