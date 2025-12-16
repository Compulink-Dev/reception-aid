// components/security/VehicleManagement.tsx
'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Search,
  Filter,
  Download,
  Plus,
  Car,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Users,
  Gauge,
  Calendar,
  Shield,
} from 'lucide-react'

const mockVehicles = [
  {
    id: '1',
    registration: 'ABC 123 XYZ',
    make: 'Toyota',
    model: 'Camry',
    year: '2022',
    type: 'Company Car',
    department: 'Sales',
    assignedTo: 'John Doe',
    currentMileage: 45230,
    fuelType: 'Petrol',
    insuranceExpiry: '2024-06-30',
    serviceDue: '2024-02-15',
    status: 'active',
    location: 'On-site',
  },
  {
    id: '2',
    registration: 'TRUCK 456',
    make: 'Ford',
    model: 'Ranger',
    year: '2021',
    type: 'Company Truck',
    department: 'Logistics',
    assignedTo: 'Mike Chen',
    currentMileage: 89210,
    fuelType: 'Diesel',
    insuranceExpiry: '2024-05-31',
    serviceDue: '2024-01-30',
    status: 'maintenance',
    location: 'Service Center',
  },
  {
    id: '3',
    registration: 'EMP 789',
    make: 'Honda',
    model: 'Civic',
    year: '2023',
    type: 'Employee Personal',
    department: 'IT',
    assignedTo: 'Jane Smith',
    currentMileage: 32150,
    fuelType: 'Petrol',
    insuranceExpiry: '2024-12-31',
    serviceDue: '2024-03-20',
    status: 'active',
    location: 'Off-site',
  },
  {
    id: '4',
    registration: 'EXEC 001',
    make: 'Mercedes',
    model: 'E-Class',
    year: '2023',
    type: 'Executive Car',
    department: 'Executive',
    assignedTo: 'Tom Harris',
    currentMileage: 18500,
    fuelType: 'Petrol',
    insuranceExpiry: '2024-08-15',
    serviceDue: '2024-02-10',
    status: 'active',
    location: 'Executive Parking',
  },
  {
    id: '5',
    registration: 'FIELD 789',
    make: 'Toyota',
    model: 'Hilux',
    year: '2020',
    type: 'Field Vehicle',
    department: 'Operations',
    assignedTo: 'Robert Kim',
    currentMileage: 125430,
    fuelType: 'Diesel',
    insuranceExpiry: '2024-04-30',
    serviceDue: '2024-01-25',
    status: 'overdue',
    location: 'Field',
  },
  {
    id: '6',
    registration: 'VIS 456',
    make: 'Toyota',
    model: 'Corolla',
    year: '2021',
    type: 'Visitor Vehicle',
    department: 'N/A',
    assignedTo: 'Visitor Parking',
    currentMileage: 0,
    fuelType: 'Petrol',
    insuranceExpiry: 'N/A',
    serviceDue: 'N/A',
    status: 'available',
    location: 'Visitor Parking',
  },
]

const vehicleTypeStats = {
  'Company Car': 8,
  'Company Truck': 3,
  'Employee Personal': 12,
  'Executive Car': 2,
  'Field Vehicle': 5,
  'Visitor Vehicle': 15,
}

