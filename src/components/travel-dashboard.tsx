// app/(app)/(dashboard)/travel/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Plus,
  Plane,
  Car,
  Hotel,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  MapPin,
  Calendar,
  Users,
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
import { toast } from 'sonner'
import TravelLogForm from './travel-form'

// Define TravelLog interface
interface TravelLog {
  id: string
  employee: string | { id: string; name: string; email: string; department?: string }
  destination: string
  purpose: string
  departureTime: string
  expectedReturn?: string
  actualReturn?: string
  status: 'pending' | 'approved' | 'departed' | 'returned' | 'cancelled'
  travelType?: 'business' | 'client_visit' | 'conference' | 'training' | 'other'
  transportation?: 'flight' | 'car' | 'train' | 'other'
  accommodation?: string
  estimatedCost?: number
  notes?: string
  approvedBy?: string
  createdAt?: string
  updatedAt?: string
}

// API response type
interface TravelLogsResponse {
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

export default function TravelPage() {
  const [travelLogs, setTravelLogs] = useState<TravelLog[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

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

      const response = await fetch(`/api/travel-logs?${params.toString()}`)
      const result: TravelLogsResponse = await response.json()

      if (result.success) {
        setTravelLogs(result.data)
      } else {
        console.error('Failed to fetch travel logs:', result)
      }
    } catch (error) {
      console.error('Error fetching travel logs:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    fetchTravelLogs(value)
  }

  // Stats calculations
  const totalTravels = travelLogs.length
  const activeTravels = travelLogs.filter(
    (t) => t.status === 'approved' || t.status === 'departed',
  ).length
  const pendingApprovals = travelLogs.filter((t) => t.status === 'pending').length
  const completedThisMonth = travelLogs.filter(
    (t) =>
      t.status === 'returned' &&
      t.actualReturn &&
      new Date(t.actualReturn).getMonth() === new Date().getMonth(),
  ).length

  const handleApprove = async (logId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/travel-logs/${logId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          approvedBy: 'Admin', // This should come from auth context
        }),
      })

