// components/vehicle-edit-form.tsx
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

interface Vehicle {
  _id: string
  registration: string
  make: string
  model: string
  year: number
  type:
    | 'Company Car'
    | 'Company Truck'
    | 'Employee Personal'
    | 'Executive Car'
    | 'Field Vehicle'
    | 'Visitor Vehicle'
  department?: string
  assignedTo?:
    | {
        _id: string
        name: string
        email: string
        department?: string
      }
    | string
  currentMileage: number
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'
  insuranceExpiry: string
  serviceDue: string
  status: 'active' | 'maintenance' | 'overdue' | 'available' | 'inactive'
  location?: string
  vin?: string
  color?: string
  lastServiceDate?: string
  nextServiceMileage?: number
  notes?: string
}

interface VehicleEditFormProps {
  vehicle: Vehicle
  onSuccess: () => void
  onCancel: () => void
}

export default function VehicleEditForm({ vehicle, onSuccess, onCancel }: VehicleEditFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    registration: vehicle.registration,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    type: vehicle.type,
    department: vehicle.department || '',
    currentMileage: vehicle.currentMileage,
    fuelType: vehicle.fuelType,
    insuranceExpiry: vehicle.insuranceExpiry.split('T')[0],
    serviceDue: vehicle.serviceDue.split('T')[0],
    status: vehicle.status,
    location: vehicle.location || '',
    vin: vehicle.vin || '',
    color: vehicle.color || '',
    lastServiceDate: vehicle.lastServiceDate ? vehicle.lastServiceDate.split('T')[0] : '',
    nextServiceMileage: vehicle.nextServiceMileage || 0,
    notes: vehicle.notes || '',
  })

  const [employees, setEmployees] = useState<
    Array<{ _id: string; name: string; email: string; department?: string }>
  >([])
  const [assignedTo, setAssignedTo] = useState<string>('')

  useEffect(() => {
    // Fetch employees for assignment dropdown
    fetchEmployees()

    // Set assignedTo if it exists
    if (vehicle.assignedTo) {
      if (typeof vehicle.assignedTo === 'object') {
        setAssignedTo(vehicle.assignedTo._id)
      } else {
        setAssignedTo(vehicle.assignedTo)
      }
    }
  }, [vehicle.assignedTo])

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

      // Prepare update data
      const updateData: any = {
        ...formData,
        currentMileage: Number(formData.currentMileage),
        year: Number(formData.year),
        nextServiceMileage: formData.nextServiceMileage
          ? Number(formData.nextServiceMileage)
          : undefined,
      }

      // Add assignedTo if selected
      if (assignedTo) {
        updateData.assignedTo = assignedTo
      }

      const response = await fetch(`/api/vehicles/${vehicle._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Vehicle updated successfully')
        onSuccess()
      } else {
        toast.error(result.message || 'Failed to update vehicle')
      }
    } catch (error) {
      console.error('Error updating vehicle:', error)
      toast.error('Error updating vehicle')
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
          {/* Registration */}
          <div className="space-y-2">
            <Label htmlFor="registration">Registration Number *</Label>
            <Input
              id="registration"
              name="registration"
              value={formData.registration}
              onChange={handleChange}
              placeholder="ABC 123 XYZ"
              required
            />
          </div>

          {/* VIN */}
          <div className="space-y-2">
            <Label htmlFor="vin">VIN (Vehicle Identification Number)</Label>
            <Input
              id="vin"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              placeholder="1HGCM82633A123456"
            />
          </div>

          {/* Make */}
          <div className="space-y-2">
            <Label htmlFor="make">Make *</Label>
            <Input
              id="make"
              name="make"
              value={formData.make}
              onChange={handleChange}
              placeholder="Toyota"
              required
            />
          </div>

          {/* Model */}
          <div className="space-y-2">
            <Label htmlFor="model">Model *</Label>
            <Input
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Camry"
              required
            />
          </div>

          {/* Year */}
          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleNumberChange}
              min="1900"
              max={new Date().getFullYear() + 1}
              required
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Black"
            />
          </div>

          {/* Vehicle Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Vehicle Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Company Car">Company Car</SelectItem>
                <SelectItem value="Company Truck">Company Truck</SelectItem>
                <SelectItem value="Employee Personal">Employee Personal</SelectItem>
                <SelectItem value="Executive Car">Executive Car</SelectItem>
                <SelectItem value="Field Vehicle">Field Vehicle</SelectItem>
                <SelectItem value="Visitor Vehicle">Visitor Vehicle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Department */}
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
                <SelectItem value="logistics">Logistics</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fuel Type */}
          <div className="space-y-2">
            <Label htmlFor="fuelType">Fuel Type *</Label>
            <Select
              value={formData.fuelType}
              onValueChange={(value) => handleSelectChange('fuelType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Petrol">Petrol</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Current Mileage */}
          <div className="space-y-2">
            <Label htmlFor="currentMileage">Current Mileage (km) *</Label>
            <Input
              id="currentMileage"
              name="currentMileage"
              type="number"
              value={formData.currentMileage}
              onChange={handleNumberChange}
              min="0"
              required
            />
          </div>

          {/* Next Service Mileage */}
          <div className="space-y-2">
            <Label htmlFor="nextServiceMileage">Next Service at Mileage (km)</Label>
            <Input
              id="nextServiceMileage"
              name="nextServiceMileage"
              type="number"
              value={formData.nextServiceMileage}
              onChange={handleNumberChange}
              min="0"
            />
          </div>

          {/* Insurance Expiry */}
          <div className="space-y-2">
            <Label htmlFor="insuranceExpiry">Insurance Expiry Date *</Label>
            <Input
              id="insuranceExpiry"
              name="insuranceExpiry"
              type="date"
              value={formData.insuranceExpiry}
              onChange={handleChange}
              required
            />
          </div>

          {/* Service Due Date */}
          <div className="space-y-2">
            <Label htmlFor="serviceDue">Service Due Date *</Label>
            <Input
              id="serviceDue"
              name="serviceDue"
              type="date"
              value={formData.serviceDue}
              onChange={handleChange}
              required
            />
          </div>

          {/* Last Service Date */}
          <div className="space-y-2">
            <Label htmlFor="lastServiceDate">Last Service Date</Label>
            <Input
              id="lastServiceDate"
              name="lastServiceDate"
              type="date"
              value={formData.lastServiceDate}
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Current Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Main Parking Lot"
            />
          </div>

          {/* Assigned To */}
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Not Assigned</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee._id} value={employee._id}>
                    {employee.name} ({employee.department || 'No Department'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            placeholder="Additional notes about the vehicle..."
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Vehicle'}
        </Button>
      </div>
    </form>
  )
}
