// components/security-dashboard.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Plus,
  Car,
  LogIn,
  LogOut,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  MapPin,
  Shield,
  Users,
  Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import VehicleCheckin from '@/components/vehicle-checkin'
import Link from 'next/link'

// Define Vehicle interface
interface Vehicle {
  id: string
  registrationNumber: string
  vehicleType: 'company-car' | 'employee-personal' | 'visitor' | 'delivery'
  ownerName: string
  ownerPhone?: string
  purpose?: string
  entryTime: string
  exitTime?: string
  currentMileage?: number
  notes?: string
  securityGuard: string
  status: 'checked-in' | 'checked-out' | 'pending' | 'overdue'
}

// API response type
interface VehiclesResponse {
  success: boolean
  data: Vehicle[]
  pagination?: {
    totalDocs: number
    totalPages: number
    page: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export default function SecurityDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch vehicles on component mount
  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async (search?: string) => {
    try {
      setRefreshing(true)
      const params = new URLSearchParams()
      if (search) {
        params.append('search', search)
      }

      const response = await fetch(`/api/vehicles?${params.toString()}`)
      const result: VehiclesResponse = await response.json()

      if (result.success) {
        setVehicles(result.data)
      } else {
        console.error('Failed to fetch vehicles:', result)
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    fetchVehicles(value)
  }

  // Stats calculations
  const totalVehicles = vehicles.length
  const activeVehicles = vehicles.filter((v) => v.status === 'checked-in').length
  const pendingVehicles = vehicles.filter((v) => v.status === 'pending').length
  const overdueVehicles = vehicles.filter((v) => v.status === 'overdue').length
  const checkedOutToday = vehicles.filter(
    (v) =>
      v.status === 'checked-out' &&
      v.exitTime &&
      new Date(v.exitTime).toDateString() === new Date().toDateString(),
  ).length

  const handleCheckOut = async (vehicleId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'checked-out',
          exitTime: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        fetchVehicles(searchTerm)
        toast.success('Vehicle checked out successfully')
      } else {
        const error = await response.json()
        console.error('Failed to check out vehicle:', error)
        toast.error(`Failed to check out: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error checking out vehicle:', error)
      toast.error('Error checking out vehicle. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (vehicleId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'checked-in',
        }),
      })

      if (response.ok) {
        fetchVehicles(searchTerm)
        toast.success('Vehicle approved successfully')
      } else {
        const error = await response.json()
        console.error('Failed to approve vehicle:', error)
        toast.error(`Failed to approve: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error approving vehicle:', error)
      toast.error('Error approving vehicle. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (vehicleId: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle record?')) {
      try {
        setLoading(true)
        const response = await fetch(`/api/vehicles/${vehicleId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          fetchVehicles(searchTerm)
          toast.success('Vehicle record deleted successfully')
        } else {
          const error = await response.json()
          console.error('Failed to delete vehicle:', error)
          toast.error(`Failed to delete: ${error.message || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Error deleting vehicle:', error)
        toast.error('Error deleting vehicle. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleAddVehicle = () => {
    fetchVehicles(searchTerm)
    setIsAddDialogOpen(false)
  }

  const refreshData = () => {
    fetchVehicles(searchTerm)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'checked-in':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Checked In</Badge>
      case 'checked-out':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Checked Out</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getVehicleTypeBadge = (type: string) => {
    const types: Record<string, string> = {
      'company-car': 'Company Car',
      'employee-personal': 'Employee Personal',
      visitor: 'Visitor',
      delivery: 'Delivery',
    }
    const colors: Record<string, string> = {
      'company-car': 'bg-blue-100 text-blue-800',
      'employee-personal': 'bg-green-100 text-green-800',
      visitor: 'bg-purple-100 text-purple-800',
      delivery: 'bg-amber-100 text-amber-800',
    }
    return (
      <Badge className={`${colors[type] || 'bg-gray-100'} hover:bg-opacity-80`}>
        {types[type] || type}
      </Badge>
    )
  }

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const calculateDuration = (entryTime: string, exitTime?: string) => {
    if (!exitTime) return null

    const start = new Date(entryTime)
    const end = new Date(exitTime)
    const diffMs = end.getTime() - start.getTime()

    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  // Render table body based on state
  const renderTableBody = () => {
    if (refreshing) {
      return (
        <TableRow key="loading">
          <TableCell colSpan={9} className="text-center py-8">
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-muted-foreground">Loading vehicle records...</span>
            </div>
          </TableCell>
        </TableRow>
      )
    }

    if (vehicles.length === 0) {
      return (
        <TableRow key="empty">
          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
            {searchTerm
              ? 'No vehicle records found. Try adjusting your search.'
              : 'No vehicle records found.'}
          </TableCell>
        </TableRow>
      )
    }

    return vehicles.map((vehicle) => (
      <TableRow key={vehicle.id}>
        <TableCell>
          <div>
            <p className="font-medium">{vehicle.registrationNumber}</p>
            <div className="mt-1">{getVehicleTypeBadge(vehicle.vehicleType)}</div>
          </div>
        </TableCell>
        <TableCell>
          <div>
            <p className="font-medium">{vehicle.ownerName}</p>
            {vehicle.ownerPhone && (
              <p className="text-xs text-muted-foreground">{vehicle.ownerPhone}</p>
            )}
          </div>
        </TableCell>
        <TableCell className="max-w-xs">
          <p className="truncate">{vehicle.purpose || 'No purpose specified'}</p>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <LogIn className="h-3 w-3 text-green-500" />
            <span className="text-sm">{formatDateTime(vehicle.entryTime)}</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {vehicle.exitTime ? (
              <>
                <LogOut className="h-3 w-3 text-blue-500" />
                <span className="text-sm">{formatDateTime(vehicle.exitTime)}</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Not checked out</span>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div>
            {vehicle.currentMileage ? (
              <p className="font-medium">{vehicle.currentMileage.toLocaleString()} km</p>
            ) : (
              <p className="text-sm text-muted-foreground">N/A</p>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            {getStatusBadge(vehicle.status)}
            {vehicle.entryTime && vehicle.exitTime && (
              <p className="text-xs text-muted-foreground">
                Duration: {calculateDuration(vehicle.entryTime, vehicle.exitTime)}
              </p>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div>
            <p className="text-sm font-medium">{vehicle.securityGuard}</p>
            <p className="text-xs text-muted-foreground">Security Officer</p>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Link href={`/dashboard/security/vehicles/${vehicle.id}`}>
              <Button variant="ghost" size="icon" title="View Details">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>

            {vehicle.status === 'pending' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleApprove(vehicle.id)}
                disabled={loading}
                title="Approve Entry"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}

            {vehicle.status === 'checked-in' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCheckOut(vehicle.id)}
                disabled={loading}
                title="Check Out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(vehicle.id)}
              disabled={loading}
              title="Delete Record"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Gate Management</h1>
          <p className="text-muted-foreground">Track and manage vehicle entry and exit</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={refreshData}
            disabled={refreshing}
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Check In Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Vehicle Check-in</DialogTitle>
                <DialogDescription>Record vehicle entry details and mileage</DialogDescription>
              </DialogHeader>
              <VehicleCheckin onSuccess={handleAddVehicle} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVehicles}</div>
            <p className="text-xs text-muted-foreground">All vehicle records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVehicles}</div>
            <p className="text-xs text-muted-foreground">Currently on site</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingVehicles}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Vehicles</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueVehicles}</div>
            <p className="text-xs text-muted-foreground">Exceeded time limit</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Gate Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Vehicles Checked Out Today</span>
                <span className="font-medium">{checkedOutToday}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Visitors Today</span>
                <span className="font-medium">
                  {vehicles.filter((v) => v.vehicleType === 'visitor').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Deliveries Today</span>
                <span className="font-medium">
                  {vehicles.filter((v) => v.vehicleType === 'delivery').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <MapPin className="h-4 w-4" />
                View Gate Cameras
              </Button>
              <Link href="/dashboard/security/reports">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Download className="h-4 w-4" />
                  Export Reports
                </Button>
              </Link>
              <Link href="/dashboard/security/alerts">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  View Security Alerts
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Vehicle Records</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vehicles..."
                  className="pl-9 w-full md:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" onClick={refreshData} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Registration</TableHead>
                  <TableHead>Owner/Driver</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Entry Time</TableHead>
                  <TableHead>Exit Time</TableHead>
                  <TableHead>Mileage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Security Officer</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{renderTableBody()}</TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Recent Security Alerts
              </CardTitle>
              <CardDescription>Issues requiring attention</CardDescription>
            </div>
            {overdueVehicles > 0 && <Badge variant="destructive">{overdueVehicles} Active</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          {overdueVehicles > 0 ? (
            <div className="space-y-3">
              {vehicles
                .filter((v) => v.status === 'overdue')
                .slice(0, 3)
                .map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between p-3 border border-red-200 bg-red-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Clock className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Vehicle Exceeded Time Limit</p>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.registrationNumber} • Entry: {formatDateTime(vehicle.entryTime)}
                        </p>
                      </div>
                    </div>
                    <Link href={`/dashboard/security/vehicles/${vehicle.id}`}>
                      <Button size="sm" variant="destructive">
                        Review
                      </Button>
                    </Link>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">No active security alerts</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
