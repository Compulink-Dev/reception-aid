// components/security/SecurityDashboard.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Car,
  User,
  Shield,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  Users,
  MapPin,
  Camera,
  LogIn,
  LogOut,
  Plus,
  Eye,
} from 'lucide-react'
import VehicleCheckin from './vehicle-checkin'

// Import the VehicleCheckin component

const mockCurrentVehicles = [
  {
    id: '1',
    registration: 'ABC 123 XYZ',
    type: 'Company Car',
    driver: 'John Doe',
    department: 'Sales',
    checkInTime: '09:30 AM',
    purpose: 'Client Meeting',
    location: 'Main Gate',
    status: 'active',
  },
  {
    id: '2',
    registration: 'VIS 456 DEF',
    type: 'Visitor',
    driver: 'Sarah Johnson',
    department: 'Visitor',
    checkInTime: '10:15 AM',
    purpose: 'Job Interview',
    location: 'North Gate',
    status: 'pending',
  },
  {
    id: '3',
    registration: 'DEL 789 GHI',
    type: 'Delivery',
    driver: 'Mike Delivery',
    department: 'Logistics',
    checkInTime: '11:45 AM',
    purpose: 'Package Delivery',
    location: 'Main Gate',
    status: 'active',
  },
  {
    id: '4',
    registration: 'EMP 321 JKL',
    type: 'Employee Personal',
    driver: 'Jane Smith',
    department: 'IT',
    checkInTime: '02:20 PM',
    purpose: 'Site Visit',
    location: 'South Gate',
    status: 'active',
  },
]

const mockTodayStats = {
  totalVehicles: 42,
  visitors: 18,
  deliveries: 8,
  pendingApprovals: 3,
  activeVehicles: 8,
  averageStay: '2.5 hours',
}

const mockRecentActivity = [
  {
    id: '1',
    time: '09:30',
    activity: 'Vehicle Entry',
    vehicle: 'ABC 123 XYZ',
    gate: 'Main Gate',
    status: 'approved',
  },
  {
    id: '2',
    time: '10:15',
    activity: 'Visitor Entry',
    vehicle: 'VIS 456 DEF',
    gate: 'North Gate',
    status: 'pending',
  },
  {
    id: '3',
    time: '11:45',
    activity: 'Delivery Entry',
    vehicle: 'DEL 789 GHI',
    gate: 'Main Gate',
    status: 'approved',
  },
  {
    id: '4',
    time: '12:30',
    activity: 'Vehicle Exit',
    vehicle: 'EMP 123 MNO',
    gate: 'South Gate',
    status: 'completed',
  },
  {
    id: '5',
    time: '02:20',
    activity: 'Vehicle Entry',
    vehicle: 'EMP 321 JKL',
    gate: 'South Gate',
    status: 'approved',
  },
]

const mockGateStatus = [
  {
    gate: 'Main Gate',
    status: 'active',
    traffic: 'high',
    officer: 'Officer Smith',
    lastAlert: 'None',
  },
  {
    gate: 'North Gate',
    status: 'active',
    traffic: 'medium',
    officer: 'Officer Brown',
    lastAlert: 'None',
  },
  {
    gate: 'South Gate',
    status: 'active',
    traffic: 'low',
    officer: 'Officer Wilson',
    lastAlert: '30 mins ago',
  },
  {
    gate: 'East Gate',
    status: 'inactive',
    traffic: 'none',
    officer: 'Off-duty',
    lastAlert: '2 hours ago',
  },
]

