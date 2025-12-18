// app/(app)/(dashboard)/parcels/[id]/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Package,
  Calendar,
  User,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  Printer,
  Download,
  Mail,
  Hash,
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
import ParcelEditForm from '@/components/parcel-edit-form'
import { toast } from 'sonner'
import Link from 'next/link'
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog'

interface SerialNumber {
  id: string
  serialNumber: string
}

interface ParcelItem {
  id: string
  description: string
  serialNumbers: SerialNumber[]
}

interface Parcel {
  id: string
  items?: ParcelItem[]
  from: string
  senderType: 'incoming' | 'outgoing' | 'other'
  to: string
  receivedAt: string
  collectedAt: string | null
  status: 'received' | 'collected' | 'returned'
  weight?: string
  dimensions?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export default function ParcelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [parcel, setParcel] = useState<Parcel | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Check if user is admin
  const isAdmin = true // Replace with actual admin check

  useEffect(() => {
    if (params.id) {
      fetchParcel(params.id as string)
    }
  }, [params.id])

  const fetchParcel = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/parcels/${id}`)
      const result = await response.json()

      if (result.success) {
        setParcel(result.data)
      } else {
        toast.error('Failed to fetch parcel details')
        router.push('/dashboard/parcels')
      }
    } catch (error) {
      console.error('Error fetching parcel:', error)
      toast.error('Error loading parcel details')
      router.push('/dashboard/parcels')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = () => {
    if (!isAdmin) {
      toast.error('Only administrators can delete parcels')
      return
    }
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/parcels/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Parcel deleted successfully')
        router.push('/dashboard/parcels')
      } else {
        const error = await response.json()
        toast.error(`Failed to delete parcel: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting parcel:', error)
      toast.error('Error deleting parcel. Please try again.')
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  const handleMarkAsCollected = async () => {
    try {
      const response = await fetch(`/api/parcels/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'collected',
          collectedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        toast.success('Parcel marked as collected')
        fetchParcel(params.id as string)
      } else {
        const error = await response.json()
        toast.error(`Failed to update parcel: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating parcel:', error)
      toast.error('Error updating parcel. Please try again.')
    }
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    fetchParcel(params.id as string)
    toast.success('Parcel updated successfully')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case 'collected':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Collected</Badge>
      case 'returned':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Returned</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getSenderTypeBadge = (type: string) => {
    const colors = {
      incoming: 'bg-blue-100 text-blue-800',
      outgoing: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800',
    }
    const labels = {
      incoming: 'Incoming',
      outgoing: 'Outgoing',
      other: 'Other',
    }
    return (
      <Badge
        className={`${colors[type as keyof typeof colors] || 'bg-gray-100'} hover:bg-opacity-80`}
      >
        {labels[type as keyof typeof labels] || type}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading parcel details...</p>
        </div>
      </div>
    )
  }

  if (!parcel) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold">Parcel Not Found</h2>
          <p className="mt-2 text-gray-600">{`The parcel you're looking for doesn't exist.`}</p>
          <Link href="/dashboard/parcels">
            <Button className="mt-4">Back to Parcels</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Parcel"
        description="Are you sure you want to delete this parcel record? This action cannot be undone."
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/parcels">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Parcel Details</h1>
            <p className="text-muted-foreground">
              From: {parcel.from} • To: {parcel.to}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Parcel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Parcel</DialogTitle>
              </DialogHeader>
              <ParcelEditForm
                parcel={parcel}
                onSuccess={handleEditSuccess}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {parcel.status === 'received' && (
            <Button onClick={handleMarkAsCollected} className="gap-2">
              <Package className="h-4 w-4" />
              Mark as Collected
            </Button>
          )}

          <Button variant="outline" size="icon" title="Print">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" title="Export">
            <Download className="h-4 w-4" />
          </Button>
          {isAdmin && (
            <Button variant="destructive" size="icon" onClick={handleDeleteClick} title="Delete">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Parcel Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parcel Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sender</label>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{parcel.from}</p>
                    {getSenderTypeBadge(parcel.senderType)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Recipient</label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{parcel.to}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(parcel.status)}</div>
                </div>
              </div>

              {parcel.items && parcel.items.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Items</label>
                    <div className="mt-2 space-y-4">
                      {parcel.items.map((item, index) => (
                        <div key={item.id || index} className="p-4 border rounded-md">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-base">{item.description}</p>
                              <div className="mt-2 space-y-1">
                                {item.serialNumbers && item.serialNumbers.length > 0 ? (
                                  item.serialNumbers.map((serial, serialIndex) => (
                                    <div
                                      key={serial.id || serialIndex}
                                      className="flex items-center gap-2 text-sm"
                                    >
                                      <Hash className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-muted-foreground">
                                        {serial.serialNumber}
                                      </span>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground">
                                    No serial numbers recorded
                                  </p>
                                )}
                              </div>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              {item.serialNumbers?.length || 0} serial(s)
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {parcel.notes && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Notes</label>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                      {parcel.notes}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dimensions & Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Weight</label>
                  <p className="font-medium">{parcel.weight || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Dimensions</label>
                  <p className="font-medium">{parcel.dimensions || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Timeline & Actions */}
        <div className="space-y-6">
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
                  <p className="font-medium">Received</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(parcel.receivedAt)}
                  </p>
                </div>
              </div>

              {parcel.collectedAt && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Collected</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(parcel.collectedAt)}
                    </p>
                  </div>
                </div>
              )}

              {parcel.createdAt && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(parcel.createdAt)}
                    </p>
                  </div>
                </div>
              )}

              {parcel.updatedAt && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(parcel.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage this parcel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Mail className="h-4 w-4" />
                Notify Recipient
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Printer className="h-4 w-4" />
                Print Label
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
