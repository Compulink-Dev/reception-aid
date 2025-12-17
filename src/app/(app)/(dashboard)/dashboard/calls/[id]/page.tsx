'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Phone,
  User,
  Mail,
  Clock,
  Calendar,
  Target,
  DollarSign,
  Edit,
  Trash2,
  Printer,
  Download,
  PhoneCall,
  FileText,
  Building,
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
import CallEditForm from '@/components/call-edit-form'
import { toast } from 'sonner'
import Link from 'next/link'

interface PhoneCall {
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
  callerName?: string
  callerNumber: string
  callerCompany?: string
  purpose: string
  startTime: string
  endTime?: string
  duration?: number
  cost?: number
  callType?: 'incoming' | 'outgoing'
  status?: 'completed' | 'missed' | 'scheduled'
  notes?: string
  followUpRequired?: boolean
  followUpDate?: string
  createdAt?: string
  updatedAt?: string
}

export default function CallDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [call, setCall] = useState<PhoneCall | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [callId, setCallId] = useState<string>('')

  // Extract ID from URL pathname as a workaround
  useEffect(() => {
    console.log('📱 CallDetailPage mounted')
    console.log('📱 params:', params)
    console.log('📱 params.id:', params?.id)
    console.log('📱 Type of params.id:', typeof params?.id)

    // Try to get ID from params first
    const idFromParams = params?.id as string
    console.log('📱 idFromParams:', idFromParams)

    if (idFromParams && idFromParams !== 'undefined') {
      console.log('📱 Using ID from params:', idFromParams)
      setCallId(idFromParams)
    } else {
      // Fallback: Extract ID from URL pathname
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname
        console.log('📱 Current pathname:', pathname)

        // Extract ID from /dashboard/calls/{id} pattern
        const pathParts = pathname.split('/')
        console.log('📱 Path parts:', pathParts)

        // The ID should be the last part of the path
        const extractedId = pathParts[pathParts.length - 1]
        console.log('📱 Extracted ID from pathname:', extractedId)

        if (extractedId && extractedId !== 'undefined' && extractedId !== 'calls') {
          console.log('📱 Using extracted ID:', extractedId)
          setCallId(extractedId)
        } else {
          console.error('❌ Could not extract valid ID from URL')
          toast.error('Invalid call ID in URL')
          router.push('/dashboard/calls')
        }
      }
    }
  }, [params, router])

  useEffect(() => {
    console.log('📱 callId updated:', callId)

    if (callId && callId.length > 0 && callId !== 'undefined') {
      console.log('📱 Fetching call with ID:', callId)
      fetchCall(callId)
    } else if (callId === 'undefined') {
      console.error('❌ callId is "undefined" string')
      toast.error('Call ID is missing')
      router.push('/dashboard/calls')
    }
  }, [callId, router])

  const fetchCall = async (id: string) => {
    try {
      setLoading(true)
      console.log('📱 API Request: GET /api/phone-calls/', id)

      const response = await fetch(`/api/phone-calls/${id}`)
      console.log('📱 API Response status:', response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('📱 API Response:', result)

      if (result.success) {
        setCall(result.data)
      } else {
        toast.error(result.message || 'Failed to fetch call details')
        router.push('/dashboard/calls')
      }
    } catch (error) {
      console.error('❌ Error fetching call:', error)
      toast.error('Error loading call details')
      router.push('/dashboard/calls')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!call) return

    if (window.confirm('Are you sure you want to delete this call record?')) {
      try {
        const response = await fetch(`/api/phone-calls/${call._id}`, {
          method: 'DELETE',
        })

        const result = await response.json()

        if (result.success) {
          toast.success('Call record deleted successfully')
          router.push('/dashboard/calls')
        } else {
          toast.error(`Failed to delete: ${result.message || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Error deleting call:', error)
        toast.error('Error deleting call record')
      }
    }
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    fetchCall(callId)
    toast.success('Call record updated successfully')
  }

  const getCallTypeBadge = (type?: string) => {
    switch (type) {
      case 'incoming':
        return <Badge className="bg-green-100 text-green-800">Incoming</Badge>
      case 'outgoing':
        return <Badge className="bg-blue-100 text-blue-800">Outgoing</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'missed':
        return <Badge className="bg-red-100 text-red-800">Missed</Badge>
      case 'scheduled':
        return <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getEmployeeInfo = (employee: any) => {
    if (!employee) return null
    if (typeof employee === 'object') return employee
    return { name: 'Unknown', email: '', department: '' }
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

  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return 'N/A'
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  // Debug view
  if (loading && !callId) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Debug: Loading Call Details</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>params:</strong> {JSON.stringify(params)}
              </p>
              <p>
                <strong>params?.id:</strong> {params?.id as string}
              </p>
              <p>
                <strong>callId state:</strong> {callId}
              </p>
              <p>
                <strong>URL Pathname:</strong>{' '}
                {typeof window !== 'undefined' ? window.location.pathname : 'Loading...'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Button onClick={() => router.push('/dashboard/calls')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Calls
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading call details...</p>
          <p className="text-sm text-gray-500 mt-1">ID: {callId}</p>
        </div>
      </div>
    )
  }

  if (!call) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Phone className="h-12 w-12 text-gray-400 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold">Call Record Not Found</h2>
          <p className="mt-2 text-gray-600">Call ID: {callId}</p>
          <p className="mt-2 text-gray-600">
            {`The call record you're looking for doesn't exist`}.
          </p>
          <Link href="/dashboard/calls">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Calls
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const employeeInfo = getEmployeeInfo(call.employee)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/calls">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Call Details</h1>
            <p className="text-muted-foreground">
              Call ID: {call._id} • {call.callerName || 'Unknown Caller'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Call
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Call Record</DialogTitle>
              </DialogHeader>
              <CallEditForm
                call={call}
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
        {/* Left Column - Call Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Call Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <User className="h-4 w-4" />
                    Employee
                  </div>
                  <div>
                    <p className="font-medium">{employeeInfo?.name}</p>
                    <p className="text-sm text-muted-foreground">{employeeInfo?.department}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    Caller
                  </div>
                  <div>
                    <p className="font-medium">{call.callerName || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">{call.callerNumber}</p>
                  </div>
                </div>

                {call.callerCompany && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Building className="h-4 w-4" />
                      Company
                    </div>
                    <p className="font-medium">{call.callerCompany}</p>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    Call Type
                  </div>
                  {getCallTypeBadge(call.callType)}
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Target className="h-4 w-4" />
                    Purpose
                  </div>
                  <p className="font-medium">{call.purpose}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    Status
                  </div>
                  {getStatusBadge(call.status)}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    Duration
                  </div>
                  <p className="font-medium">{formatDuration(call.duration)}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4" />
                    Cost
                  </div>
                  <p className="font-medium">${(call.cost || 0).toFixed(2)}</p>
                </div>

                {call.followUpRequired && call.followUpDate && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      Follow-up Date
                    </div>
                    <p className="font-medium">{formatDateTime(call.followUpDate)}</p>
                  </div>
                )}
              </div>

              {call.notes && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <FileText className="h-4 w-4" />
                      Notes
                    </div>
                    <p className="whitespace-pre-wrap">{call.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Call Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Call Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Phone className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Call Started</p>
                  <p className="text-sm text-muted-foreground">{formatDateTime(call.startTime)}</p>
                  <p className="text-xs text-muted-foreground">
                    Time: {formatTime(call.startTime)}
                  </p>
                </div>
              </div>

              {call.endTime && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <PhoneCall className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Call Ended</p>
                    <p className="text-sm text-muted-foreground">{formatDateTime(call.endTime)}</p>
                    <p className="text-xs text-muted-foreground">
                      Time: {formatTime(call.endTime)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Additional Info & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Call Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Call ID</label>
                <p className="font-medium font-mono text-sm">{call._id}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Duration (Minutes)
                </label>
                <p className="font-medium">{call.duration || 0} minutes</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Call Cost</label>
                <p className="font-medium">${(call.cost || 0).toFixed(2)}</p>
              </div>

              {call.followUpRequired && (
                <div className="pt-2 border-t">
                  <label className="text-sm font-medium text-muted-foreground">
                    Follow-up Required
                  </label>
                  <p className="font-medium text-amber-600">Yes</p>
                  {call.followUpDate && (
                    <p className="text-sm text-muted-foreground">
                      Due: {formatDateTime(call.followUpDate)}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {call.createdAt && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Record Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(call.createdAt)}
                    </p>
                  </div>
                </div>
              )}

              {call.updatedAt && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(call.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage this call record</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Phone className="h-4 w-4" />
                Call Back
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Mail className="h-4 w-4" />
                Send Email
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
