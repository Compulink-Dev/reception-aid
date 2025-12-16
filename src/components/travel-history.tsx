// components/travel/TravelHistory.tsx
'use client'

import React, { useState, useEffect } from 'react'
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
import { Search, Filter, Download, MapPin, Eye, RefreshCw, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

// Interface for travel log from API
interface TravelLog {
  id: string
  employee:
    | string
    | {
        id: string
        name: string
        department?: string
        email: string
      }
  destination: string
  purpose: string
  departureTime: string
  expectedReturn?: string
  actualReturn?: string
  status: 'pending' | 'approved' | 'departed' | 'returned' | 'cancelled'
  travelType?: 'business' | 'client_visit' | 'conference' | 'training' | 'other'
  transportation?: 'flight' | 'car' | 'train' | 'bus' | 'other'
  accommodation?: string
  estimatedCost?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

// API response type
interface TravelHistoryResponse {
  success: boolean
  data: TravelLog[]
  pagination?: {
    totalDocs: number
    totalPages: number
    page: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  approved: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  departed: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  returned: 'bg-green-100 text-green-800 hover:bg-green-100',
  cancelled: 'bg-red-100 text-red-800 hover:bg-red-100',
}

const typeColors = {
  business: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  client_visit: 'bg-green-100 text-green-800 hover:bg-green-100',
  conference: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  training: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-100',
  other: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
}

export default function TravelHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [travelLogs, setTravelLogs] = useState<TravelLog[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [departments, setDepartments] = useState<string[]>([])

  // Fetch travel logs on component mount
  useEffect(() => {
    fetchTravelLogs()
  }, [])

  const fetchTravelLogs = async (search?: string) => {
    try {
      setRefreshing(true)
      const params = new URLSearchParams()
      if (search) {
        params.append('search', search)
      }
      // Get all travel logs for history view
      params.append('limit', '100')

      const response = await fetch(`/api/travel-logs?${params.toString()}`)
      const result: TravelHistoryResponse = await response.json()

      if (result.success) {
        setTravelLogs(result.data)
        // Extract unique departments from employees
        const uniqueDepartments = Array.from(
          new Set(
            result.data
              .map((log) => {
                if (typeof log.employee === 'object' && log.employee.department) {
                  return log.employee.department
                }
                return null
              })
              .filter(Boolean) as string[],
          ),
        )
        setDepartments(uniqueDepartments)
      } else {
        toast.error('Failed to fetch travel history')
      }
    } catch (error) {
      console.error('Error fetching travel logs:', error)
      toast.error('Error loading travel history')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    fetchTravelLogs(value)
  }

  const filteredHistory = travelLogs.filter((travel) => {
    const employeeName =
      typeof travel.employee === 'object' ? travel.employee.name : travel.employee
    const employeeDepartment = typeof travel.employee === 'object' ? travel.employee.department : ''

    const matchesSearch =
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      travel.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      travel.purpose.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = departmentFilter === 'all' || employeeDepartment === departmentFilter
    const matchesStatus = statusFilter === 'all' || travel.status === statusFilter
    const matchesType = typeFilter === 'all' || travel.travelType === typeFilter

    return matchesSearch && matchesDepartment && matchesStatus && matchesType
  })

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime()
      case 'cost':
        return (b.estimatedCost || 0) - (a.estimatedCost || 0)
      case 'destination':
        return a.destination.localeCompare(b.destination)
      default:
        return 0
    }
  })

  const getDuration = (startDate: string, endDate?: string) => {
    if (!endDate) return 'N/A'
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`
  }

  const getReturnDate = (travel: TravelLog) => {
    return travel.actualReturn || travel.expectedReturn
  }

  const exportToCSV = () => {
    const headers = [
      'Employee',
      'Department',
      'Destination',
      'Purpose',
      'Departure',
      'Expected Return',
      'Actual Return',
      'Duration',
      'Cost',
      'Status',
      'Travel Type',
      'Transportation',
      'Accommodation',
    ]

    const csvData = sortedHistory.map((travel) => {
      const employeeName =
        typeof travel.employee === 'object' ? travel.employee.name : travel.employee
      const employeeDepartment =
        typeof travel.employee === 'object' ? travel.employee.department : ''
      const returnDate = getReturnDate(travel)

      return [
        employeeName,
        employeeDepartment || '',
        travel.destination,
        travel.purpose,
        format(new Date(travel.departureTime), 'yyyy-MM-dd HH:mm'),
        travel.expectedReturn ? format(new Date(travel.expectedReturn), 'yyyy-MM-dd HH:mm') : '',
        travel.actualReturn ? format(new Date(travel.actualReturn), 'yyyy-MM-dd HH:mm') : '',
        getDuration(travel.departureTime, returnDate),
        travel.estimatedCost ? `$${travel.estimatedCost.toLocaleString()}` : '',
        travel.status,
        travel.travelType || '',
        travel.transportation || '',
        travel.accommodation || '',
      ]
    })

    const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `travel-history-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const viewDetails = (travel: TravelLog) => {
    const employeeName =
      typeof travel.employee === 'object' ? travel.employee.name : travel.employee
    const employeeDepartment = typeof travel.employee === 'object' ? travel.employee.department : ''
    const employeeEmail = typeof travel.employee === 'object' ? travel.employee.email : ''

    const details = [
      `Employee: ${employeeName}`,
      employeeDepartment && `Department: ${employeeDepartment}`,
      employeeEmail && `Email: ${employeeEmail}`,
      `Destination: ${travel.destination}`,
      `Purpose: ${travel.purpose}`,
      `Status: ${travel.status}`,
      `Departure: ${format(new Date(travel.departureTime), 'MMM d, yyyy HH:mm')}`,
      travel.expectedReturn &&
        `Expected Return: ${format(new Date(travel.expectedReturn), 'MMM d, yyyy HH:mm')}`,
      travel.actualReturn &&
        `Actual Return: ${format(new Date(travel.actualReturn), 'MMM d, yyyy HH:mm')}`,
      travel.travelType && `Travel Type: ${travel.travelType.replace('_', ' ')}`,
      travel.transportation && `Transportation: ${travel.transportation}`,
      travel.accommodation && `Accommodation: ${travel.accommodation}`,
      travel.estimatedCost && `Estimated Cost: $${travel.estimatedCost.toLocaleString()}`,
      travel.notes && `Notes: ${travel.notes}`,
      `Created: ${format(new Date(travel.createdAt), 'MMM d, yyyy HH:mm')}`,
      `Last Updated: ${format(new Date(travel.updatedAt), 'MMM d, yyyy HH:mm')}`,
    ]
      .filter(Boolean)
      .join('\n')

    alert(`Travel Details:\n\n${details}`)
  }

  const refreshData = () => {
    fetchTravelLogs(searchTerm)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
          <p className="mt-2 text-gray-600">Loading travel history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Travel History</CardTitle>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search travel history..."
                  className="w-full md:w-[250px] pl-9"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date (Newest)</SelectItem>
                  <SelectItem value="cost">Cost (High to Low)</SelectItem>
                  <SelectItem value="destination">Destination (A-Z)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="departed">Departed</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="business">Business Meeting</SelectItem>
                  <SelectItem value="client_visit">Client Visit</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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
                <Button
                  variant="outline"
                  onClick={exportToCSV}
                  disabled={sortedHistory.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
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
                  <TableHead>Employee</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Return</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refreshing ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-muted-foreground">Refreshing data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sortedHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      {travelLogs.length === 0
                        ? 'No travel logs found.'
                        : 'No matching results. Try adjusting your filters.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedHistory.map((travel) => {
                    const employeeName =
                      typeof travel.employee === 'object' ? travel.employee.name : travel.employee
                    const employeeDepartment =
                      typeof travel.employee === 'object' ? travel.employee.department : ''
                    const returnDate = getReturnDate(travel)

                    return (
                      <TableRow key={travel.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{employeeName}</p>
                            {employeeDepartment && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {employeeDepartment}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{travel.destination}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate" title={travel.purpose}>
                            {travel.purpose}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm whitespace-nowrap">
                            {format(new Date(travel.departureTime), 'MMM d, HH:mm')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm whitespace-nowrap">
                            {returnDate ? format(new Date(returnDate), 'MMM d, HH:mm') : 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getDuration(travel.departureTime, returnDate)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {travel.estimatedCost
                            ? `$${travel.estimatedCost.toLocaleString()}`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[travel.status]}>
                            {travel.status.charAt(0).toUpperCase() + travel.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {travel.travelType && (
                            <Badge className={typeColors[travel.travelType]}>
                              {travel.travelType.replace('_', ' ').charAt(0).toUpperCase() +
                                travel.travelType.replace('_', ' ').slice(1)}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewDetails(travel)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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
