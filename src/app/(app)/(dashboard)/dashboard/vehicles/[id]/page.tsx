// app/(app)/(dashboard)/vehicles/[id]/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Car,
  Gauge,
  Calendar,
  Clock,
  Users,
  Fuel,
  Edit,
  Trash2,
  Printer,
  Download,
  Shield,
  AlertCircle,
  CheckCircle,
  MapPin,
  Badge as BadgeIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import VehicleEditForm from '@/components/vehicle-edit-form'
import { toast } from 'sonner'
import Link from 'next/link'

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
  createdAt?: string
  updatedAt?: string
}

export default function VehicleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchVehicle(params.id as string)
    }
  }, [params.id])

  const fetchVehicle = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/vehicles/${id}`)
      const result = await response.json()

      if (result.success) {
        setVehicle(result.data)
      } else {
        toast.error('Failed to fetch vehicle details')
        router.push('/dashboard/vehicles')
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error)
      toast.error('Error loading vehicle details')
      router.push('/dashboard/vehicles')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!vehicle) return

    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        const response = await fetch(`/api/vehicles/${vehicle._id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          toast.success('Vehicle deleted successfully')
          router.push('/dashboard/vehicles')
        } else {
          const error = await response.json()
          toast.error(`Failed to delete: ${error.message || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Error deleting vehicle:', error)
        toast.error('Error deleting vehicle')
      }
    }
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    fetchVehicle(params.id as string)
    toast.success('Vehicle updated successfully')
  }

  const handleUpdateStatus = async (newStatus: Vehicle['status']) => {
    if (!vehicle) return

    try {
      const response = await fetch(`/api/vehicles/${vehicle._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success(`Vehicle status updated to ${newStatus}`)
        fetchVehicle(vehicle._id)
      } else {
        const error = await response.json()
        toast.error(`Failed to update: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating vehicle:', error)
      toast.error('Error updating vehicle status')
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
      available: 'bg-blue-100 text-blue-800',
      inactive: 'bg-gray-100 text-gray-800',
    }
    const icons = {
      active: <CheckCircle className="h-3 w-3 mr-1" />,
      maintenance: <AlertCircle className="h-3 w-3 mr-1" />,
      overdue: <AlertCircle className="h-3 w-3 mr-1" />,
      available: <CheckCircle className="h-3 w-3 mr-1" />,
      inactive: <AlertCircle className="h-3 w-3 mr-1" />,
    }
    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100'}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      'Company Car': 'bg-blue-100 text-blue-800',
      'Company Truck': 'bg-orange-100 text-orange-800',
      'Employee Personal': 'bg-purple-100 text-purple-800',
      'Executive Car': 'bg-indigo-100 text-indigo-800',
      'Field Vehicle': 'bg-green-100 text-green-800',
      'Visitor Vehicle': 'bg-gray-100 text-gray-800',
    }
    return <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100'}>{type}</Badge>
  }

  const getAssignedToInfo = (assignedTo: any) => {
    if (!assignedTo) return null
    if (typeof assignedTo === 'object') return assignedTo
    return { name: assignedTo, email: '' }
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getDaysUntil = (dateString: string) => {
    const targetDate = new Date(dateString)
    const today = new Date()
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Car className="h-12 w-12 text-gray-400 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold">Vehicle Not Found</h2>
          <p className="mt-2 text-gray-600">{`The vehicle you're looking for doesn't exist.`}</p>
          <Link href="/dashboard/vehicles">
            <Button className="mt-4">Back to Vehicles</Button>
          </Link>
        </div>
      </div>
    )
  }

  const assignedToInfo = getAssignedToInfo(vehicle.assignedTo)
  const insuranceDays = getDaysUntil(vehicle.insuranceExpiry)
  const serviceDays = getDaysUntil(vehicle.serviceDue)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/vehicles">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </h1>
            <p className="text-muted-foreground">
              Registration: {vehicle.registration} • VIN: {vehicle.vin || 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Vehicle</DialogTitle>
              </DialogHeader>
              <VehicleEditForm
                vehicle={vehicle}
                onSuccess={handleEditSuccess}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="icon" title="Print">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" title="Export">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDelete} title="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Vehicle Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Car className="h-4 w-4" />
                    Registration
                  </div>
                  <p className="font-medium text-xl">{vehicle.registration}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    VIN
                  </div>
                  <p className="font-medium font-mono">{vehicle.vin || 'N/A'}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    Make & Model
                  </div>
                  <p className="font-medium">
                    {vehicle.make} {vehicle.model}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    Year
                  </div>
                  <p className="font-medium">{vehicle.year}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    Type
                  </div>
                  <div className="flex items-center gap-2">{getTypeBadge(vehicle.type)}</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Fuel className="h-4 w-4" />
                    Fuel Type
                  </div>
                  <p className="font-medium">{vehicle.fuelType}</p>
                </div>

                {vehicle.color && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      Color
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: vehicle.color.toLowerCase() }}
                      />
                      <p className="font-medium">{vehicle.color}</p>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Gauge className="h-4 w-4" />
                    Current Mileage
                  </div>
                  <p className="font-medium">{vehicle.currentMileage.toLocaleString()} km</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignedToInfo && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Users className="h-4 w-4" />
                      Assigned To
                    </div>
                    <div>
                      <p className="font-medium">{assignedToInfo.name}</p>
                      {assignedToInfo.email && (
                        <p className="text-sm text-muted-foreground">{assignedToInfo.email}</p>
                      )}
                      {assignedToInfo.department && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {assignedToInfo.department}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {vehicle.department && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <BadgeIcon className="h-4 w-4" />
                      Department
                    </div>
                    <p className="font-medium">{vehicle.department}</p>
                  </div>
                )}

                {vehicle.location && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4" />
                      Location
                    </div>
                    <p className="font-medium">{vehicle.location}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Maintenance & Insurance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Insurance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                  <p className={`font-medium ${insuranceDays <= 30 ? 'text-red-600' : ''}`}>
                    {formatDate(vehicle.insuranceExpiry)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Days Remaining
                  </label>
                  <p className={`font-medium ${insuranceDays <= 30 ? 'text-red-600' : ''}`}>
                    {insuranceDays} days
                    {insuranceDays <= 30 && ' ⚠️'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                  <p className={`font-medium ${serviceDays <= 30 ? 'text-red-600' : ''}`}>
                    {formatDate(vehicle.serviceDue)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Days Remaining
                  </label>
                  <p className={`font-medium ${serviceDays <= 30 ? 'text-red-600' : ''}`}>
                    {serviceDays} days
                    {serviceDays <= 30 && ' ⚠️'}
                  </p>
                </div>
                {vehicle.lastServiceDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Service
                    </label>
                    <p className="font-medium">{formatDate(vehicle.lastServiceDate)}</p>
                  </div>
                )}
                {vehicle.nextServiceMileage && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Next Service at
                    </label>
                    <p className="font-medium">{vehicle.nextServiceMileage.toLocaleString()} km</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Status & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                {getStatusBadge(vehicle.status)}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Update Status:</p>
                <div className="flex flex-wrap gap-2">
                  {['active', 'maintenance', 'available', 'inactive'].map((status) => (
                    <Button
                      key={status}
                      variant={vehicle.status === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus(status as Vehicle['status'])}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {vehicle.createdAt && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Record Created</p>
                    <p className="text-sm text-muted-foreground">{formatDate(vehicle.createdAt)}</p>
                  </div>
                </div>
              )}

              {vehicle.lastServiceDate && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Car className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Last Service</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(vehicle.lastServiceDate)}
                    </p>
                  </div>
                </div>
              )}

              {vehicle.updatedAt && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">{formatDate(vehicle.updatedAt)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage this vehicle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Car className="h-4 w-4" />
                Log Service
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Shield className="h-4 w-4" />
                Update Insurance
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Printer className="h-4 w-4" />
                Print Details
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
