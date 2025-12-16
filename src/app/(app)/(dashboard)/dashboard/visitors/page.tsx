// app/(app)/(dashboard)/visitors/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Users, Eye, Edit, Trash2, Search, Filter, Download, RefreshCw } from 'lucide-react'
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
import VisitorCheckin from '@/components/vistor-checkin'
import { toast } from 'sonner'

// Define Visitor interface based on your MongoDB schema
interface Visitor {
  _id: string
  name: string
  email: string
  phone: string
  company: string
  purpose: string
  employeeToMeet?: any // Could be string or object
  checkInTime: string
  checkOutTime: string | null
  status: 'checked-in' | 'checked-out'
  notes?: string
  badgeNumber?: string
  createdAt?: string
  updatedAt?: string
}

// API response type
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

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch visitors on component mount
  useEffect(() => {
    fetchVisitors()
  }, [])

  const fetchVisitors = async (search?: string) => {
    try {
      setRefreshing(true)
      const params = new URLSearchParams()
      if (search) {
        params.append('search', search)
      }

      const response = await fetch(`/api/visitors?${params.toString()}`)
      const result: VisitorsResponse = await response.json()

      if (result.success) {
        setVisitors(result.data)
      } else {
        console.error('Failed to fetch visitors:', result)
      }
    } catch (error) {
      console.error('Error fetching visitors:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    fetchVisitors(value)
  }

  // Stats calculations
  const totalVisitors = visitors.length
  const activeVisitors = visitors.filter((v) => v.status === 'checked-in').length
  const recentVisitors = visitors.filter(
    (v) => new Date(v.checkInTime) > new Date(Date.now() - 24 * 60 * 60 * 1000),
  ).length

  // Get employee name (handles both string ID and populated object)
  const getEmployeeName = (employeeToMeet: any): string => {
    if (!employeeToMeet) return 'Not specified'

    // If it's a populated employee object
    if (typeof employeeToMeet === 'object' && employeeToMeet.name) {
      return employeeToMeet.name
    }

    // If it's just an ID or string reference from notes
    return 'See notes'
  }

  const handleCheckOut = async (visitorId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/visitors/${visitorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'checked-out',
          checkOutTime: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        // Refresh the visitor list
        fetchVisitors(searchTerm)
      } else {
        const error = await response.json()
        console.error('Failed to check out visitor:', error)
        toast.error(`Failed to check out visitor: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error checking out visitor:', error)
      toast.error('Error checking out visitor. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (visitorId: string) => {
    if (window.confirm('Are you sure you want to delete this visitor?')) {
      try {
        setLoading(true)
        const response = await fetch(`/api/visitors/${visitorId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          // Refresh the visitor list
          fetchVisitors(searchTerm)
        } else {
          const error = await response.json()
          console.error('Failed to delete visitor:', error)
          toast.success(`Failed to delete visitor: ${error.message || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Error deleting visitor:', error)
        toast.success('Error deleting visitor. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleAddVisitor = (newVisitor: any) => {
    // Refresh the visitor list to include the new one
    fetchVisitors(searchTerm)
    setIsAddDialogOpen(false)
  }

  const refreshData = () => {
    fetchVisitors(searchTerm)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visitor Management</h1>
          <p className="text-muted-foreground">
            Track and manage all visitor check-ins and appointments
          </p>
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
                Add Visitor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Check-in New Visitor</DialogTitle>
                <DialogDescription>
                  Enter visitor details to check them in to the system.
                </DialogDescription>
              </DialogHeader>
              <VisitorCheckin onSubmitSuccess={handleAddVisitor} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisitors}</div>
            <p className="text-xs text-muted-foreground">All visitors in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Active</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVisitors}</div>
            <p className="text-xs text-muted-foreground">In the building now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Visitors</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentVisitors}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Visitor Log</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search visitors..."
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
                  <TableHead>Visitor</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Employee to Meet</TableHead>
                  <TableHead>Check-in Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refreshing ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-muted-foreground">Loading visitors...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : visitors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm
                        ? 'No visitors found. Try adjusting your search.'
                        : 'No visitors found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  visitors.map((visitor) => (
                    <TableRow key={visitor._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{visitor.name}</p>
                          <p className="text-sm text-muted-foreground">{visitor.email}</p>
                          <p className="text-sm text-muted-foreground">{visitor.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{visitor.company || 'N/A'}</TableCell>
                      <TableCell className="max-w-xs truncate">{visitor.purpose}</TableCell>
                      <TableCell>{getEmployeeName(visitor.employeeToMeet)}</TableCell>
                      <TableCell>
                        {new Date(visitor.checkInTime).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={visitor.status === 'checked-in' ? 'default' : 'secondary'}
                          className={
                            visitor.status === 'checked-in'
                              ? 'bg-green-100 text-green-800 hover:bg-green-100'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                          }
                        >
                          {visitor.status === 'checked-in' ? 'Checked In' : 'Checked Out'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              // Implement view details
                              alert(
                                `Visitor Details:\n\nName: ${visitor.name}\nEmail: ${visitor.email}\nPhone: ${visitor.phone}\nCompany: ${visitor.company}\nPurpose: ${visitor.purpose}\nCheck-in: ${new Date(visitor.checkInTime).toLocaleString()}\nStatus: ${visitor.status}${visitor.notes ? `\nNotes: ${visitor.notes}` : ''}`,
                              )
                            }}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {visitor.status === 'checked-in' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCheckOut(visitor._id)}
                              disabled={loading}
                              title="Check Out"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(visitor._id)}
                            disabled={loading}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
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