      if (response.ok) {
        fetchTravelLogs(searchTerm)
        toast.success('Travel request approved successfully')
      } else {
        const error = await response.json()
        console.error('Failed to approve travel:', error)
        toast.error(`Failed to approve: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error approving travel:', error)
      toast.error('Error approving travel. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsDeparted = async (logId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/travel-logs/${logId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'departed',
          departureTime: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        fetchTravelLogs(searchTerm)
        toast.success('Marked as departed successfully')
      } else {
        const error = await response.json()
        console.error('Failed to mark as departed:', error)
        toast.error(`Failed to update: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating travel log:', error)
      toast.error('Error updating travel log. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsReturned = async (logId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/travel-logs/${logId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'returned',
          actualReturn: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        fetchTravelLogs(searchTerm)
        toast.success('Marked as returned successfully')
      } else {
        const error = await response.json()
        console.error('Failed to mark as returned:', error)
        toast.error(`Failed to update: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating travel log:', error)
      toast.error('Error updating travel log. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (logId: string) => {
    if (window.confirm('Are you sure you want to delete this travel log?')) {
      try {
        setLoading(true)
        const response = await fetch(`/api/travel-logs/${logId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          fetchTravelLogs(searchTerm)
          toast.success('Travel log deleted successfully')
        } else {
          const error = await response.json()
          console.error('Failed to delete travel log:', error)
          toast.error(`Failed to delete: ${error.message || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Error deleting travel log:', error)
        toast.error('Error deleting travel log. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleAddTravelLog = (newLog: any) => {
    fetchTravelLogs(searchTerm)
    setIsAddDialogOpen(false)
  }

  const refreshData = () => {
    fetchTravelLogs(searchTerm)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Approved</Badge>
      case 'departed':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Departed</Badge>
      case 'returned':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Returned</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTravelTypeBadge = (type: string) => {
    const types: Record<string, string> = {
      business: 'Business',
      client_visit: 'Client Visit',
      conference: 'Conference',
      training: 'Training',
      other: 'Other',
    }
    const colors: Record<string, string> = {
      business: 'bg-blue-100 text-blue-800',
      client_visit: 'bg-green-100 text-green-800',
      conference: 'bg-purple-100 text-purple-800',
      training: 'bg-amber-100 text-amber-800',
      other: 'bg-gray-100 text-gray-800',
    }
    return (
      <Badge className={`${colors[type] || 'bg-gray-100'} hover:bg-opacity-80`}>
        {types[type] || type}
      </Badge>
    )
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
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

  // Render table body based on state
  const renderTableBody = () => {
    if (refreshing) {
      return (
        <TableRow key="loading">
          <TableCell colSpan={8} className="text-center py-8">
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-muted-foreground">Loading travel logs...</span>
            </div>
          </TableCell>
        </TableRow>
      )
    }

    if (travelLogs.length === 0) {
      return (
        <TableRow key="empty">
          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
            {searchTerm
              ? 'No travel logs found. Try adjusting your search.'
              : 'No travel logs found.'}
          </TableCell>
        </TableRow>
      )
    }

    return travelLogs.map((log) => (
      <TableRow key={log.id}>
        <TableCell>
          <div>
            <p className="font-medium">
              {typeof log.employee === 'object' ? log.employee.name : log.employee}
            </p>
            {typeof log.employee === 'object' && log.employee.department && (
              <p className="text-xs text-muted-foreground">{log.employee.department}</p>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            <span className="font-medium">{log.destination}</span>
          </div>
        </TableCell>
        <TableCell className="max-w-xs">
          <p className="truncate">{log.purpose}</p>
          {log.travelType && <div className="mt-1">{getTravelTypeBadge(log.travelType)}</div>}
        </TableCell>
        <TableCell>
          <div>
            <p className="text-sm">{formatDateTime(log.departureTime)}</p>
            {log.expectedReturn && (
              <p className="text-xs text-muted-foreground">
                Expected: {formatDate(log.expectedReturn)}
              </p>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div>
            {log.actualReturn ? (
              <>
                <p className="text-sm">{formatDateTime(log.actualReturn)}</p>
                <p className="text-xs text-muted-foreground">Returned</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Not returned</p>
            )}
          </div>
        </TableCell>
        <TableCell>{getStatusBadge(log.status)}</TableCell>
        <TableCell>
          {log.estimatedCost && (
            <div>
              <p className="font-medium">${log.estimatedCost.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Estimated</p>
            </div>
          )}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              title="View Details"
              onClick={() => {
                alert(
                  `Travel Log Details:\n\nEmployee: ${typeof log.employee === 'object' ? log.employee.name : log.employee}\nDestination: ${log.destination}\nPurpose: ${log.purpose}\nStatus: ${log.status}\nDeparture: ${new Date(log.departureTime).toLocaleString()}\nExpected Return: ${log.expectedReturn ? new Date(log.expectedReturn).toLocaleString() : 'Not specified'}\nActual Return: ${log.actualReturn ? new Date(log.actualReturn).toLocaleString() : 'Not returned'}\nTravel Type: ${log.travelType || 'N/A'}\nTransportation: ${log.transportation || 'N/A'}\nAccommodation: ${log.accommodation || 'N/A'}\nEstimated Cost: ${log.estimatedCost ? '$' + log.estimatedCost.toLocaleString() : 'N/A'}${log.notes ? `\n\nNotes: ${log.notes}` : ''}`,
                )
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>

            {log.status === 'pending' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleApprove(log.id)}
                disabled={loading}
                title="Approve"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}

            {log.status === 'approved' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleMarkAsDeparted(log.id)}
                disabled={loading}
                title="Mark as Departed"
              >
                <Plane className="h-4 w-4" />
              </Button>
            )}

            {(log.status === 'approved' || log.status === 'departed') && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleMarkAsReturned(log.id)}
                disabled={loading}
                title="Mark as Returned"
              >
                <Clock className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(log.id)}
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
          <h1 className="text-3xl font-bold tracking-tight">Travel Management</h1>
          <p className="text-muted-foreground">Track and manage employee travel and departures</p>
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
                Log Travel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Log New Travel</DialogTitle>
                <DialogDescription>
                  Enter travel details to log employee departure.
                </DialogDescription>
              </DialogHeader>
              <TravelLogForm onSubmitSuccess={handleAddTravelLog} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Travel Logs</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTravels}</div>
            <p className="text-xs text-muted-foreground">All travel records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Travels</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTravels}</div>
            <p className="text-xs text-muted-foreground">Currently traveling</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedThisMonth}</div>
            <p className="text-xs text-muted-foreground">Travels returned</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Travel Logs</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search travel logs..."
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
                  <TableHead>Destination</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Return</TableHead>
                  <TableHead>Status</TableHead>
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
