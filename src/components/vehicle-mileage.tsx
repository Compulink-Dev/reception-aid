// components/security/VehicleMileage.tsx
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
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Car,
  Fuel,
  Gauge,
  Calendar,
  BarChart3,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

const mockMileageData = [
  {
    id: '1',
    vehicle: 'Toyota Camry',
    registration: 'ABC 123 XYZ',
    type: 'Company Car',
    currentMileage: 45230,
    lastRecorded: 44500,
    mileageAdded: 730,
    fuelEfficiency: 12.5,
    department: 'Sales',
    driver: 'John Doe',
    lastUpdated: '2024-01-20',
    status: 'normal',
  },
  {
    id: '2',
    vehicle: 'Ford Ranger',
    registration: 'TRUCK 456',
    type: 'Company Truck',
    currentMileage: 89210,
    lastRecorded: 88500,
    mileageAdded: 710,
    fuelEfficiency: 8.2,
    department: 'Logistics',
    driver: 'Mike Chen',
    lastUpdated: '2024-01-20',
    status: 'maintenance',
  },
  {
    id: '3',
    vehicle: 'Honda Civic',
    registration: 'EMP 789',
    type: 'Employee Personal',
    currentMileage: 32150,
    lastRecorded: 32000,
    mileageAdded: 150,
    fuelEfficiency: 15.3,
    department: 'IT',
    driver: 'Jane Smith',
    lastUpdated: '2024-01-19',
    status: 'normal',
  },
  {
    id: '4',
    vehicle: 'Mercedes Benz',
    registration: 'EXEC 001',
    type: 'Executive Car',
    currentMileage: 18500,
    lastRecorded: 18200,
    mileageAdded: 300,
    fuelEfficiency: 10.8,
    department: 'Executive',
    driver: 'Tom Harris',
    lastUpdated: '2024-01-18',
    status: 'normal',
  },
  {
    id: '5',
    vehicle: 'Toyota Hilux',
    registration: 'FIELD 789',
    type: 'Field Vehicle',
    currentMileage: 125430,
    lastRecorded: 124800,
    mileageAdded: 630,
    fuelEfficiency: 9.5,
    department: 'Operations',
    driver: 'Robert Kim',
    lastUpdated: '2024-01-17',
    status: 'overdue',
  },
]

const monthlyMileageTrend = [
  { month: 'Jul', mileage: 4200, trips: 45 },
  { month: 'Aug', mileage: 3850, trips: 42 },
  { month: 'Sep', mileage: 4100, trips: 48 },
  { month: 'Oct', mileage: 4550, trips: 52 },
  { month: 'Nov', mileage: 3950, trips: 44 },
  { month: 'Dec', mileage: 4300, trips: 47 },
  { month: 'Jan', mileage: 4700, trips: 55 },
]

const vehicleTypeMileage = [
  { type: 'Company Cars', mileage: 12500, vehicles: 8 },
  { type: 'Trucks', mileage: 18900, vehicles: 3 },
  { type: 'Executive', mileage: 3200, vehicles: 2 },
  { type: 'Field Vehicles', mileage: 25600, vehicles: 5 },
]

export default function VehicleMileage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredData = mockMileageData.filter((vehicle) => {
    const matchesSearch =
      vehicle.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = vehicleTypeFilter === 'all' || vehicle.type === vehicleTypeFilter
    const matchesDepartment = departmentFilter === 'all' || vehicle.department === departmentFilter
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter

    return matchesSearch && matchesType && matchesDepartment && matchesStatus
  })

  const totalMileage = mockMileageData.reduce((sum, v) => sum + v.currentMileage, 0)
  const avgMileageAdded =
    mockMileageData.reduce((sum, v) => sum + v.mileageAdded, 0) / mockMileageData.length
  const vehiclesNeedingMaintenance = mockMileageData.filter(
    (v) => v.status === 'maintenance' || v.status === 'overdue',
  ).length
  const totalTrips = monthlyMileageTrend.reduce((sum, m) => sum + m.trips, 0)

  const getStatusBadge = (status: string) => {
    const colors = {
      normal: 'bg-green-100 text-green-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
      low: 'bg-blue-100 text-blue-800',
    }
    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const updateMileage = (vehicleId: string, newMileage: number) => {
    alert(`Updating mileage for vehicle ${vehicleId} to ${newMileage}`)
    // In a real app, this would make an API call
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mileage</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMileage.toLocaleString()} km</div>
            <p className="text-xs text-muted-foreground">Across all vehicles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Mileage Added</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMileageAdded.toFixed(0)} km</div>
            <p className="text-xs text-muted-foreground">Per vehicle this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Needed</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehiclesNeedingMaintenance}</div>
            <p className="text-xs text-muted-foreground">Vehicles requiring service</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrips}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Mileage Trend</CardTitle>
            <CardDescription>Total distance covered per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyMileageTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="mileage" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mileage by Vehicle Type</CardTitle>
            <CardDescription>Distribution across vehicle categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vehicleTypeMileage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="mileage" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Mileage Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Vehicle Mileage Records</CardTitle>
              <CardDescription>Current mileage and fuel efficiency data</CardDescription>
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
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button>
                  <Gauge className="h-4 w-4 mr-2" />
                  Update All
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
              <TabsTrigger value="maintenance">Needs Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Current Mileage</TableHead>
                      <TableHead>Last Recorded</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead>Fuel Efficiency</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{vehicle.vehicle}</p>
                            <div className="text-sm text-muted-foreground">
                              {vehicle.registration} • {vehicle.type}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold">
                            {vehicle.currentMileage.toLocaleString()} km
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {vehicle.lastRecorded.toLocaleString()} km
                            <div className="text-xs text-muted-foreground">
                              {new Date(vehicle.lastUpdated).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">
                            +{vehicle.mileageAdded} km
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Fuel className="h-4 w-4 text-gray-400" />
                            <span>{vehicle.fuelEfficiency} km/L</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{vehicle.driver}</p>
                            <Badge variant="outline" className="text-xs">
                              {vehicle.department}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateMileage(vehicle.id, vehicle.currentMileage + 100)}
                          >
                            Update
                          </Button>
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

      {/* Maintenance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Alerts</CardTitle>
          <CardDescription>Vehicles approaching service intervals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockMileageData
              .filter((v) => v.status === 'maintenance' || v.status === 'overdue')
              .map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        vehicle.status === 'overdue' ? 'bg-red-100' : 'bg-yellow-100'
                      }`}
                    >
                      <Car
                        className={`h-5 w-5 ${
                          vehicle.status === 'overdue' ? 'text-red-600' : 'text-yellow-600'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{vehicle.vehicle}</p>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.registration} • {vehicle.driver}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{vehicle.currentMileage.toLocaleString()} km</p>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.status === 'overdue'
                        ? 'Service overdue by 500km'
                        : 'Service due soon'}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
