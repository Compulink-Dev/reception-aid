// app/(app)/(dashboard)/parcels/tracking/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Search,
  Package,
  Truck,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface Parcel {
  id: string
  trackingNumber?: string
  sender: string
  senderType: 'supplier' | 'employee' | 'client' | 'other'
  recipient: string | { id: string; name: string; email: string }
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

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [searchResult, setSearchResult] = useState<Parcel | null>(null)
  const [searchError, setSearchError] = useState('')
  const [recentParcels, setRecentParcels] = useState<Parcel[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch recent parcels on component mount
  useEffect(() => {
    fetchRecentParcels()
  }, [])

  const fetchRecentParcels = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/parcels?limit=5&sort=-receivedAt')
      const result: ParcelsResponse = await response.json()

      if (result.success) {
        setRecentParcels(result.data)
      }
    } catch (error) {
      console.error('Error fetching recent parcels:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!trackingNumber.trim()) {
      setSearchError('Please enter a tracking number')
      return
    }

    try {
      setLoading(true)
      setSearchError('')

      // Search for parcel by tracking number
      const response = await fetch(`/api/parcels?search=${encodeURIComponent(trackingNumber)}`)
      const result: ParcelsResponse = await response.json()

      if (result.success && result.data.length > 0) {
        const parcel = result.data.find(
          (p) => p.trackingNumber?.toLowerCase() === trackingNumber.toLowerCase(),
        )

        if (parcel) {
          setSearchResult(parcel)
          setSearchError('')
        } else {
          setSearchResult(null)
          setSearchError('Tracking number not found')
        }
      } else {
        setSearchResult(null)
        setSearchError('Tracking number not found')
      }
    } catch (error) {
      console.error('Error searching for parcel:', error)
      setSearchError('An error occurred while searching')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'collected':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'received':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'returned':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'collected':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Collected</Badge>
      case 'received':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Pending</Badge>
      case 'returned':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Returned</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const generateTimeline = (parcel: Parcel) => {
    const timeline = []

    // Received timeline entry
    timeline.push({
      date: parcel.receivedAt,
      status: 'received',
      location: 'Reception',
      description: `Parcel received from ${parcel.sender}`,
    })

    // If collected, add collection entry
    if (parcel.collectedAt) {
      timeline.push({
        date: parcel.collectedAt,
        status: 'collected',
        location: 'Reception',
        description: `Parcel collected by ${parcel.recipient}`,
      })
    }

    // Sort by date (newest first)
    return timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parcel Tracking</h1>
          <p className="text-muted-foreground">Track your parcels in real-time</p>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={fetchRecentParcels}
          disabled={loading}
          title="Refresh data"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Search Card */}
      <Card>
        <CardHeader>
          <CardTitle>Track Parcel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter tracking number (e.g., TRK123456789)"
                  className="pl-9"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  disabled={loading}
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Track'}
              </Button>
            </div>
            {searchError && (
              <div className="flex items-center gap-2 text-red-500">
                <XCircle className="h-4 w-4" />
                <p className="text-sm">{searchError}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {searchResult && (
        <>
          {/* Summary Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Tracking Number</p>
                  <p className="text-xl font-bold">
                    {searchResult.trackingNumber || 'No Tracking #'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(searchResult.status)}
                    {getStatusBadge(searchResult.status)}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Recipient</p>
                  <p className="text-xl font-bold">
                    {typeof searchResult.recipient === 'object'
                      ? searchResult.recipient.name
                      : searchResult.recipient}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Delivery Service</p>
                  <p className="text-xl font-bold">{searchResult.deliveryService || 'N/A'}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Sender</p>
                  <p className="text-lg font-medium">{searchResult.sender}</p>
                  <Badge variant="outline" className="mt-1">
                    {searchResult.senderType}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-lg font-medium">{searchResult.description}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Package Details</p>
                  <div className="space-y-1">
                    {searchResult.weight && (
                      <p className="text-sm">Weight: {searchResult.weight}</p>
                    )}
                    {searchResult.dimensions && (
                      <p className="text-sm">Dimensions: {searchResult.dimensions}</p>
                    )}
                  </div>
                </div>
              </div>

              {searchResult.notes && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{searchResult.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card>
            <CardHeader>
              <CardTitle>Tracking History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {generateTimeline(searchResult).map((event: any, index: number) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {getStatusIcon(event.status)}
                      </div>
                      {index < generateTimeline(searchResult).length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold capitalize">
                          {event.status.replace('-', ' ')}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} at{' '}
                          {new Date(event.date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      </div>
                      <p className="text-sm mt-2">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Recent Parcels */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Parcels</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading recent parcels...</span>
            </div>
          ) : recentParcels.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No recent parcels found.</div>
          ) : (
            <div className="space-y-3">
              {recentParcels.map((parcel) => (
                <div
                  key={parcel.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setTrackingNumber(parcel.trackingNumber || '')
                    setSearchResult(parcel)
                    setSearchError('')
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{parcel.trackingNumber || 'No Tracking #'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(parcel.status)}
                        <p className="text-xs text-muted-foreground">
                          To:{' '}
                          {typeof parcel.recipient === 'object'
                            ? parcel.recipient.name
                            : parcel.recipient}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {parcel.deliveryService || 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(parcel.receivedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