export default function VehicleManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [showAddDialog, setShowAddDialog] = useState(false)

  const filteredVehicles = mockVehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = vehicleTypeFilter === 'all' || vehicle.type === vehicleTypeFilter
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    const matchesDepartment = departmentFilter === 'all' || vehicle.department === departmentFilter

    return matchesSearch && matchesType && matchesStatus && matchesDepartment
  })

  const totalVehicles = mockVehicles.length
  const activeVehicles = mockVehicles.filter((v) => v.status === 'active').length
  const vehiclesInMaintenance = mockVehicles.filter(
    (v) => v.status === 'maintenance' || v.status === 'overdue',
  ).length
  const availableVehicles = mockVehicles.filter((v) => v.status === 'available').length

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
      available: 'bg-blue-100 text-blue-800',
      inactive: 'bg-gray-100 text-gray-800',
    }
    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100'}>
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

  const handleDeleteVehicle = (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      alert(`Vehicle ${id} deleted (simulated)`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVehicles}</div>
            <p className="text-xs text-muted-foreground">Registered in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVehicles}</div>
            <p className="text-xs text-muted-foreground">Currently in use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehiclesInMaintenance}</div>
            <p className="text-xs text-muted-foreground">Requiring service</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableVehicles}</div>
            <p className="text-xs text-muted-foreground">Ready for assignment</p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Distribution</CardTitle>
          <CardDescription>Number of vehicles by type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(vehicleTypeStats).map(([type, count]) => (
              <div key={type} className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground mt-1">{type}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Vehicle Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Vehicle Registry</CardTitle>
              <CardDescription>Manage all registered vehicles</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search vehicles..."
                  className="w-full md:w-[250px] pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={vehicleTypeFilter} onValueChange={setVehicleTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Vehicle Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Company Car">Company Car</SelectItem>
                  <SelectItem value="Company Truck">Company Truck</SelectItem>
                  <SelectItem value="Employee Personal">Employee Personal</SelectItem>
                  <SelectItem value="Executive Car">Executive Car</SelectItem>
                  <SelectItem value="Field Vehicle">Field Vehicle</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Vehicle
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Vehicle</DialogTitle>
                      <DialogDescription>Register a new vehicle in the system</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Registration Number</label>
                          <Input placeholder="ABC 123 XYZ" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Make</label>
                          <Input placeholder="Toyota" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Model</label>
                          <Input placeholder="Camry" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Year</label>
                          <Input placeholder="2022" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Vehicle Type</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="company-car">Company Car</SelectItem>
                              <SelectItem value="company-truck">Company Truck</SelectItem>
                              <SelectItem value="employee-personal">Employee Personal</SelectItem>
                              <SelectItem value="executive">Executive Car</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Fuel Type</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="petrol">Petrol</SelectItem>
                              <SelectItem value="diesel">Diesel</SelectItem>
                              <SelectItem value="electric">Electric</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setShowAddDialog(false)}>Add Vehicle</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Vehicles</TabsTrigger>
              <TabsTrigger value="company">Company Vehicles</TabsTrigger>
              <TabsTrigger value="personal">Personal Vehicles</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Registration</TableHead>
                      <TableHead>Vehicle Details</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Mileage</TableHead>
                      <TableHead>Service Due</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell>
                          <div className="font-bold">{vehicle.registration}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {vehicle.make} {vehicle.model}
                            </p>
                            <div className="text-sm text-muted-foreground">
                              Year: {vehicle.year} • {vehicle.fuelType}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(vehicle.type)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{vehicle.assignedTo}</p>
                            <Badge variant="outline" className="text-xs">
                              {vehicle.department}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Gauge className="h-4 w-4 text-gray-400" />
                            <span>{vehicle.currentMileage.toLocaleString()} km</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {vehicle.serviceDue === 'N/A'
                              ? 'N/A'
                              : new Date(vehicle.serviceDue).toLocaleDateString()}
                            <div className="text-xs text-muted-foreground">
                              Location: {vehicle.location}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Insurance & Service Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Insurance Expiring Soon</CardTitle>
            <CardDescription>Vehicles with insurance nearing expiry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockVehicles
                .filter((v) => v.insuranceExpiry !== 'N/A')
                .sort(
                  (a, b) =>
                    new Date(a.insuranceExpiry).getTime() - new Date(b.insuranceExpiry).getTime(),
                )
                .slice(0, 3)
                .map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Shield className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">{vehicle.registration}</p>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.make} {vehicle.model}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {new Date(vehicle.insuranceExpiry).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {Math.ceil(
                          (new Date(vehicle.insuranceExpiry).getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}{' '}
                        days left
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Service Due</CardTitle>
            <CardDescription>Vehicles scheduled for service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockVehicles
                .filter((v) => v.serviceDue !== 'N/A')
                .sort((a, b) => new Date(a.serviceDue).getTime() - new Date(b.serviceDue).getTime())
                .slice(0, 3)
                .map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          vehicle.status === 'overdue' ? 'bg-red-100' : 'bg-blue-100'
                        }`}
                      >
                        <Car
                          className={`h-5 w-5 ${
                            vehicle.status === 'overdue' ? 'text-red-600' : 'text-blue-600'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{vehicle.registration}</p>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.make} {vehicle.model}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {new Date(vehicle.serviceDue).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Current: {vehicle.currentMileage.toLocaleString()} km
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
