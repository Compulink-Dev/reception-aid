// app/(app)/(dashboard)/calls/history/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Calendar,
  Filter,
  Download,
  Phone,
  Clock,
  DollarSign,
  BarChart3,
  RefreshCw,
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

interface PhoneCall {
  _id: string
  employee:
    | {
        _id: string
        name: string
        department?: string
        email: string
      }
    | string
  callerName?: string
  callerNumber: string
  purpose: string
  startTime: string
  endTime?: string
  duration?: number
  cost?: number
  createdAt?: string
  updatedAt?: string
}

interface PhoneCallsResponse {
  success: boolean
  data: PhoneCall[]
  pagination?: {
    totalDocs: number
    totalPages: number
    page: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export default function CallHistoryPage() {
  const [calls, setCalls] = useState<PhoneCall[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch calls on component mount
  useEffect(() => {
    fetchCalls()
  }, [departmentFilter])

  const fetchCalls = async () => {
    try {
      setRefreshing(true)
      const params = new URLSearchParams()

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      // Note: You might need to implement department filtering in your API
      // For now, we'll filter client-side

      const response = await fetch(`/api/phone-calls?${params.toString()}`)
      const result: PhoneCallsResponse = await response.json()

      if (result.success) {
        setCalls(result.data)
      } else {
        console.error('Failed to fetch calls:', result)
      }
    } catch (error) {
      console.error('Error fetching calls:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // Filter calls client-side
  const filteredCalls = calls.filter((call) => {
    if (departmentFilter === 'all') return true

    const employee = call.employee
    if (typeof employee === 'object' && employee.department) {
      return employee.department.toLowerCase() === departmentFilter
    }
    return false
  })

  // Calculate stats
  const totalCalls = filteredCalls.length
  const totalMinutes = filteredCalls.reduce((sum, call) => sum + (call.duration || 0), 0)
  const totalCost = filteredCalls.reduce((sum, call) => sum + (call.cost || 0), 0)
  const averageDuration = totalCalls > 0 ? Math.round(totalMinutes / totalCalls) : 0

  // Helper function to get employee name
  const getEmployeeName = (employee: any): string => {
    if (!employee) return 'Unknown'
    if (typeof employee === 'object' && employee.name) {
      return employee.name
    }
    return 'Unknown Employee'
  }

  // Helper function to get department
  const getEmployeeDepartment = (employee: any): string => {
    if (!employee) return 'N/A'
    if (typeof employee === 'object' && employee.department) {
      return employee.department
    }
    return 'N/A'
  }

  const refreshData = () => {
    fetchCalls()
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Calculate department stats for "Most Active Dept"
  const departmentStats = calls.reduce(
    (acc, call) => {
      const department = getEmployeeDepartment(call.employee)
      if (department !== 'N/A') {
        acc[department] = (acc[department] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const mostActiveDept =
    Object.entries(departmentStats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
  const mostActiveDeptCount =
    Object.entries(departmentStats).sort((a, b) => b[1] - a[1])[0]?.[1] || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Call History</h1>
          <p className="text-muted-foreground">Detailed historical record of all phone calls</p>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={refreshData}
          disabled={refreshing}
          title="Refresh data"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalls}</div>
            <p className="text-xs text-muted-foreground">Filtered results</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Minutes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMinutes}</div>
            <p className="text-xs text-muted-foreground">~{averageDuration} min avg</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Filtered period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Active Dept</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mostActiveDept}</div>
            <p className="text-xs text-muted-foreground">{mostActiveDeptCount} calls</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Call Records</CardTitle>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="relative w-full md:w-auto">
                <Input
                  placeholder="Search calls..."
                  className="w-full md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchCalls()}
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={fetchCalls}>
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Caller</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refreshing ? (
                  <TableRow key="loading">
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-muted-foreground">Loading calls...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCalls.length === 0 ? (
                  <TableRow key="empty">
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No calls found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCalls.map((call) => (
                    <TableRow key={call._id}>
                      <TableCell>
                        <div className="font-medium">{formatDate(call.startTime)}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{getEmployeeName(call.employee)}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {getEmployeeDepartment(call.employee)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{call.callerName || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{call.callerNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate">{call.purpose}</p>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatTime(call.startTime)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {call.duration || 0} min
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">${(call.cost || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
