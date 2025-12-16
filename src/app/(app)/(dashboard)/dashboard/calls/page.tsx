// app/(app)/(dashboard)/calls/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Plus,
  Phone,
  Clock,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  PhoneCall,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import CallCheckin from '@/components/call-checkin'

// Define PhoneCall interface based on your Payload CMS schema
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

export default function CallsPage() {
  const [calls, setCalls] = useState<PhoneCall[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch calls on component mount
  useEffect(() => {
    fetchCalls()
  }, [])

  const fetchCalls = async (search?: string) => {
    try {
      setRefreshing(true)
      const params = new URLSearchParams()
      if (search) {
        params.append('search', search)
      }

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

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    fetchCalls(value)
  }

  // Calculate stats
  const totalCalls = calls.length
  const totalMinutes = calls.reduce((sum, call) => sum + (call.duration || 0), 0)
  const totalCost = calls.reduce((sum, call) => sum + (call.cost || 0), 0)
  const averageDuration = totalCalls > 0 ? Math.round(totalMinutes / totalCalls) : 0

  const handleDelete = async (callId: string) => {
    if (window.confirm('Are you sure you want to delete this call record?')) {
      try {
        setLoading(true)
        const response = await fetch(`/api/phone-calls/${callId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          // Refresh the call list
          fetchCalls(searchTerm)
        } else {
          const error = await response.json()
          console.error('Failed to delete call:', error)
          alert(`Failed to delete call: ${error.message || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Error deleting call:', error)
        alert('Error deleting call. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleAddCall = (newCall: any) => {
    // Refresh the call list to include the new one
    fetchCalls(searchTerm)
    setIsAddDialogOpen(false)
  }

  const refreshData = () => {
    fetchCalls(searchTerm)
  }

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

  // Render table body based on state
  const renderTableBody = () => {
    if (refreshing) {
      return (
        <TableRow key="loading">
          <TableCell colSpan={7} className="text-center py-8">
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-muted-foreground">Loading calls...</span>
            </div>
          </TableCell>
        </TableRow>
      )
    }

    if (calls.length === 0) {
      return (
        <TableRow key="empty">
          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No calls found. Try adjusting your search.' : 'No calls found.'}
          </TableCell>
        </TableRow>
      )
    }

    return calls.map((call) => (
      <TableRow key={call._id}>
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
          <div>
            <p className="text-sm">{formatDate(call.startTime)}</p>
            <p className="text-xs text-muted-foreground">{formatTime(call.startTime)}</p>
          </div>
        </TableCell>
        <TableCell>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            {call.duration || 0} min
          </Badge>
        </TableCell>
        <TableCell className="font-medium">${(call.cost || 0).toFixed(2)}</TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              title="View Details"
              onClick={() => {
                alert(
                  `Call Details:\n\nEmployee: ${getEmployeeName(call.employee)}\nCaller: ${call.callerName || 'Unknown'}\nNumber: ${call.callerNumber}\nPurpose: ${call.purpose}\nStart: ${new Date(call.startTime).toLocaleString()}\nEnd: ${call.endTime ? new Date(call.endTime).toLocaleString() : 'N/A'}\nDuration: ${call.duration || 0} minutes\nCost: $${(call.cost || 0).toFixed(2)}`,
                )
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(call._id)}
              disabled={loading}
              title="Delete"
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
          <h1 className="text-3xl font-bold tracking-tight">Phone Call Management</h1>
          <p className="text-muted-foreground">Track and manage all office phone calls</p>
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
                <Phone className="h-4 w-4" />
                Log Call
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Log Phone Call</DialogTitle>
                <DialogDescription>
                  Record phone call details for tracking and billing.
                </DialogDescription>
              </DialogHeader>
              <CallCheckin onSubmitSuccess={handleAddCall} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalls}</div>
            <p className="text-xs text-muted-foreground">All calls in system</p>
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
            <p className="text-xs text-muted-foreground">Total call costs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Cost</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalCalls > 0 ? (totalCost / totalCalls).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">Per call</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Call History</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search calls..."
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
                  <TableHead>Employee</TableHead>
                  <TableHead>Caller</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{renderTableBody()}</TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
