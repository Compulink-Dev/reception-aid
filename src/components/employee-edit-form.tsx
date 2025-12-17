// components/employee-edit-form.tsx
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface Employee {
  _id: string
  name: string
  employeeId: string
  email: string
  phone?: string
  department?: string
  position?: string
  isActive: boolean
  availableForMeetings?: boolean
  hireDate?: string
  address?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
}

interface EmployeeEditFormProps {
  employee: Employee
  onSuccess: () => void
  onCancel: () => void
}

export default function EmployeeEditForm({ employee, onSuccess, onCancel }: EmployeeEditFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: employee.name,
    employeeId: employee.employeeId,
    email: employee.email,
    phone: employee.phone || '',
    department: employee.department || '',
    position: employee.position || '',
    isActive: employee.isActive,
    availableForMeetings: employee.availableForMeetings || true,
    hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
    address: employee.address || '',
    emergencyName: employee.emergencyContact?.name || '',
    emergencyPhone: employee.emergencyContact?.phone || '',
    emergencyRelationship: employee.emergencyContact?.relationship || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      const updateData: any = {
        name: formData.name,
        employeeId: formData.employeeId,
        email: formData.email,
        phone: formData.phone || undefined,
        department: formData.department || undefined,
        position: formData.position || undefined,
        isActive: formData.isActive,
        availableForMeetings: formData.availableForMeetings,
        hireDate: formData.hireDate || undefined,
        address: formData.address || undefined,
      }

      // Add emergency contact if provided
      if (formData.emergencyName && formData.emergencyPhone) {
        updateData.emergencyContact = {
          name: formData.emergencyName,
          phone: formData.emergencyPhone,
          relationship: formData.emergencyRelationship || 'Other',
        }
      }

      const response = await fetch(`/api/employees/${employee._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Employee updated successfully')
        onSuccess()
      } else {
        toast.error(result.message || 'Failed to update employee')
      }
    } catch (error) {
      console.error('Error updating employee:', error)
      toast.error('Error updating employee')
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

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
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
            <Label htmlFor="employeeId">Employee ID *</Label>
            <Input
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="EMP-001"
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
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => handleSelectChange('department', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Software Engineer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hireDate">Hire Date</Label>
            <Input
              id="hireDate"
              name="hireDate"
              type="date"
              value={formData.hireDate}
              onChange={handleChange}
            />
          </div>

          {/* Status Switches */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Active Employee</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="availableForMeetings"
                checked={formData.availableForMeetings}
                onCheckedChange={(checked) => handleSwitchChange('availableForMeetings', checked)}
              />
              <Label htmlFor="availableForMeetings">Available for Meetings</Label>
            </div>
          </div>

          {/* Address */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St, City, State, ZIP Code"
              rows={3}
            />
          </div>

          {/* Emergency Contact Section */}
          <div className="md:col-span-2 pt-4 border-t">
            <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyName">Contact Name</Label>
                <Input
                  id="emergencyName"
                  name="emergencyName"
                  value={formData.emergencyName}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyRelationship">Relationship</Label>
                <Select
                  value={formData.emergencyRelationship}
                  onValueChange={(value) => handleSelectChange('emergencyRelationship', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Employee'}
        </Button>
      </div>
    </form>
  )
}
