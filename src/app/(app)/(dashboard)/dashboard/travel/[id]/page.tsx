//@ts-nocheck
// app/(app)/(dashboard)/travel/[id]/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Plane,
  Car,
  Hotel,
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Edit,
  Trash2,
  Printer,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
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
import TravelLogEditForm from '@/components/travel-log-edit-form'
import { toast } from 'sonner'
import Link from 'next/link'

interface TravelLog {
  _id: string
  employee:
    | {
        _id: string
        name: string
        email: string
        department?: string
        employeeId?: string
      }
    | string
  destination: string
  purpose: string
  departureTime: string
  expectedReturn?: string
  actualReturn?: string
  status: 'pending' | 'approved' | 'departed' | 'returned' | 'cancelled'
  travelType: 'business' | 'client_visit' | 'conference' | 'training' | 'other'
  transportation: 'flight' | 'car' | 'train' | 'other'
  accommodation?: string
  estimatedCost?: number
  actualCost?: number
  notes?: string
  approvedBy?:
    | string
    | {
        _id: string
        name: string
        email: string
      }
  createdAt?: string
  updatedAt?: string
}

export default function TravelLogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [travelLog, setTravelLog] = useState<TravelLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchTravelLog(params.id as string)
    }
  }, [params.id])

  const fetchTravelLog = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/travel-logs/${id}`)
      const result = await response.json()

      if (result.success) {
        setTravelLog(result.data)
      } else {
        toast.error('Failed to fetch travel log details')
        router.push('/dashboard/travel')
      }
    } catch (error) {
      console.error('Error fetching travel log:', error)
      toast.error('Error loading travel log details')
      router.push('/dashboard/travel')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: TravelLog['status']) => {
    if (!travelLog) return

    try {
      setUpdating(true)
      const updates: any = { status: newStatus }

      if (newStatus === 'departed') {
        updates.departureTime = new Date().toISOString()
      } else if (newStatus === 'returned') {
        updates.actualReturn = new Date().toISOString()
      }

      const response = await fetch(`/api/travel-logs/${travelLog._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        toast.success(`Travel log marked as ${newStatus}`)
        fetchTravelLog(travelLog._id)
      } else {
        const error = await response.json()
        toast.error(`Failed to update: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating travel log:', error)
      toast.error('Error updating travel log')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!travelLog) return

    if (window.confirm('Are you sure you want to delete this travel log?')) {
      try {
        const response = await fetch(`/api/travel-logs/${travelLog._id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          toast.success('Travel log deleted successfully')
          router.push('/dashboard/travel')
        } else {
          const error = await response.json()
          toast.error(`Failed to delete: ${error.message || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Error deleting travel log:', error)
        toast.error('Error deleting travel log')
      }
    }
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    fetchTravelLog(params.id as string)
    toast.success('Travel log updated successfully')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending Approval
          </Badge>
        )
      case 'approved':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case 'departed':
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            <Plane className="h-3 w-3 mr-1" />
            Departed
          </Badge>
        )
      case 'returned':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Returned
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        )
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

  const getTransportationIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="h-4 w-4" />
      case 'car':
        return <Car className="h-4 w-4" />
      case 'train':
        return <Car className="h-4 w-4" />
      default:
        return <Car className="h-4 w-4" />
    }
  }

  const getEmployeeInfo = (employee: any) => {
    if (!employee) return null
    if (typeof employee === 'object') return employee
    return { name: 'Unknown', email: '', department: '' }
  }

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not scheduled'
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const calculateDuration = (start: string, end: string | null) => {
    if (!end) return null

    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffMs = endDate.getTime() - startDate.getTime()

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    return `${days}d ${hours}h`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading travel log details...</p>
        </div>
      </div>
    )
  }

  if (!travelLog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Plane className="h-12 w-12 text-gray-400 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold">Travel Log Not Found</h2>
          <p className="mt-2 text-gray-600">{`The travel log you're looking for doesn't exist.`}</p>
          <Link href="/dashboard/travel">
            <Button className="mt-4">Back to Travel Logs</Button>
          </Link>
        </div>
      </div>
    )
  }

  const employeeInfo = getEmployeeInfo(travelLog.employee)
  const duration = calculateDuration(
    travelLog.departureTime,
    travelLog.actualReturn || travelLog.expectedReturn,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/travel">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Travel Log Details</h1>
            <p className="text-muted-foreground">
              Log ID: {travelLog._id} • {employeeInfo?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Travel Log</DialogTitle>
              </DialogHeader>
              <TravelLogEditForm
                travelLog={travelLog}
                onSuccess={handleEditSuccess}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Status Action Buttons */}
          {travelLog.status === 'pending' && (
            <Button
              onClick={() => handleStatusUpdate('approved')}
              disabled={updating}
              className="gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Approve
            </Button>
          )}

          {travelLog.status === 'approved' && (
            <Button
              onClick={() => handleStatusUpdate('departed')}
              disabled={updating}
              className="gap-2"
            >
              <Plane className="h-4 w-4" />
              Mark as Departed
            </Button>
          )}

          {(travelLog.status === 'approved' || travelLog.status === 'departed') && (
            <Button
              onClick={() => handleStatusUpdate('returned')}
              disabled={updating}
              className="gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Mark as Returned
            </Button>
          )}

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
        {/* Left Column - Travel Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Travel Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Users className="h-4 w-4" />
                    Employee
                  </div>
                  <div>
                    <p className="font-medium">{employeeInfo?.name}</p>
                    <p className="text-sm text-muted-foreground">{employeeInfo?.department}</p>
                    {employeeInfo?.employeeId && (
                      <p className="text-sm text-muted-foreground">ID: {employeeInfo.employeeId}</p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" />
                    Destination
                  </div>
                  <p className="font-medium">{travelLog.destination}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    Purpose
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{travelLog.purpose}</p>
                    {getTravelTypeBadge(travelLog.travelType)}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    Transportation
                  </div>
                  <div className="flex items-center gap-2">
                    {getTransportationIcon(travelLog.transportation)}
                    <p className="font-medium capitalize">{travelLog.transportation}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    Departure
                  </div>
                  <p className="font-medium">{formatDateTime(travelLog.departureTime)}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    Expected Return
                  </div>
                  <p className="font-medium">{formatDateTime(travelLog.expectedReturn)}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {travelLog.accommodation && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Hotel className="h-4 w-4" />
                      Accommodation
                    </div>
                    <p className="font-medium">{travelLog.accommodation}</p>
                  </div>
                )}

                {(travelLog.estimatedCost || travelLog.actualCost) && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <DollarSign className="h-4 w-4" />
                      Cost
                    </div>
                    <div className="space-y-1">
                      {travelLog.estimatedCost && (
                        <p className="font-medium">
                          Estimated: ${travelLog.estimatedCost.toLocaleString()}
                        </p>
                      )}
                      {travelLog.actualCost && (
                        <p className="font-medium">
                          Actual: ${travelLog.actualCost.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {travelLog.notes && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <FileText className="h-4 w-4" />
                      Notes
                    </div>
                    <p className="whitespace-pre-wrap">{travelLog.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Approval Information */}
          {travelLog.approvedBy && (
            <Card>
              <CardHeader>
                <CardTitle>Approval Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Approved by:{' '}
                      {typeof travelLog.approvedBy === 'object'
                        ? travelLog.approvedBy.name
                        : travelLog.approvedBy}
                    </p>
                    {travelLog.status === 'approved' && travelLog.updatedAt && (
                      <p className="text-sm text-muted-foreground">
                        Approved on: {formatDateTime(travelLog.updatedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Timeline & Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Travel Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                {getStatusBadge(travelLog.status)}
              </div>

              {duration && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Duration</span>
                  <span className="font-medium">{duration}</span>
                </div>
              )}

              {travelLog.actualReturn && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Actual Return</span>
                  <span className="font-medium">{formatDateTime(travelLog.actualReturn)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {travelLog.createdAt && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Request Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(travelLog.createdAt)}
                    </p>
                  </div>
                </div>
              )}

              {travelLog.status === 'approved' && travelLog.updatedAt && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Approved</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(travelLog.updatedAt)}
                    </p>
                  </div>
                </div>
              )}

              {travelLog.status === 'departed' && travelLog.departureTime && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plane className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Departed</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(travelLog.departureTime)}
                    </p>
                  </div>
                </div>
              )}

              {travelLog.status === 'returned' && travelLog.actualReturn && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Returned</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(travelLog.actualReturn)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage this travel log</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Printer className="h-4 w-4" />
                Print Itinerary
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download className="h-4 w-4" />
                Export Details
              </Button>
              {travelLog.status === 'pending' && (
                <Button
                  variant="destructive"
                  className="w-full justify-start gap-2"
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={updating}
                >
                  <XCircle className="h-4 w-4" />
                  Cancel Travel
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
