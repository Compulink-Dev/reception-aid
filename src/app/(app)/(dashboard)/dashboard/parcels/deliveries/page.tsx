// app/(app)/(dashboard)/parcels/deliveries/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Truck,
  Clock,
  Package,
  AlertTriangle,
  Filter,
  Download,
  Calendar,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Define Delivery interface based on your parcel-logs schema
interface Delivery {
  id: string
  trackingNumber?: string
  sender: string
  senderType: 'supplier' | 'employee' | 'client' | 'other'
  recipient: string | { id: string; name: string; email: string }
  description: string
  receivedAt: string
  collectedAt: string | null
  status: 'received' | 'collected' | 'returned'
  deliveryService?: string
  notes?: string
  createdAt?: string
}

interface DeliveriesResponse {
  success: boolean
  data: Delivery[]
  pagination?: {
    totalDocs: number
    totalPages: number
    page: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch deliveries on component mount
  useEffect(() => {
    fetchDeliveries()
  }, [statusFilter])

  const fetchDeliveries = async () => {
    try {
      setRefreshing(true)
      const params = new URLSearchParams()

      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      // Only show parcels that have been delivered/collected
      if (statusFilter === 'all') {
        params.append('status', 'collected')
      }

      const response = await fetch(`/api/parcels?${params.toString()}`)
      const result: DeliveriesResponse = await response.json()

      if (result.success) {
        setDeliveries(result.data)
      } else {
        console.error('Failed to fetch deliveries:', result)
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // Stats calculations
  const totalDeliveries = deliveries.length
  const deliveredToday = deliveries.filter(
    (d) => d.collectedAt && new Date(d.collectedAt).toDateString() === new Date().toDateString(),
  ).length
  const scheduledDeliveries = deliveries.filter((d) => d.status === 'received').length
  const totalPackages = deliveries.length // Since each delivery is one package entry

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'collected':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>
      case 'received':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Pending</Badge>
      case 'returned':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Returned</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getSenderTypeBadge = (type: string) => {
    const colors = {
      supplier: 'bg-blue-100 text-blue-800',
      employee: 'bg-purple-100 text-purple-800',
      client: 'bg-green-100 text-green-800',
      other: 'bg-gray-100 text-gray-800',
    }
    return (
      <Badge
        className={`${colors[type as keyof typeof colors] || 'bg-gray-100'} hover:bg-opacity-80`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
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

  const refreshData = () => {
    fetchDeliveries()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery Logs</h1>
          <p className="text-muted-foreground">Track and manage all courier deliveries</p>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={refreshData}
          disabled={refreshing}
          title="Refresh data"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeliveries}</div>
            <p className="text-xs text-muted-foreground">All collected parcels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredToday}</div>
            <p className="text-xs text-muted-foreground">Collected today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledDeliveries}</div>
            <p className="text-xs text-muted-foreground">Awaiting collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPackages}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Delivery History</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Deliveries</SelectItem>
                    <SelectItem value="collected">Delivered</SelectItem>
                    <SelectItem value="received">Pending</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
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
                  <TableHead>Tracking #</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Delivery Service</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Collected</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refreshing ? (
                  <TableRow key="loading">
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-muted-foreground">Loading deliveries...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : deliveries.length === 0 ? (
                  <TableRow key="empty">
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No deliveries found.
                    </TableCell>
                  </TableRow>
                ) : (
                  deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">
                        {delivery.trackingNumber || 'No Tracking #'}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{delivery.sender}</p>
                          <div className="mt-1">{getSenderTypeBadge(delivery.senderType)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          {typeof delivery.recipient === 'object'
                            ? delivery.recipient.name
                            : delivery.recipient}
                        </p>
                      </TableCell>
                      <TableCell>{delivery.deliveryService || 'N/A'}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{formatDate(delivery.receivedAt)}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(delivery.receivedAt)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {delivery.collectedAt ? (
                          <div>
                            <p className="text-sm">{formatDate(delivery.collectedAt)}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatTime(delivery.collectedAt)}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Not collected</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(delivery.status)}</TableCell>
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
