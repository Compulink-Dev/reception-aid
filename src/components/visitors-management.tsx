//@ts-nocheck
// components/reception/VisitorManagement.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  DialogFooter,
} from '@/components/ui/dialog'
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
  Plus,
  User,
  Clock,
  Building,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react'
import { format } from 'date-fns'

// In VisitorManagement.tsx, update the interface
interface Employee {
  id: string
  name: string
  department?: string
}

interface Visitor {
  id: string
  name: string
  email: string
  phone: string
  company: string
  purpose: string
  employeeToMeet?: string | Employee // Can be string or Employee object
  checkInTime: string
  checkOutTime: string
  status: 'checked-in' | 'checked-out' | 'expected'
  notes?: string
  badgeNumber?: string
  createdAt?: string
  updatedAt?: string
}
export default function VisitorManagement() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    purpose: '',
    employeeToMeet: '',
    status: 'checked-in' as const,
  })

  useEffect(() => {
    fetchVisitors()
  }, [])

  const fetchVisitors = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/visitors')
      const data = await response.json()

      if (data.docs) {
        const visitorsData = data.docs.map((doc: any) => {
          // Handle employee relationship - could be ID, object, or populated
          const employeeToMeet = doc.employeeToMeet
            ? typeof doc.employeeToMeet === 'object'
              ? doc.employeeToMeet.name
              : doc.employeeToMeet
            : ''

          return {
            id: doc.id,
            name: doc.name || '',
            email: doc.email || '',
            phone: doc.phone || '',
            company: doc.company || '',
            purpose: doc.purpose || '',
            employeeToMeet: employeeToMeet,
            checkInTime: doc.checkInTime || new Date().toISOString(),
            checkOutTime: doc.checkOutTime || '',
            status: doc.status || 'checked-in',
            notes: doc.notes || '',
            badgeNumber: doc.badgeNumber || '',
          }
        })
        setVisitors(visitorsData)
      } else {
        setVisitors([])
      }
    } catch (error) {
      console.error('Error fetching visitors:', error)
      setVisitors([])
    } finally {
      setLoading(false)
    }
  }

  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch =
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || visitor.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: visitors.length,
    checkedIn: visitors.filter((v) => v.status === 'checked-in').length,
    checkedOut: visitors.filter((v) => v.status === 'checked-out').length,
    expected: visitors.filter((v) => v.status === 'expected').length,
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = selectedVisitor ? 'PATCH' : 'POST'
      const url = selectedVisitor ? `/api/visitors/${selectedVisitor.id}` : '/api/visitors'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert(`Visitor ${selectedVisitor ? 'updated' : 'added'} successfully!`)
        setShowAddDialog(false)
        setShowEditDialog(false)
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          purpose: '',
          employeeToMeet: '',
          status: 'checked-in',
        })
        fetchVisitors()
      }
    } catch (error) {
      console.error('Error saving visitor:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this visitor?')) {
      try {
        const response = await fetch(`/api/visitors/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          alert('Visitor deleted successfully!')
          fetchVisitors()
        }
      } catch (error) {
        console.error('Error deleting visitor:', error)
      }
    }
  }

  const handleCheckOut = async (visitor: Visitor) => {
    try {
      const response = await fetch(`/api/visitors/${visitor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'checked-out',
          checkOutTime: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        alert('Visitor checked out successfully!')
        fetchVisitors()
      }
    } catch (error) {
      console.error('Error checking out visitor:', error)
    }
  }

  const exportToCSV = () => {
    const headers = [
      'Name',
      'Company',
      'Email',
      'Phone',
      'Purpose',
      'Employee to Meet',
      'Check-in Time',
      'Check-out Time',
      'Status',
    ]
    const csvData = filteredVisitors.map((v) => [
      v.name,
      v.company,
      v.email,
      v.phone,
      v.purpose,
      v.employeeToMeet,
      v.checkInTime ? format(new Date(v.checkInTime), 'yyyy-MM-dd HH:mm') : '',
      v.checkOutTime ? format(new Date(v.checkOutTime), 'yyyy-MM-dd HH:mm') : '',
      v.status,
    ])

    const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'visitors.csv'
    a.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading visitors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checkedIn}</div>
            <p className="text-xs text-muted-foreground">Currently on site</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked Out</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checkedOut}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expected}</div>
            <p className="text-xs text-muted-foreground">Scheduled visits</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Visitor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Visitor</DialogTitle>
                <DialogDescription>Register a new visitor to the system</DialogDescription>
              </DialogHeader>
              <VisitorForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onCancel={() => setShowAddDialog(false)}
              />
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search visitors..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="checked-in">Checked In</SelectItem>
              <SelectItem value="checked-out">Checked Out</SelectItem>
              <SelectItem value="expected">Expected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Visitors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Visitor Records</CardTitle>
          <CardDescription>All visitor entries and exits</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Visitors</TabsTrigger>
              <TabsTrigger value="current">Currently On Site</TabsTrigger>
              <TabsTrigger value="today">{`Today's Visitors`}</TabsTrigger>
              <TabsTrigger value="expected">Expected</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Visitor</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Employee to Meet</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVisitors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No visitors found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVisitors.map((visitor) => (
                        <TableRow key={visitor.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{visitor.name}</p>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Building className="h-3 w-3" />
                                <span>{visitor.company}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span className="text-sm">{visitor.phone}</span>
                              </div>
                              {visitor.email && (
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3 text-gray-400" />
                                  <span className="text-sm">{visitor.email}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="truncate" title={visitor.purpose}>
                              {visitor.purpose}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{visitor.employeeToMeet || 'N/A'}</Badge>
                          </TableCell>
                          <TableCell>
                            {visitor.checkInTime ? (
                              <div className="text-sm">
                                {format(new Date(visitor.checkInTime), 'MMM d, yyyy')}
                                <div className="text-xs text-muted-foreground">
                                  {format(new Date(visitor.checkInTime), 'h:mm a')}
                                </div>
                              </div>
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                          <TableCell>
                            {visitor.checkOutTime ? (
                              <div className="text-sm">
                                {format(new Date(visitor.checkOutTime), 'MMM d, yyyy')}
                                <div className="text-xs text-muted-foreground">
                                  {format(new Date(visitor.checkOutTime), 'h:mm a')}
                                </div>
                              </div>
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                visitor.status === 'checked-in'
                                  ? 'bg-green-100 text-green-800'
                                  : visitor.status === 'checked-out'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {visitor.status.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {visitor.status === 'checked-in' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCheckOut(visitor)}
                                >
                                  Check Out
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedVisitor(visitor)
                                  setFormData({
                                    name: visitor.name,
                                    email: visitor.email,
                                    phone: visitor.phone,
                                    company: visitor.company,
                                    purpose: visitor.purpose,
                                    employeeToMeet: visitor.employeeToMeet,
                                    status: visitor.status,
                                  })
                                  setShowEditDialog(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(visitor.id)}
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Currently On Site */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Currently On Site ({stats.checkedIn})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visitors
              .filter((v) => v.status === 'checked-in')
              .slice(0, 6)
              .map((visitor) => (
                <div key={visitor.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{visitor.name}</p>
                      <p className="text-sm text-muted-foreground">{visitor.company}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">On Site</Badge>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>Arrived: {format(new Date(visitor.checkInTime), 'h:mm a')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>Meeting: {visitor.employeeToMeet || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">{visitor.purpose}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Visitor</DialogTitle>
            <DialogDescription>Update visitor information</DialogDescription>
          </DialogHeader>
          <VisitorForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowEditDialog(false)
              setSelectedVisitor(null)
              setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                purpose: '',
                employeeToMeet: '',
                status: 'checked-in',
              })
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function VisitorForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
}: {
  formData: any
  setFormData: (data: any) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Full Name *</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Phone Number *</label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="0712345678"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email Address</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Company</label>
          <Input
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Company Name"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Purpose of Visit *</label>
          <textarea
            className="w-full min-h-[80px] p-2 border rounded-md"
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            placeholder="Meeting, delivery, interview..."
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Employee to Meet</label>
          <Input
            value={formData.employeeToMeet}
            onChange={(e) => setFormData({ ...formData, employeeToMeet: e.target.value })}
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <Select
            value={formData.status}
            onValueChange={(value: any) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="checked-in">Checked In</SelectItem>
              <SelectItem value="checked-out">Checked Out</SelectItem>
              <SelectItem value="expected">Expected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Visitor</Button>
      </DialogFooter>
    </form>
  )
}
