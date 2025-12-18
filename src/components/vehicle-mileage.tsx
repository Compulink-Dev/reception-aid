// components/security/VehicleMileage.tsx
'use client'

import React, { useState, useEffect } from 'react'
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
  RefreshCw,
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
import { toast } from 'sonner'

interface VehicleMileage {
  id: string
  vehicle: string
  registration: string
  type: string
  currentMileage: number
  lastRecorded: number
  mileageAdded: number
  fuelEfficiency: number
  department: string
  driver: string
  lastUpdated: string
  status: 'normal' | 'maintenance' | 'overdue'
}

interface VehicleMileageResponse {
  success: boolean
  data: VehicleMileage[]
}

// Mock data for charts - in real app, you would fetch this from API
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
  const [vehicleMileage, setVehicleMileage] = useState<VehicleMileage[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch vehicle mileage on component mount
  useEffect(() => {
    fetchVehicleMileage()
  }, [])

  const fetchVehicleMileage = async (search?: string) => {
    try {
      setRefreshing(true)
      const params = new URLSearchParams()
      if (search) {
        params.append('search', search)
      }
      if (vehicleTypeFilter !== 'all') {
        params.append('type', vehicleTypeFilter)
      }
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/vehicles/mileage?${params.toString()}`)
      const result: VehicleMileageResponse = await response.json()

      if (result.success) {
        setVehicleMileage(result.data)
      } else {
        console.error('Failed to fetch vehicle mileage:', result)
      }
    } catch (error) {
      console.error('Error fetching vehicle mileage:', error)
      toast.error('Failed to load vehicle mileage data')
    } finally {
      setRefreshing(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    fetchVehicleMileage(value)
  }

  const handleTypeFilter = (value: string) => {
    setVehicleTypeFilter(value)
    fetchVehicleMileage(searchTerm)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    fetchVehicleMileage(searchTerm)
  }

  const refreshData = () => {
    fetchVehicleMileage(searchTerm)
  }

  const filteredData = vehicleMileage.filter((vehicle) => {
    const matchesDepartment = departmentFilter === 'all' || vehicle.department === departmentFilter
    return matchesDepartment
  })

  const totalMileage = vehicleMileage.reduce((sum, v) => sum + v.currentMileage, 0)
  const avgMileageAdded =
    vehicleMileage.length > 0
      ? vehicleMileage.reduce((sum, v) => sum + v.mileageAdded, 0) / vehicleMileage.length
      : 0
  const vehiclesNeedingMaintenance = vehicleMileage.filter(
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

  const updateMileage = async (vehicleId: string, newMileage: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/vehicles/mileage/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentMileage: newMileage }),
      })

      if (response.ok) {
        toast.success('Mileage updated successfully')
        fetchVehicleMileage(searchTerm)
      } else {
        const error = await response.json()
        toast.error(`Failed to update mileage: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating mileage:', error)
      toast.error('Failed to update mileage')
    } finally {
      setLoading(false)
    }
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
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <Select value={vehicleTypeFilter} onValueChange={handleTypeFilter}>
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

              <Select value={statusFilter} onValueChange={handleStatusFilter}>
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={refreshData}
                  disabled={refreshing}
                  title="Refresh data"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
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
                    {refreshing ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex items-center justify-center gap-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span className="text-muted-foreground">Loading data...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No vehicle mileage records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((vehicle) => (
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
                              onClick={() =>
                                updateMileage(vehicle.id, vehicle.currentMileage + 100)
                              }
                              disabled={loading}
                            >
                              Update
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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
            {vehicleMileage
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
