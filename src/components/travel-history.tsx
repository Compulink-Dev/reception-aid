// components/travel/TravelHistory.tsx
'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
import { Search, Filter, Download, Calendar, User, MapPin, ChevronDown, Eye } from 'lucide-react'
import { format } from 'date-fns'

const mockTravelHistory = [
  {
    id: '1',
    employee: 'John Doe',
    department: 'Sales',
    destination: 'New York, USA',
    purpose: 'Client Meeting - TechCorp',
    departureDate: '2024-01-15',
    returnDate: '2024-01-18',
    duration: '3 days',
    cost: 2450,
    status: 'completed',
    type: 'Business Meeting',
    approvalStatus: 'approved',
  },
  {
    id: '2',
    employee: 'Jane Smith',
    department: 'IT',
    destination: 'London, UK',
    purpose: 'Annual Tech Conference',
    departureDate: '2024-01-10',
    returnDate: '2024-01-15',
    duration: '5 days',
    cost: 3200,
    status: 'completed',
    type: 'Conference',
    approvalStatus: 'approved',
  },
  {
    id: '3',
    employee: 'Mike Chen',
    department: 'Marketing',
    destination: 'Tokyo, Japan',
    purpose: 'Product Launch Event',
    departureDate: '2024-01-05',
    returnDate: '2024-01-12',
    duration: '7 days',
    cost: 4150,
    status: 'completed',
    type: 'Event',
    approvalStatus: 'approved',
  },
  {
    id: '4',
    employee: 'Sarah Johnson',
    department: 'HR',
    destination: 'Berlin, Germany',
    purpose: 'HR Conference',
    departureDate: '2024-01-08',
    returnDate: '2024-01-10',
    duration: '2 days',
    cost: 1850,
    status: 'cancelled',
    type: 'Conference',
    approvalStatus: 'approved',
  },
  {
    id: '5',
    employee: 'Tom Harris',
    department: 'Executive',
    destination: 'Paris, France',
    purpose: 'Board Meeting',
    departureDate: '2024-01-20',
    returnDate: '2024-01-22',
    duration: '2 days',
    cost: 2950,
    status: 'in-progress',
    type: 'Meeting',
    approvalStatus: 'approved',
  },
]

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
}

const typeColors = {
  'Business Meeting': 'bg-purple-100 text-purple-800',
  Conference: 'bg-orange-100 text-orange-800',
  Event: 'bg-pink-100 text-pink-800',
  Meeting: 'bg-indigo-100 text-indigo-800',
  Training: 'bg-cyan-100 text-cyan-800',
}

export default function TravelHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const filteredHistory = mockTravelHistory.filter((travel) => {
    const matchesSearch =
      travel.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      travel.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      travel.purpose.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = departmentFilter === 'all' || travel.department === departmentFilter
    const matchesStatus = statusFilter === 'all' || travel.status === statusFilter
    const matchesType = typeFilter === 'all' || travel.type === typeFilter

    return matchesSearch && matchesDepartment && matchesStatus && matchesType
  })

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.departureDate).getTime() - new Date(a.departureDate).getTime()
      case 'cost':
        return b.cost - a.cost
      case 'duration':
        return parseInt(b.duration) - parseInt(a.duration)
      default:
        return 0
    }
  })

  const exportToCSV = () => {
    const headers = [
      'Employee',
      'Department',
      'Destination',
      'Purpose',
      'Departure',
      'Return',
      'Duration',
      'Cost',
      'Status',
    ]
    const csvData = sortedHistory.map((t) => [
      t.employee,
      t.department,
      t.destination,
      t.purpose,
      t.departureDate,
      t.returnDate,
      t.duration,
      `$${t.cost}`,
      t.status,
    ])

    const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'travel-history.csv'
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Travel History</CardTitle>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search travel history..."
                  className="w-full md:w-[250px] pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date (Newest)</SelectItem>
                  <SelectItem value="cost">Cost (High to Low)</SelectItem>
                  <SelectItem value="duration">Duration (Longest)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Executive">Executive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHistory.map((travel) => (
                  <TableRow key={travel.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{travel.employee}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {travel.department}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{travel.destination}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate" title={travel.purpose}>
                        {travel.purpose}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Dep: {format(new Date(travel.departureDate), 'MMM d')}</div>
                        <div>Ret: {format(new Date(travel.returnDate), 'MMM d')}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{travel.duration}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">${travel.cost.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[travel.status as keyof typeof statusColors]}>
                        {travel.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          typeColors[travel.type as keyof typeof typeColors] || 'bg-gray-100'
                        }
                      >
                        {travel.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