export default function SecurityDashboard() {
  const [showVehicleDialog, setShowVehicleDialog] = useState(false)

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      inactive: 'bg-gray-100 text-gray-800',
    }
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getTrafficBadge = (traffic: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
      none: 'bg-gray-100 text-gray-800',
    }
    return (
      <Badge className={colors[traffic as keyof typeof colors]}>
        {traffic.charAt(0).toUpperCase() + traffic.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{`Today's Vehicles`}</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTodayStats.totalVehicles}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Activity className="h-4 w-4 mr-1 text-green-500" />
              <span>{mockTodayStats.activeVehicles} currently on site</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTodayStats.visitors}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1 text-blue-500" />
              <span>Avg stay: {mockTodayStats.averageStay}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTodayStats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deliveries</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTodayStats.deliveries}</div>
            <p className="text-xs text-muted-foreground">Package deliveries today</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Dialog open={showVehicleDialog} onOpenChange={setShowVehicleDialog}>
          <DialogTrigger asChild>
            <Button>
              <Car className="h-4 w-4 mr-2" />
              Check In Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Vehicle Check-in</DialogTitle>
              <DialogDescription>Record vehicle entry details and mileage</DialogDescription>
            </DialogHeader>
            <VehicleCheckin onSuccess={() => setShowVehicleDialog(false)} />
          </DialogContent>
        </Dialog>

        <Link href="/dashboard/security/vehicles">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View All Vehicles
          </Button>
        </Link>

        <Link href="/dashboard/security/logs">
          <Button variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            View Logs
          </Button>
        </Link>

        <Link href="/dashboard/security/mileage">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Mileage Reports
          </Button>
        </Link>

        <Button variant="outline">
          <Camera className="h-4 w-4 mr-2" />
          View Cameras
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Vehicles */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Vehicles On Site</CardTitle>
                <CardDescription>Vehicles currently checked in</CardDescription>
              </div>
              <Badge variant="outline">{mockCurrentVehicles.length} Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCurrentVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Car className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{vehicle.registration}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{vehicle.driver}</span>
                        <span>•</span>
                        <span>{vehicle.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{vehicle.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 justify-end">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-muted-foreground">
                        Since {vehicle.checkInTime}
                      </span>
                    </div>
                    <div className="mt-2">{getStatusBadge(vehicle.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gate Status */}
        <Card>
          <CardHeader>
            <CardTitle>Gate Status</CardTitle>
            <CardDescription>Current status of all security gates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockGateStatus.map((gate) => (
                <div key={gate.gate} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          gate.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                      <span className="font-medium">{gate.gate}</span>
                    </div>
                    {getTrafficBadge(gate.traffic)}
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Officer:</span>
                      <span className="font-medium">{gate.officer}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Alert:</span>
                      <span
                        className={gate.lastAlert === 'None' ? 'text-green-600' : 'text-yellow-600'}
                      >
                        {gate.lastAlert}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Security Activity</CardTitle>
            <CardDescription>Latest security gate activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Activity</TabsTrigger>
                <TabsTrigger value="entries">Entries Only</TabsTrigger>
                <TabsTrigger value="exits">Exits Only</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="space-y-3">
                  {mockRecentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            activity.status === 'approved'
                              ? 'bg-green-100'
                              : activity.status === 'pending'
                                ? 'bg-yellow-100'
                                : 'bg-blue-100'
                          }`}
                        >
                          {activity.activity.includes('Entry') ? (
                            <LogIn
                              className={`h-4 w-4 ${
                                activity.status === 'approved'
                                  ? 'text-green-600'
                                  : activity.status === 'pending'
                                    ? 'text-yellow-600'
                                    : 'text-blue-600'
                              }`}
                            />
                          ) : (
                            <LogOut
                              className={`h-4 w-4 ${
                                activity.status === 'approved'
                                  ? 'text-green-600'
                                  : activity.status === 'pending'
                                    ? 'text-yellow-600'
                                    : 'text-blue-600'
                              }`}
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{activity.activity}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.vehicle} • {activity.gate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{activity.time}</p>
                        <Badge
                          className={
                            activity.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : activity.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                          }
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Security Alerts
              </CardTitle>
              <CardDescription>Issues requiring attention</CardDescription>
            </div>
            <Badge variant="destructive">3 Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-red-200 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Unauthorized Vehicle Detected</p>
                  <p className="text-sm text-muted-foreground">
                    South Gate • Registration: UNK 999 XYZ
                  </p>
                </div>
              </div>
              <Button size="sm" variant="destructive">
                Review
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Vehicle Exceeded Time Limit</p>
                  <p className="text-sm text-muted-foreground">
                    Main Gate • ABC 123 XYZ • 5+ hours on site
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Check
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border border-blue-200 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Visitor Without Escort</p>
                  <p className="text-sm text-muted-foreground">
                    North Gate • Visitor: Sarah Johnson
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Assign Escort
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
