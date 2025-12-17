// app/(app)/(dashboard)/parcels/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Plus,
  Package,
  Truck,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
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
import ParcelChecking from '@/components/parcel-checkin'
import { toast } from 'sonner'
import Link from 'next/link'

// Update the Parcel interface
interface Parcel {
  id: string
  trackingNumber?: string
  deliveryNoteNumber?: string
  serialNumbers?: Array<{ id: string; serialNumber: string }>
  from: string
  senderType: 'incoming' | 'outgoing' | 'other'
  to: string | { id: string; name: string; email: string } // Can be populated or just ID
  description: string
  receivedAt: string
  collectedAt: string | null
  status: 'received' | 'collected' | 'returned'
  weight?: string
  dimensions?: string
  deliveryService?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

// API response type
interface ParcelsResponse {
  success: boolean
  data: Parcel[]
  pagination?: {
    totalDocs: number
    totalPages: number
    page: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export default function ParcelsPage() {
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch parcels on component mount
  useEffect(() => {
    fetchParcels()
  }, [])

  const fetchParcels = async (search?: string) => {
    try {
      setRefreshing(true)
      const params = new URLSearchParams()
      if (search) {
        params.append('search', search)
      }

      const response = await fetch(`/api/parcels?${params.toString()}`)
      const result: ParcelsResponse = await response.json()

      if (result.success) {
        setParcels(result.data)
      } else {
        console.error('Failed to fetch parcels:', result)
      }
    } catch (error) {
      console.error('Error fetching parcels:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    fetchParcels(value)
  }

  // Stats calculations
  const totalParcels = parcels.length
  const pendingParcels = parcels.filter((p) => p.status === 'received').length
  const collectedToday = parcels.filter(
    (p) =>
      p.status === 'collected' &&
      p.collectedAt &&
      new Date(p.collectedAt).toDateString() === new Date().toDateString(),
  ).length
  const urgentParcels = parcels.filter(
    (p) =>
      p.notes?.toLowerCase().includes('urgent') ||
      p.notes?.toLowerCase().includes('immediate') ||
      p.notes?.toLowerCase().includes('asap'),
  ).length

  const handleMarkAsCollected = async (parcelId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/parcels/${parcelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'collected',
          collectedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        // Refresh the parcel list
        fetchParcels(searchTerm)
        toast.success('Parcel marked as collected successfully')
      } else {
        const error = await response.json()
        console.error('Failed to update parcel:', error)
        toast(`Failed to mark as collected: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating parcel:', error)
      toast('Error updating parcel. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (parcelId: string) => {
    if (window.confirm('Are you sure you want to delete this parcel record?')) {
      try {
        setLoading(true)
        const response = await fetch(`/api/parcels/${parcelId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          // Refresh the parcel list
          fetchParcels(searchTerm)
        } else {
          const error = await response.json()
          console.error('Failed to delete parcel:', error)
          toast.error(`Failed to delete parcel: ${error.message || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Error deleting parcel:', error)
        toast.error('Error deleting parcel. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleAddParcel = (newParcel: any) => {
    // Refresh the parcel list to include the new one
    fetchParcels(searchTerm)
    setIsAddDialogOpen(false)
  }

  const refreshData = () => {
    fetchParcels(searchTerm)
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

  // Update the getSenderTypeBadge function
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

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (dateString: string | null | undefined) => {
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
              <span className="text-muted-foreground">Loading parcels...</span>
            </div>
          </TableCell>
        </TableRow>
      )
    }

    if (parcels.length === 0) {
      return (
        <TableRow key="empty">
          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No parcels found. Try adjusting your search.' : 'No parcels found.'}
          </TableCell>
        </TableRow>
      )
    }

    return parcels.map((parcel) => (
      <TableRow key={parcel.id}>
        <TableCell>
          <div className="font-medium">{parcel.trackingNumber || 'No Tracking #'}</div>
          <div className="text-xs text-muted-foreground">
            {parcel.deliveryNoteNumber || 'No DN#'}
          </div>
        </TableCell>
        <TableCell>
          <div>
            <p className="font-medium">{parcel.from}</p>
            <div className="mt-1">{getSenderTypeBadge(parcel.senderType)}</div>
          </div>
        </TableCell>
        <TableCell>
          <p className="font-medium">
            {typeof parcel.to === 'object' ? parcel.to.name : parcel.to}
          </p>
        </TableCell>
        <TableCell className="max-w-xs">
          <p className="truncate">{parcel.description}</p>
          {parcel.serialNumbers && parcel.serialNumbers.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Serial: {parcel.serialNumbers.map((sn) => sn.serialNumber).join(', ')}
            </p>
          )}
          {parcel.notes && (
            <p className="text-xs text-muted-foreground mt-1 truncate">Note: {parcel.notes}</p>
          )}
          <div className="text-xs text-muted-foreground mt-1">
            {parcel.weight && <span>{parcel.weight} • </span>}
            {parcel.dimensions && <span>{parcel.dimensions}</span>}
          </div>
        </TableCell>
        <TableCell>
          <div>
            <p className="text-sm">{formatDate(parcel.receivedAt)}</p>
            <p className="text-xs text-muted-foreground">{formatTime(parcel.receivedAt)}</p>
          </div>
        </TableCell>
        <TableCell>
          {getStatusBadge(parcel.status)}
          {parcel.collectedAt && (
            <p className="text-xs text-muted-foreground mt-1">
              Collected: {formatDate(parcel.collectedAt)}
            </p>
          )}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Link href={`/dashboard/parcels/${parcel.id}`}>
              <Button variant="ghost" size="icon" title="View Details">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            {parcel.status === 'received' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleMarkAsCollected(parcel.id)}
                disabled={loading}
                title="Mark as Collected"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(parcel.id)}
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
          <h1 className="text-3xl font-bold tracking-tight">Parcel Management</h1>
          <p className="text-muted-foreground">
            Track and manage all incoming and outgoing parcels
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
                Log Parcel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Log New Parcel</DialogTitle>
                <DialogDescription>
                  Enter parcel details to log it into the system.
                </DialogDescription>
              </DialogHeader>
              <ParcelChecking onSubmitSuccess={handleAddParcel} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parcels</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParcels}</div>
            <p className="text-xs text-muted-foreground">All parcels in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Collection</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingParcels}</div>
            <p className="text-xs text-muted-foreground">Awaiting pickup</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collected Today</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectedToday}</div>
            <p className="text-xs text-muted-foreground">Successful deliveries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Parcels</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgentParcels}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Parcel Tracking</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search parcels..."
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
                  <TableHead>Tracking/DN #</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To (Recipient)</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Status</TableHead>
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
