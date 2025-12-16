// app/(app)/(dashboard)/visitors/appointments/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Plus,
  Calendar,
  Clock,
  User,
  Building,
  Mail,
  Phone,
  Check,
  X,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format, parseISO, isToday, isFuture, isPast } from 'date-fns'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Define interfaces
interface Employee {
  id: string
  name: string
  email: string
  phone?: string
  department: string
  position?: string
  status: string
  isActive?: boolean // Changed from status: string
  availableForMeetings?: boolean // Make optional
  employeeId?: string // Add employeeId
}

interface Appointment {
  id: string
  visitorName: string
  company: string
  email: string
  phone: string
  purpose: string
  employeeToMeet: string | any
  employeeToMeetText?: string
  department: string
  scheduledTime: string
  duration: number
  status: 'scheduled' | 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no-show'
  notes?: string
  visitorArrived: boolean
  checkInTime?: string
  checkOutTime?: string
  appointmentType: string
  createdAt: string
  updatedAt: string
}

interface AppointmentsResponse {
  success: boolean
  data: Appointment[]
  pagination?: {
    totalDocs: number
    totalPages: number
    page: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

interface EmployeesResponse {
  success: boolean
  data: Employee[]
  total: number
}

const departments = [
  'IT',
  'Sales',
  'Marketing',
  'Legal',
  'Executive',
  'HR',
  'Finance',
  'Operations',
]

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [newAppointment, setNewAppointment] = useState({
    visitorName: '',
    company: '',
    email: '',
    phone: '',
    purpose: '',
    employeeToMeet: '',
    department: 'IT',
    scheduledTime: '',
    duration: 60,
    notes: '',
    appointmentType: 'meeting',
    status: 'pending',
  })

  // Fetch appointments and employees on component mount
  useEffect(() => {
    fetchAppointments()
    fetchEmployees()
  }, [])

  const fetchAppointments = async (search?: string) => {
    try {
      setRefreshing(true)
      const params = new URLSearchParams()

      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      if (statusFilter === 'upcoming') {
        params.append('upcoming', 'true')
      }

      if (search) {
        params.append('search', search)
      }

      const response = await fetch(`/api/appointments?${params.toString()}`)
      const result: AppointmentsResponse = await response.json()

      if (result.success) {
        setAppointments(result.data)
        setFilteredAppointments(result.data)
      } else {
        toast.error('Failed to load appointments')
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Error loading appointments')
    } finally {
      setRefreshing(false)
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees?availableOnly=true')
      const result: EmployeesResponse = await response.json()

      if (result.success) {
        setEmployees(result.data)
      } else {
        console.error('Failed to load employees')
        setEmployees([
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            department: 'it',
            position: 'Software Engineer',
            isActive: true,
            status: 'active',
            availableForMeetings: true,
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            department: 'hr',
            position: 'HR Manager',
            isActive: true,
            status: 'active',
            availableForMeetings: true,
          },
        ])
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
      toast.error('Error loading employees')
      setEmployees([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          department: 'it',
          position: 'Software Engineer',
          isActive: true,
          status: 'active',
          availableForMeetings: true,
        },
      ])
    }
  }

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    if (value.trim() === '') {
      setFilteredAppointments(appointments)
    } else {
      const filtered = appointments.filter(
        (app) =>
          app.visitorName.toLowerCase().includes(value.toLowerCase()) ||
          app.company.toLowerCase().includes(value.toLowerCase()) ||
          app.email.toLowerCase().includes(value.toLowerCase()) ||
          app.purpose.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredAppointments(filtered)
    }
  }

  // Get employee name from relationship or text field
  const getEmployeeName = (employeeToMeet: any, employeeToMeetText?: string): string => {
    if (typeof employeeToMeet === 'object' && employeeToMeet.name) {
      return employeeToMeet.name
    }
    if (employeeToMeetText) {
      return employeeToMeetText
    }
    if (typeof employeeToMeet === 'string') {
      // Try to find employee in our local state
      const employee = employees.find((e) => e.id === employeeToMeet)
      return employee ? employee.name : employeeToMeet
    }
    return 'Not specified'
  }

  // Format duration
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours === 0) return `${mins}m`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
  }

  // Stats calculations
  const calculateStats = () => {
    const now = new Date()

    const totalAppointments = appointments.length
    const todayAppointments = appointments.filter((app) =>
      isToday(parseISO(app.scheduledTime)),
    ).length

    const upcomingAppointments = appointments.filter(
      (app) =>
        isFuture(parseISO(app.scheduledTime)) && ['scheduled', 'confirmed'].includes(app.status),
    ).length

    const pendingConfirmation = appointments.filter((app) => app.status === 'pending').length

    const completedAppointments = appointments.filter((app) => app.status === 'completed').length

    return {
      totalAppointments,
      todayAppointments,
      upcomingAppointments,
      pendingConfirmation,
      completedAppointments,
    }
  }

  const stats = calculateStats()

  const handleAddAppointment = async () => {
    // Validate required fields
    const requiredFields = [
      { field: 'visitorName', label: 'Visitor Name' },
      { field: 'company', label: 'Company' },
      { field: 'email', label: 'Email' },
      { field: 'phone', label: 'Phone' },
      { field: 'purpose', label: 'Purpose' },
      { field: 'employeeToMeet', label: 'Employee to Meet' },
      { field: 'scheduledTime', label: 'Scheduled Time' },
    ]

    const missingFields = requiredFields.filter(
      ({ field }) => !newAppointment[field as keyof typeof newAppointment],
    )

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.map((f) => f.label).join(', ')}`)
      return
    }

    try {
      setLoading(true)

      // Format the appointment data
      const appointmentData = {
        ...newAppointment,
        duration: parseInt(newAppointment.duration.toString()),
        scheduledTime: new Date(newAppointment.scheduledTime).toISOString(),
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Appointment scheduled successfully')
        setIsAddDialogOpen(false)
        resetForm()
        fetchAppointments()
      } else {
        toast.error(result.error || 'Failed to schedule appointment')
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
      toast.error('Error scheduling appointment')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Appointment ${status} successfully`)
        fetchAppointments()
      } else {
        toast.error(result.error || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Error updating appointment status')
    }
  }

  const handleCheckIn = async (id: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check-in' }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Visitor checked in successfully')
        fetchAppointments()
      } else {
        toast.error(result.error || 'Failed to check in visitor')
      }
    } catch (error) {
      console.error('Error checking in:', error)
      toast.error('Error checking in visitor')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return

    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Appointment deleted successfully')
        fetchAppointments()
      } else {
        toast.error(result.error || 'Failed to delete appointment')
      }
    } catch (error) {
      console.error('Error deleting appointment:', error)
      toast.error('Error deleting appointment')
    }
  }

  const resetForm = () => {
    setNewAppointment({
      visitorName: '',
      company: '',
      email: '',
      phone: '',
      purpose: '',
      employeeToMeet: '',
      department: 'IT',
      scheduledTime: '',
      duration: 60,
      notes: '',
      appointmentType: 'meeting',
      status: 'pending',
    })
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-purple-100 text-purple-800',
      'no-show': 'bg-gray-100 text-gray-800',
    }
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const viewAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsViewDialogOpen(true)
  }

  // Filter available employees by department
  // Filter available employees by department
  const getAvailableEmployeesByDepartment = (department: string) => {
    return employees.filter(
      (emp) =>
        emp.department?.toLowerCase() === department.toLowerCase() &&
        emp.isActive !== false && // Check if active (or undefined, which we treat as active)
        emp.availableForMeetings !== false, // Check if available for meetings
    )
  }

  // Update available employees when department changes
  useEffect(() => {
    if (newAppointment.department && employees.length > 0) {
      const availableEmployees = getAvailableEmployeesByDepartment(newAppointment.department)
      if (availableEmployees.length > 0 && !newAppointment.employeeToMeet) {
        setNewAppointment((prev) => ({
          ...prev,
          employeeToMeet: availableEmployees[0].id,
        }))
      }
    }
  }, [newAppointment.department, employees])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">Schedule and manage visitor appointments</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchAppointments()}
            disabled={refreshing}
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Schedule Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>Add visitor appointment details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Visitor Name *</label>
                    <Input
                      placeholder="John Doe"
                      value={newAppointment.visitorName}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, visitorName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company *</label>
                    <Input
                      placeholder="Company Name"
                      value={newAppointment.company}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, company: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      placeholder="visitor@company.com"
                      type="email"
                      value={newAppointment.email}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone *</label>
                    <Input
                      placeholder="0712345678"
                      value={newAppointment.phone}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Purpose *</label>
                    <Input
                      placeholder="Meeting purpose"
                      value={newAppointment.purpose}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, purpose: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department *</label>
                    <Select
                      value={newAppointment.department}
                      onValueChange={(value) =>
                        setNewAppointment({ ...newAppointment, department: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Employee to Meet *</label>
                    <Select
                      value={newAppointment.employeeToMeet}
                      onValueChange={(value) =>
                        setNewAppointment({ ...newAppointment, employeeToMeet: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            getAvailableEmployeesByDepartment(newAppointment.department).length ===
                            0
                              ? `No employees available in ${newAppointment.department}`
                              : 'Select employee'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableEmployeesByDepartment(newAppointment.department).length ===
                        0 ? (
                          // Use a valid value for the disabled option
                          <SelectItem value="no-employees" disabled>
                            No employees available in {newAppointment.department}
                          </SelectItem>
                        ) : (
                          getAvailableEmployeesByDepartment(newAppointment.department).map(
                            (employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.name} {employee.position ? `(${employee.position})` : ''}
                              </SelectItem>
                            ),
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration *</label>
                    <Select
                      value={newAppointment.duration.toString()}
                      onValueChange={(value) =>
                        setNewAppointment({ ...newAppointment, duration: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Appointment Type</label>
                    <Select
                      value={newAppointment.appointmentType}
                      onValueChange={(value) =>
                        setNewAppointment({ ...newAppointment, appointmentType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="delivery">Delivery</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Scheduled Date & Time *</label>
                    <Input
                      type="datetime-local"
                      value={newAppointment.scheduledTime}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, scheduledTime: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea
                      placeholder="Additional notes..."
                      value={newAppointment.notes}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, notes: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAppointment} disabled={loading}>
                    {loading ? 'Scheduling...' : 'Schedule Appointment'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{`Today's Appointments`}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">Future appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Confirmation</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingConfirmation}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Appointments</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search appointments..."
                  className="pl-9 w-full md:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Appointments</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" title="Filter">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {refreshing ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto" />
              <p className="text-muted-foreground mt-2">Loading appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No appointments found.</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visitor</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Scheduled Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{appointment.visitorName}</p>
                          <p className="text-sm text-muted-foreground">{appointment.email}</p>
                          <p className="text-sm text-muted-foreground">{appointment.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.company}</TableCell>
                      <TableCell className="max-w-xs truncate">{appointment.purpose}</TableCell>
                      <TableCell>
                        {getEmployeeName(
                          appointment.employeeToMeet,
                          appointment.employeeToMeetText,
                        )}
                      </TableCell>
                      <TableCell>
                        {format(parseISO(appointment.scheduledTime), 'MMM d, yyyy · h:mm a')}
                      </TableCell>
                      <TableCell>{formatDuration(appointment.duration)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(appointment.status)}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => viewAppointmentDetails(appointment)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {appointment.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                                title="Confirm"
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                title="Decline"
                              >
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}

                          {['scheduled', 'confirmed'].includes(appointment.status) &&
                            isFuture(parseISO(appointment.scheduledTime)) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCheckIn(appointment.id)}
                                title="Check-in Visitor"
                              >
                                <Check className="h-4 w-4 text-blue-600" />
                              </Button>
                            )}

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(appointment.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Appointment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>Detailed information about the appointment</DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Visitor Name</p>
                  <p className="font-medium">{selectedAppointment.visitorName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Company</p>
                  <p className="font-medium">{selectedAppointment.company}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedAppointment.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedAppointment.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Purpose</p>
                  <p className="font-medium">{selectedAppointment.purpose}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Employee to Meet</p>
                  <p className="font-medium">
                    {getEmployeeName(
                      selectedAppointment.employeeToMeet,
                      selectedAppointment.employeeToMeetText,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedAppointment.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Scheduled Time</p>
                  <p className="font-medium">
                    {format(parseISO(selectedAppointment.scheduledTime), 'MMM d, yyyy · h:mm a')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p className="font-medium">{formatDuration(selectedAppointment.duration)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={getStatusBadge(selectedAppointment.status)}>
                    {selectedAppointment.status.charAt(0).toUpperCase() +
                      selectedAppointment.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Appointment Type</p>
                  <p className="font-medium">{selectedAppointment.appointmentType}</p>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="mt-1 p-2 bg-gray-50 rounded">{selectedAppointment.notes}</p>
                </div>
              )}

              {selectedAppointment.checkInTime && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Check-in Time</p>
                  <p className="font-medium">
                    {format(parseISO(selectedAppointment.checkInTime), 'MMM d, yyyy · h:mm a')}
                  </p>
                </div>
              )}

              {selectedAppointment.checkOutTime && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Check-out Time</p>
                  <p className="font-medium">
                    {format(parseISO(selectedAppointment.checkOutTime), 'MMM d, yyyy · h:mm a')}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
