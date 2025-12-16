// components/travel/TravelReports.tsx
'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts'
import {
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Plane,
} from 'lucide-react'

const monthlyTravelData = [
  { month: 'Jan', business: 12, conference: 8, training: 3, totalCost: 18500 },
  { month: 'Feb', business: 10, conference: 6, training: 4, totalCost: 16200 },
  { month: 'Mar', business: 15, conference: 10, training: 2, totalCost: 23400 },
  { month: 'Apr', business: 14, conference: 7, training: 5, totalCost: 19800 },
  { month: 'May', business: 18, conference: 12, training: 6, totalCost: 28700 },
  { month: 'Jun', business: 16, conference: 9, training: 4, totalCost: 24500 },
]

const departmentSpending = [
  { department: 'Sales', cost: 45200, percentage: 32 },
  { department: 'IT', cost: 32800, percentage: 23 },
  { department: 'Marketing', cost: 28900, percentage: 20 },
  { department: 'Executive', cost: 18500, percentage: 13 },
  { department: 'HR', cost: 8600, percentage: 6 },
  { department: 'Finance', cost: 6200, percentage: 4 },
]

const topTravelers = [
  { name: 'John Doe', department: 'Sales', trips: 12, totalCost: 18500, avgCost: 1542 },
  { name: 'Jane Smith', department: 'IT', trips: 8, totalCost: 12400, avgCost: 1550 },
  { name: 'Mike Chen', department: 'Marketing', trips: 10, totalCost: 15600, avgCost: 1560 },
  { name: 'Sarah Johnson', department: 'HR', trips: 6, totalCost: 9800, avgCost: 1633 },
  { name: 'Tom Harris', department: 'Executive', trips: 7, totalCost: 13200, avgCost: 1886 },
]

const destinationData = [
  { destination: 'New York', trips: 18, cost: 28500 },
  { destination: 'London', trips: 12, cost: 19800 },
  { destination: 'Tokyo', trips: 8, cost: 15600 },
  { destination: 'Berlin', trips: 6, cost: 9800 },
  { destination: 'Paris', trips: 5, cost: 8500 },
]

const travelTypeData = [
  { name: 'Business', value: 65, color: '#3b82f6' },
  { name: 'Conference', value: 25, color: '#8b5cf6' },
  { name: 'Training', value: 8, color: '#10b981' },
  { name: 'Other', value: 2, color: '#f59e0b' },
]

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']

export default function TravelReports() {
  const [timeRange, setTimeRange] = useState('6months')
  const [reportType, setReportType] = useState('overview')

  const totalTrips = monthlyTravelData.reduce(
    (sum, month) => sum + month.business + month.conference + month.training,
    0,
  )
  const totalCost = monthlyTravelData.reduce((sum, month) => sum + month.totalCost, 0)
  const avgCostPerTrip = totalCost / totalTrips

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    alert(`Exporting report as ${format.toUpperCase()}...`)
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrips}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span>15% increase from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-1 text-red-500" />
              <span>8% increase from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost per Trip</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgCostPerTrip.toFixed(0)}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingDown className="h-4 w-4 mr-1 text-green-500" />
              <span>3% decrease from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Travelers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Employees traveled this period</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="overview" onValueChange={setReportType} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="destinations">Destinations</TabsTrigger>
          <TabsTrigger value="travelers">Travelers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Travel Volume</CardTitle>
                <CardDescription>Trips by type over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyTravelData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="business" fill="#3b82f6" name="Business Trips" />
                      <Bar dataKey="conference" fill="#8b5cf6" name="Conferences" />
                      <Bar dataKey="training" fill="#10b981" name="Training" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Travel Type Distribution</CardTitle>
                <CardDescription>Breakdown of travel purposes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={travelTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {travelTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Spending Tab */}
        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Spending Analysis</CardTitle>
              <CardDescription>Travel costs by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentSpending}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
                    <Bar dataKey="cost" fill="#3b82f6" name="Total Cost ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Destinations Tab */}
        <TabsContent value="destinations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Destinations</CardTitle>
              <CardDescription>Most traveled destinations by trip count and cost</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {destinationData.map((dest) => (
                  <div key={dest.destination} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Plane className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{dest.destination}</p>
                          <p className="text-sm text-muted-foreground">{dest.trips} trips</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${dest.cost.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          Avg: ${(dest.cost / dest.trips).toFixed(0)} per trip
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(dest.trips / 18) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Travelers Tab */}
        <TabsContent value="travelers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Travelers</CardTitle>
              <CardDescription>Employees with highest travel activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Employee</th>
                      <th className="text-left py-3 px-4 font-medium">Department</th>
                      <th className="text-left py-3 px-4 font-medium">Trips</th>
                      <th className="text-left py-3 px-4 font-medium">Total Cost</th>
                      <th className="text-left py-3 px-4 font-medium">Avg Cost per Trip</th>
                      <th className="text-left py-3 px-4 font-medium">Efficiency Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topTravelers.map((traveler) => (
                      <tr key={traveler.name} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{traveler.name}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{traveler.department}</Badge>
                        </td>
                        <td className="py-3 px-4">{traveler.trips}</td>
                        <td className="py-3 px-4">${traveler.totalCost.toLocaleString()}</td>
                        <td className="py-3 px-4">${traveler.avgCost.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${Math.min(traveler.trips * 10, 100)}%` }}
                              />
                            </div>
                            <span>{Math.min(traveler.trips * 10, 100)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
          <CardDescription>Download detailed travel reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport('excel')}>
              <Download className="h-4 w-4 mr-2" />
              Export as Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Custom Date Range
            </Button>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
