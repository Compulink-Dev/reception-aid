// app/(app)/(dashboard)/employees/[id]/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Clock,
  Edit,
  Trash2,
  Printer,
  Download,
  CheckCircle,
  XCircle,
  Users as UsersIcon,
  Building,
  MapPin,
  Badge,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge as BadgeComponent } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import EmployeeEditForm from '@/components/employee-edit-form'
import { toast } from 'sonner'
import Link from 'next/link'

interface Employee {
  _id: string
  name: string
  employeeId: string
  email: string
  phone?: string
  department?: string
  position?: string
  isActive: boolean
  availableForMeetings?: boolean
  hireDate?: string
  address?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  createdAt?: string
  updatedAt?: string
}

export default function EmployeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchEmployee(params.id as string)
    }
  }, [params.id])

  const fetchEmployee = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/employees/${id}`)
      const result = await response.json()

      if (result.success) {
        setEmployee(result.data)
      } else {
        toast.error('Failed to fetch employee details')
        router.push('/dashboard/employees')
      }
    } catch (error) {
      console.error('Error fetching employee:', error)
      toast.error('Error loading employee details')
      router.push('/dashboard/employees')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!employee) return

    try {
      const response = await fetch(`/api/employees/${employee._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: !employee.isActive,
        }),
      })

      if (response.ok) {
        toast.success(`Employee ${employee.isActive ? 'deactivated' : 'activated'} successfully`)
        fetchEmployee(employee._id)
      } else {
        const error = await response.json()
        toast.error(`Failed to update: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating employee:', error)
      toast.error('Error updating employee status')
    }
  }

  const handleDelete = async () => {
    if (!employee) return

    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`/api/employees/${employee._id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          toast.success('Employee deleted successfully')
          router.push('/dashboard/employees')
        } else {
          const error = await response.json()
          toast.error(`Failed to delete: ${error.message || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Error deleting employee:', error)
        toast.error('Error deleting employee')
      }
    }
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    fetchEmployee(params.id as string)
    toast.success('Employee updated successfully')
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <BadgeComponent className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </BadgeComponent>
    ) : (
      <BadgeComponent className="bg-red-100 text-red-800">
        <XCircle className="h-3 w-3 mr-1" />
        Inactive
      </BadgeComponent>
    )
  }

  const getDepartmentBadge = (department?: string) => {
    if (!department) return null

    const colors: Record<string, string> = {
      it: 'bg-blue-100 text-blue-800',
      hr: 'bg-purple-100 text-purple-800',
      finance: 'bg-green-100 text-green-800',
      operations: 'bg-orange-100 text-orange-800',
      sales: 'bg-red-100 text-red-800',
    }

    return (
      <BadgeComponent className={colors[department] || 'bg-gray-100 text-gray-800'}>
        {department.charAt(0).toUpperCase() + department.slice(1)}
      </BadgeComponent>
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading employee details...</p>
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold">Employee Not Found</h2>
          <p className="mt-2 text-gray-600">{`The employee you're looking for doesn't exist.`}</p>
          <Link href="/dashboard/employees">
            <Button className="mt-4">Back to Employees</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/employees">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{employee.name}</h1>
            <p className="text-muted-foreground">
              {employee.employeeId} • {employee.position || 'Employee'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Employee</DialogTitle>
              </DialogHeader>
              <EmployeeEditForm
                employee={employee}
                onSuccess={handleEditSuccess}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Button
            variant={employee.isActive ? 'destructive' : 'default'}
            onClick={handleToggleStatus}
            className="gap-2"
          >
            {employee.isActive ? (
              <>
                <XCircle className="h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Activate
              </>
            )}
          </Button>

          <Button variant="outline" size="icon" title="Print">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" title="Export">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDelete} title="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Employee Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <User className="h-4 w-4" />
                    Full Name
                  </div>
                  <p className="font-medium">{employee.name}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    Employee ID
                  </div>
                  <p className="font-medium font-mono">{employee.employeeId}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <a
                    href={`mailto:${employee.email}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    {employee.email}
                  </a>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Phone className="h-4 w-4" />
                    Phone
                  </div>
                  <p className="font-medium">{employee.phone || 'N/A'}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Briefcase className="h-4 w-4" />
                    Department
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{employee.department || 'N/A'}</p>
                    {getDepartmentBadge(employee.department)}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    Position
                  </div>
                  <p className="font-medium">{employee.position || 'N/A'}</p>
                </div>
              </div>

              <Separator />

              {employee.hireDate && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      Hire Date
                    </div>
                    <p className="font-medium">{formatDate(employee.hireDate)}</p>
                  </div>
                </div>
              )}

              {employee.address && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4" />
                      Address
                    </div>
                    <p className="font-medium whitespace-pre-wrap">{employee.address}</p>
                  </div>
                </>
              )}

              {employee.emergencyContact && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Emergency Contact
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground">Name</label>
                          <p className="font-medium">{employee.emergencyContact.name}</p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Phone</label>
                          <p className="font-medium">{employee.emergencyContact.phone}</p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Relationship</label>
                          <p className="font-medium">{employee.emergencyContact.relationship}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Available for Meetings
                  </label>
                  <p className="font-medium">{employee.availableForMeetings ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(employee.isActive)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Timeline & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                {getStatusBadge(employee.isActive)}
              </div>

              {employee.hireDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Years of Service</span>
                  <span className="font-medium">
                    {Math.floor(
                      (new Date().getTime() - new Date(employee.hireDate).getTime()) /
                        (1000 * 60 * 60 * 24 * 365),
                    )}{' '}
                    years
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {employee.hireDate && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Hire Date</p>
                    <p className="text-sm text-muted-foreground">{formatDate(employee.hireDate)}</p>
                  </div>
                </div>
              )}

              {employee.createdAt && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Record Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(employee.createdAt)}
                    </p>
                  </div>
                </div>
              )}

              {employee.updatedAt && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(employee.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage this employee</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Mail className="h-4 w-4" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <UsersIcon className="h-4 w-4" />
                View Schedule
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Printer className="h-4 w-4" />
                Print Details
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
