// components/security/SecurityLogs.tsx
'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Calendar,
  User,
  Car,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
} from 'lucide-react'
import { format } from 'date-fns'

const mockSecurityLogs = [
  {
    id: '1',
    timestamp: '2024-01-20T09:30:00',
    activity: 'Vehicle Entry',
    vehicleType: 'Company Car',
    registration: 'ABC 123 XYZ',
    driver: 'John Doe',
    department: 'Sales',
    purpose: 'Client Meeting',
    status: 'approved',
    gate: 'Main Gate',
    officer: 'Officer Smith',
    duration: '2 hours',
  },
  {
    id: '2',
    timestamp: '2024-01-20T10:15:00',
    activity: 'Visitor Entry',
    vehicleType: 'Personal',
    registration: 'XYZ 456 DEF',
    driver: 'Sarah Johnson (Visitor)',
    department: 'N/A',
    purpose: 'Job Interview',
    status: 'approved',
    gate: 'North Gate',
    officer: 'Officer Brown',
    duration: '1.5 hours',
  },
  {
    id: '3',
    timestamp: '2024-01-20T11:45:00',
    activity: 'Vehicle Exit',
    vehicleType: 'Delivery Truck',
    registration: 'TRUCK 789',
    driver: 'Mike Delivery',
    department: 'Logistics',
    purpose: 'Package Delivery',
    status: 'completed',
    gate: 'Main Gate',
    officer: 'Officer Smith',
    duration: '45 minutes',
  },
  {
    id: '4',
    timestamp: '2024-01-20T14:20:00',
    activity: 'Vehicle Entry',
    vehicleType: 'Company Car',
    registration: 'EMP 456',
    driver: 'Jane Smith',
    department: 'IT',
    purpose: 'Site Visit',
    status: 'pending',
    gate: 'Main Gate',
    officer: 'Officer Wilson',
    duration: 'Ongoing',
  },
  {
    id: '5',
    timestamp: '2024-01-20T16:00:00',
    activity: 'Vehicle Exit',
    vehicleType: 'Personal',
    registration: 'PERS 123',
    driver: 'Bob Wilson',
    department: 'Marketing',
    purpose: 'Business Lunch',
    status: 'rejected',
    gate: 'South Gate',
    officer: 'Officer Davis',
    duration: 'Rejected',
  },
]

const statusColors = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
  flagged: 'bg-orange-100 text-orange-800',
}

const activityIcons = {
  'Vehicle Entry': Car,
  'Vehicle Exit': Car,
  'Visitor Entry': User,
  'Security Check': AlertTriangle,
}

export default function SecurityLogs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activityFilter, setActivityFilter] = useState('all')
  const [gateFilter, setGateFilter] = useState('all')
  const [timeRange, setTimeRange] = useState('today')

  const filteredLogs = mockSecurityLogs.filter((log) => {
    const matchesSearch =
      log.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || log.status === statusFilter
    const matchesActivity = activityFilter === 'all' || log.activity === activityFilter
    const matchesGate = gateFilter === 'all' || log.gate === gateFilter

    return matchesSearch && matchesStatus && matchesActivity && matchesGate
  })

  const stats = {
    totalEntries: mockSecurityLogs.filter((l) => l.activity.includes('Entry')).length,
    totalExits: mockSecurityLogs.filter((l) => l.activity.includes('Exit')).length,
    pendingApprovals: mockSecurityLogs.filter((l) => l.status === 'pending').length,
    todayActivity: mockSecurityLogs.length,
  }

  const exportLogs = () => {
    const headers = [
      'Timestamp',
      'Activity',
      'Vehicle',
      'Registration',
      'Driver',
      'Department',
      'Purpose',
      'Status',
      'Gate',
      'Officer',
    ]
    const csvData = filteredLogs.map((log) => [
      format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      log.activity,
      log.vehicleType,
      log.registration,
      log.driver,
      log.department,
      log.purpose,
      log.status,
      log.gate,
      log.officer,
    ])

    const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'security-logs.csv'
    a.click()
  }

  const ActivityIcon = ({ activity }: { activity: string }) => {
    const Icon = activityIcons[activity as keyof typeof activityIcons] || Clock
    return <Icon className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEntries}</div>
            <p className="text-xs text-muted-foreground">{`Today's vehicle entries`}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exits</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExits}</div>
            <p className="text-xs text-muted-foreground">{`Today's vehicle exits`}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{`Today's Activity`}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayActivity}</div>
            <p className="text-xs text-muted-foreground">Total security logs</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Security Activity Logs</CardTitle>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search logs..."
                  className="w-full md:w-[250px] pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="Vehicle Entry">Vehicle Entry</SelectItem>
                  <SelectItem value="Vehicle Exit">Vehicle Exit</SelectItem>
                  <SelectItem value="Visitor Entry">Visitor Entry</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={exportLogs}>
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
              <TabsTrigger value="all">All Logs</TabsTrigger>
              <TabsTrigger value="entries">Entries Only</TabsTrigger>
              <TabsTrigger value="exits">Exits Only</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Gate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(log.timestamp), 'HH:mm')}
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(log.timestamp), 'MMM d')}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ActivityIcon activity={log.activity} />
                            <span>{log.activity}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.registration}</div>
                            <div className="text-xs text-muted-foreground">{log.vehicleType}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{log.driver}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {log.department}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate">{log.purpose}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[log.status as keyof typeof statusColors]}>
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.gate}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
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

      {/* Recent Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSecurityLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-3 border rounded-lg">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <ActivityIcon activity={log.activity} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{log.activity}</p>
                      <p className="text-sm text-muted-foreground">
                        {log.vehicleType} • {log.registration}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(log.timestamp), 'h:mm a')}
                      </p>
                      <Badge className={statusColors[log.status as keyof typeof statusColors]}>
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm mt-2">
                    {log.driver} • {log.purpose}
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
