//@ts-nocheck
// app/(app)/(dashboard)/visitors/[id]/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  Target,
  Users,
  Calendar,
  Clock,
  Edit,
  Trash2,
  Printer,
  Download,
  Mail as MailIcon,
  BadgeCheck,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import VisitorEditForm from '@/components/visitor-edit-form'
import { toast } from 'sonner'
import Link from 'next/link'

interface Visitor {
  _id: string
  name: string
  email: string
  phone: string
  company: string
  purpose: string
  employeeToMeet?:
    | {
        id: string
        name: string
        email: string
        department?: string
      }
    | string
  checkInTime: string
  checkOutTime: string | null
  status: 'checked-in' | 'checked-out'
  notes?: string
  badgeNumber?: string
  identificationType?: string
  identificationNumber?: string
  createdAt?: string
  updatedAt?: string
}

export default function VisitorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [visitor, setVisitor] = useState<Visitor | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Debug: Log all params
  React.useEffect(() => {
    console.log('=== VISITOR DETAIL PAGE PARAMS ===')
    console.log('Full params object:', params)
    console.log('Keys in params:', Object.keys(params))
    console.log('Params.id:', params?.id)
    console.log('Params._id:', params?._id)
    console.log('Type of params.id:', typeof params?.id)
    console.log('=== END DEBUG ===')
  }, [params])

  // Get the ID from params - handle both `id` and `_id`
  const visitorId = React.useMemo(() => {
    console.log('All params:', params)
    console.log('Params id:', params?.id)
    console.log('Params _id:', params?._id)

    // Try different parameter names
    return params?.id || params?._id || ''
  }, [params])

  useEffect(() => {
    console.log('Extracted visitorId:', visitorId) // Debug log

    if (visitorId) {
      console.log('Fetching visitor with ID:', visitorId)
      fetchVisitor(visitorId as string)
    } else {
      console.error('No visitor ID found in params')
    }
  }, [visitorId]) // Changed dependency to visitorId

  const fetchVisitor = async (id: string) => {
    try {
      setLoading(true)
      console.log('Fetching visitor with ID:', id) // Debug log

      const response = await fetch(`/api/visitors/${id}`)
      const result = await response.json()

      console.log('API Response:', result) // Debug log

      if (result.success) {
        // Transform the data to match the interface
        const visitorData = {
          _id: result.data.id || result.data._id,
          name: result.data.name,
          email: result.data.email,
          phone: result.data.phone,
          company: result.data.company,
          purpose: result.data.purpose,
          employeeToMeet: result.data.employeeToMeet,
          checkInTime: result.data.checkInTime,
          checkOutTime: result.data.checkOutTime,
          status: result.data.status,
          notes: result.data.notes,
          badgeNumber: result.data.badgeNumber,
          identificationType: result.data.identificationType,
          identificationNumber: result.data.identificationNumber,
          createdAt: result.data.createdAt,
          updatedAt: result.data.updatedAt,
        }
        console.log('Transformed visitor data:', visitorData) // Debug log
        setVisitor(visitorData)
      } else {
        console.error('Failed to fetch visitor:', result)
        toast.error('Failed to fetch visitor details')
        router.push('/dashboard/visitors')
      }
    } catch (error) {
      console.error('Error fetching visitor:', error)
      toast.error('Error loading visitor details')
      router.push('/dashboard/visitors')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckOut = async () => {
    if (!visitor) return

    try {
      setCheckingOut(true)
      const response = await fetch(`/api/visitors/${visitor._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'checked-out',
          checkOutTime: new Date().toISOString(),
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Visitor checked out successfully')
        fetchVisitor(visitor._id)
      } else {
        toast.error(`Failed to check out: ${result.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error checking out:', error)
      toast.error('Error checking out visitor')
    } finally {
      setCheckingOut(false)
    }
  }

  const handleDelete = async () => {
    if (!visitor) return

    if (window.confirm('Are you sure you want to delete this visitor record?')) {
      try {
        const response = await fetch(`/api/visitors/${visitor._id}`, {
          method: 'DELETE',
        })

        const result = await response.json()

        if (result.success) {
          toast.success('Visitor deleted successfully')
          router.push('/dashboard/visitors')
        } else {
          toast.error(`Failed to delete: ${result.message || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Error deleting visitor:', error)
        toast.error('Error deleting visitor')
      }
    }
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    if (visitor) {
      fetchVisitor(visitor._id)
    }
    toast.success('Visitor updated successfully')
  }

  const getEmployeeName = (employeeToMeet: any): string => {
    if (!employeeToMeet) return 'Not specified'
    if (typeof employeeToMeet === 'object' && employeeToMeet.name) {
      return employeeToMeet.name
    }
    return 'See notes'
  }

  const getEmployeeInfo = (employeeToMeet: any) => {
    if (!employeeToMeet || typeof employeeToMeet !== 'object') return null
    return employeeToMeet
  }

  const getStatusBadge = (status: string) => {
    return status === 'checked-in' ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <BadgeCheck className="h-3 w-3 mr-1" />
        Checked In
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
        <LogOut className="h-3 w-3 mr-1" />
        Checked Out
      </Badge>
    )
  }

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const calculateDuration = (checkIn: string, checkOut: string | null) => {
    if (!checkOut) return null

    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffMs = end.getTime() - start.getTime()

    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading visitor details...</p>
        </div>
      </div>
    )
  }

  if (!visitor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold">Visitor Not Found</h2>
          <p className="mt-2 text-gray-600">{`The visitor you're looking for doesn't exist.`}</p>
          <Link href="/dashboard/visitors">
            <Button className="mt-4">Back to Visitors</Button>
          </Link>
        </div>
      </div>
    )
  }

  const employeeInfo = getEmployeeInfo(visitor.employeeToMeet)
  const duration = calculateDuration(visitor.checkInTime, visitor.checkOutTime)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/visitors">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{visitor.name}</h1>
            <p className="text-muted-foreground">
              Visitor ID: {visitor._id} • {visitor.company}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {visitor.status === 'checked-in' && (
            <Button onClick={handleCheckOut} disabled={checkingOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              {checkingOut ? 'Checking Out...' : 'Check Out'}
            </Button>
          )}

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Visitor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Visitor</DialogTitle>
              </DialogHeader>
              <VisitorEditForm
                visitor={visitor}
                onSuccess={handleEditSuccess}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

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
        {/* Left Column - Visitor Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <User className="h-4 w-4" />
                    Full Name
                  </div>
                  <p className="font-medium">{visitor.name}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Building className="h-4 w-4" />
                    Company
                  </div>
                  <p className="font-medium">{visitor.company || 'N/A'}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <a
                    href={`mailto:${visitor.email}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    {visitor.email}
                  </a>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Phone className="h-4 w-4" />
                    Phone
                  </div>
                  <p className="font-medium">{visitor.phone}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Target className="h-4 w-4" />
                    Purpose
                  </div>
                  <p className="font-medium">{visitor.purpose}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Users className="h-4 w-4" />
                    Employee to Meet
                  </div>
                  <p className="font-medium">{getEmployeeName(visitor.employeeToMeet)}</p>
                  {employeeInfo?.email && (
                    <a
                      href={`mailto:${employeeInfo.email}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {employeeInfo.email}
                    </a>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  Notes
                </div>
                <p className="whitespace-pre-wrap">{visitor.notes || 'No additional notes'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Identification Details */}
          <Card>
            <CardHeader>
              <CardTitle>Identification Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Badge Number</label>
                  <p className="font-medium">{visitor.badgeNumber || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID Type</label>
                  <p className="font-medium">{visitor.identificationType || 'N/A'}</p>
                </div>
                {visitor.identificationNumber && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">ID Number</label>
                    <p className="font-medium">{visitor.identificationNumber}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Timeline & Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visit Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                {getStatusBadge(visitor.status)}
              </div>

              {duration && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Visit Duration</span>
                  <span className="font-medium">{duration}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Check In</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(visitor.checkInTime)}
                  </p>
                </div>
              </div>

              {visitor.checkOutTime && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <LogOut className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Check Out</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(visitor.checkOutTime)}
                    </p>
                  </div>
                </div>
              )}

              {visitor.createdAt && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Record Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(visitor.createdAt)}
                    </p>
                  </div>
                </div>
              )}

              {visitor.updatedAt && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(visitor.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage this visitor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <MailIcon className="h-4 w-4" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Printer className="h-4 w-4" />
                Print Badge
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download className="h-4 w-4" />
                Export Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
