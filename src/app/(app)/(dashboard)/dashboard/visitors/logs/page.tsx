// app/(app)/(dashboard)/visitors/logs/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Calendar,
  Filter,
  Download,
  Users,
  Clock,
  TrendingUp,
  RefreshCw,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

// Define Visitor interface matching your MongoDB schema
interface Visitor {
  _id: string
  name: string
  email: string
  phone: string
  company: string
  purpose: string
  employeeToMeet?: any
  checkInTime: string
  checkOutTime: string | null
  status: 'checked-in' | 'checked-out'
  notes?: string
  badgeNumber?: string
  department?: string
  createdAt?: string
  updatedAt?: string
}

// API response type for visitor logs
interface VisitorsResponse {
  success: boolean
  data: Visitor[]
  pagination?: {
    totalDocs: number
    totalPages: number
    page: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export default function VisitorsLogPage() {
  const [logs, setLogs] = useState<Visitor[]>([])
  const [filteredLogs, setFilteredLogs] = useState<Visitor[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch visitor logs on component mount
  useEffect(() => {
    fetchVisitorLogs()
  }, [])

  const fetchVisitorLogs = async (search?: string) => {
    try {
      setRefreshing(true)
      const params = new URLSearchParams()
      if (search) {
        params.append('search', search)
      }
      // Optional: Add a parameter to fetch all historical logs
      params.append('historical', 'true')

      const response = await fetch(`/api/visitors?${params.toString()}`)
      const result: VisitorsResponse = await response.json()

      if (result.success) {
        setLogs(result.data)
        setFilteredLogs(result.data) // Initialize filtered logs
      } else {
        console.error('Failed to fetch visitor logs:', result)
        toast.error('Failed to load visitor logs')
      }
    } catch (error) {
      console.error('Error fetching visitor logs:', error)
      toast.error('Error loading visitor logs. Please try again.')
    } finally {
      setRefreshing(false)
    }
  }

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    fetchVisitorLogs(value)
  }

  // Apply filters whenever logs or filter values change
  useEffect(() => {
    let filtered = logs

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((log) => log.status === statusFilter)
    }

    // Apply department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter((log) => log.department === departmentFilter)
    }

    setFilteredLogs(filtered)
  }, [logs, statusFilter, departmentFilter])

  // Calculate duration between check-in and check-out
  const calculateDuration = (checkInTime: string, checkOutTime: string | null) => {
    if (!checkOutTime) return 'N/A'

    const checkIn = new Date(checkInTime)
    const checkOut = new Date(checkOutTime)
    const diffMs = checkOut.getTime() - checkIn.getTime()

    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (hours === 0) return `${minutes}m`
    return `${hours}h ${minutes}m`
  }

  // Calculate stats from real data
  const calculateStats = () => {
    const totalVisits = logs.length

    // Calculate average duration
    const completedVisits = logs.filter((log) => log.checkOutTime)
    const totalDurationMs = completedVisits.reduce((total, log) => {
      const checkIn = new Date(log.checkInTime)
      const checkOut = new Date(log.checkOutTime!)
      return total + (checkOut.getTime() - checkIn.getTime())
    }, 0)

    const avgDurationMs = completedVisits.length > 0 ? totalDurationMs / completedVisits.length : 0
    const avgHours = Math.floor(avgDurationMs / (1000 * 60 * 60))
    const avgMinutes = Math.floor((avgDurationMs % (1000 * 60 * 60)) / (1000 * 60))
    const avgDuration = avgDurationMs > 0 ? `${avgHours}h ${avgMinutes}m` : 'N/A'

    // Calculate peak hour (most common check-in hour)
    const hourCounts: { [key: string]: number } = {}
    logs.forEach((log) => {
      const hour = new Date(log.checkInTime).getHours()
      const hourKey = `${hour}:00`
      hourCounts[hourKey] = (hourCounts[hourKey] || 0) + 1
    })

    const peakHourEntry = Object.entries(hourCounts).reduce(
      (max, [hour, count]) => (count > max[1] ? [hour, count] : max),
      ['', 0],
    )
    const peakHour = peakHourEntry[0] ? `${parseInt(peakHourEntry[0])}:00` : 'N/A'

    // Calculate popular department
    const deptCounts: { [key: string]: number } = {}
    logs.forEach((log) => {
      if (log.department) {
        deptCounts[log.department] = (deptCounts[log.department] || 0) + 1
      }
    })

    const popularDeptEntry = Object.entries(deptCounts).reduce(
      (max, [dept, count]) => (count > max[1] ? [dept, count] : max),
      ['', 0],
    )
    const popularDepartment = popularDeptEntry[0] || 'N/A'

    return {
      totalVisits,
      avgDuration,
      peakHour,
      popularDepartment,
    }
  }

  const stats = calculateStats()

  // Get employee name (handles both string ID and populated object)
  const getEmployeeName = (employeeToMeet: any): string => {
    if (!employeeToMeet) return 'Not specified'

    // If it's a populated employee object
    if (typeof employeeToMeet === 'object' && employeeToMeet.name) {
      return employeeToMeet.name
    }

    // If it's just an ID or string reference
    return employeeToMeet.toString()
  }

  // Format date for display
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  }

  // Handle data refresh
  const refreshData = () => {
    fetchVisitorLogs(searchTerm)
  }

  // Handle export (mock function)
  const handleExport = () => {
    toast.success('Export functionality would be implemented here')
    // In production, implement CSV/Excel export
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Visitor Logs</h1>
        <p className="text-muted-foreground">
          Historical record of all visitor check-ins and check-outs
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits}</div>
            <p className="text-xs text-muted-foreground">All recorded visits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgDuration}</div>
            <p className="text-xs text-muted-foreground">Per completed visit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.peakHour}</div>
            <p className="text-xs text-muted-foreground">Most check-ins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Department</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.popularDepartment}</div>
            <p className="text-xs text-muted-foreground">Most visited</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Visitor History</CardTitle>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search visitors..."
                  className="pl-9 w-full md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="Executive">Executive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="checked-in">Checked In</SelectItem>
                  <SelectItem value="checked-out">Checked Out</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={refreshData}
                disabled={refreshing}
                title="Refresh data"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="outline" size="icon" onClick={handleExport} title="Export logs">
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
                  <TableHead>Visitor</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Employee Met</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refreshing ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-muted-foreground">Loading visitor logs...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No visitor logs found for the selected filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => {
                    const checkIn = formatDateTime(log.checkInTime)
                    const checkOut = log.checkOutTime ? formatDateTime(log.checkOutTime) : null
                    const duration = calculateDuration(log.checkInTime, log.checkOutTime)

                    return (
                      <TableRow key={log._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{log.name}</p>
                            <p className="text-sm text-muted-foreground">{log.email}</p>
                            <p className="text-sm text-muted-foreground">{log.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{log.company || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">{log.purpose}</TableCell>
                        <TableCell>{getEmployeeName(log.employeeToMeet)}</TableCell>
                        <TableCell>
                          {log.department ? (
                            <Badge variant="outline">{log.department}</Badge>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          {checkIn.date} {checkIn.time}
                        </TableCell>
                        <TableCell>
                          {checkOut ? (
                            `${checkOut.date} ${checkOut.time}`
                          ) : (
                            <span className="text-muted-foreground">Not checked out</span>
                          )}
                        </TableCell>
                        <TableCell>{duration}</TableCell>
                        <TableCell>
                          <Badge
                            variant={log.status === 'checked-in' ? 'default' : 'secondary'}
                            className={
                              log.status === 'checked-in'
                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                            }
                          >
                            {log.status === 'checked-in' ? 'Checked In' : 'Checked Out'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
