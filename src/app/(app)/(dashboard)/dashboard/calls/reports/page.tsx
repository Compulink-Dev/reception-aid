// app/(app)/(dashboard)/reports/page.tsx
'use client'

import React, { useState } from 'react'
import {
  Download,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Phone,
  MessageSquare,
  Activity,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
// import { DatePicker } from '@/components/ui/date-picker'
import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts'

// Mock data for reports
const monthlyCallData = [
  { month: 'Jan', incoming: 120, outgoing: 98, internal: 45, conference: 22 },
  { month: 'Feb', incoming: 98, outgoing: 110, internal: 38, conference: 18 },
  { month: 'Mar', incoming: 150, outgoing: 120, internal: 52, conference: 30 },
  { month: 'Apr', incoming: 135, outgoing: 105, internal: 48, conference: 25 },
  { month: 'May', incoming: 160, outgoing: 130, internal: 55, conference: 35 },
  { month: 'Jun', incoming: 145, outgoing: 125, internal: 50, conference: 28 },
]

const departmentCallData = [
  { department: 'Sales', calls: 320, minutes: 1450, cost: 145.5 },
  { department: 'IT', calls: 280, minutes: 2100, cost: 210.0 },
  { department: 'Marketing', calls: 195, minutes: 1200, cost: 120.0 },
  { department: 'HR', calls: 150, minutes: 850, cost: 85.0 },
  { department: 'Executive', calls: 120, minutes: 600, cost: 60.0 },
  { department: 'Support', calls: 180, minutes: 1350, cost: 135.0 },
]

const costTrendData = [
  { week: 'Week 1', cost: 85.5 },
  { week: 'Week 2', cost: 92.3 },
  { week: 'Week 3', cost: 78.9 },
  { week: 'Week 4', cost: 105.2 },
  { week: 'Week 5', cost: 88.7 },
  { week: 'Week 6', cost: 115.4 },
]

const topEmployees = [
  { name: 'John Doe', department: 'Sales', calls: 89, minutes: 420, avgDuration: 4.7 },
  { name: 'Jane Smith', department: 'IT', calls: 78, minutes: 650, avgDuration: 8.3 },
  { name: 'Mike Chen', department: 'Marketing', calls: 65, minutes: 320, avgDuration: 4.9 },
  { name: 'Sarah Johnson', department: 'Sales', calls: 56, minutes: 280, avgDuration: 5.0 },
  { name: 'Tom Harris', department: 'Executive', calls: 45, minutes: 220, avgDuration: 4.9 },
]

const callTypeData = [
  { name: 'Incoming', value: 45, color: '#10b981' },
  { name: 'Outgoing', value: 35, color: '#3b82f6' },
  { name: 'Internal', value: 15, color: '#8b5cf6' },
  { name: 'Conference', value: 5, color: '#f59e0b' },
]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [department, setDepartment] = useState('all')
  const [reportType, setReportType] = useState('overview')

  // Calculate summary statistics
  const totalCalls = monthlyCallData.reduce(
    (sum, month) => sum + month.incoming + month.outgoing + month.internal + month.conference,
    0,
  )

  const totalCost = departmentCallData.reduce((sum, dept) => sum + dept.cost, 0)
  const totalMinutes = departmentCallData.reduce((sum, dept) => sum + dept.minutes, 0)
  const avgCallDuration = totalMinutes / totalCalls

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    console.log(`Exporting report as ${format}`)
    // In a real app, this would trigger download
    alert(`Exporting report as ${format.toUpperCase()}...`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive insights and analytics for your phone system
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {/* <DatePicker
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              className="w-[250px]"
            /> */}
          </div>
          <Button onClick={() => handleExport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalls}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span>12% increase from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-1 text-red-500" />
              <span>8% increase from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Call Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCallDuration.toFixed(1)} min</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span>2% increase from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Activity className="h-4 w-4 mr-1 text-blue-500" />
              <span>5 currently on calls</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Reports Content */}
      <Tabs defaultValue="overview" onValueChange={setReportType} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="department">
            <Users className="h-4 w-4 mr-2" />
            Department
          </TabsTrigger>
          <TabsTrigger value="cost">
            <DollarSign className="h-4 w-4 mr-2" />
            Cost Analysis
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Activity className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="types">
            <PieChart className="h-4 w-4 mr-2" />
            Call Types
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Monthly Call Volume</CardTitle>
                <CardDescription>Total calls by type over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyCallData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="incoming" fill="#10b981" name="Incoming" />
                      <Bar dataKey="outgoing" fill="#3b82f6" name="Outgoing" />
                      <Bar dataKey="internal" fill="#8b5cf6" name="Internal" />
                      <Bar dataKey="conference" fill="#f59e0b" name="Conference" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Call Distribution</CardTitle>
                <CardDescription>Breakdown by call type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={callTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {callTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Employees</CardTitle>
                <CardDescription>Based on call volume and duration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topEmployees.map((employee, index) => (
                    <div key={employee.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {employee.department}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{employee.calls} calls</p>
                        <p className="text-sm text-muted-foreground">
                          {employee.minutes} min total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Department Analysis Tab */}
        <TabsContent value="department" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Department Performance</CardTitle>
                  <CardDescription>Calls, duration, and cost by department</CardDescription>
                </div>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentCallData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="calls" fill="#3b82f6" name="Number of Calls" />
                    <Bar yAxisId="right" dataKey="cost" fill="#f59e0b" name="Cost ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cost Analysis Tab */}
        <TabsContent value="cost" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Cost Trends</CardTitle>
                <CardDescription>Cost fluctuations over the past 6 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={costTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="cost"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown by Department</CardTitle>
                <CardDescription>Percentage of total costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentCallData.map((dept) => {
                    const percentage = (dept.cost / totalCost) * 100
                    return (
                      <div key={dept.department} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{dept.department}</span>
                          <span className="text-muted-foreground">
                            ${dept.cost.toFixed(2)} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Performance Metrics</CardTitle>
              <CardDescription>Detailed analysis of individual performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Employee</th>
                      <th className="text-left py-3 px-4 font-medium">Department</th>
                      <th className="text-left py-3 px-4 font-medium">Total Calls</th>
                      <th className="text-left py-3 px-4 font-medium">Total Minutes</th>
                      <th className="text-left py-3 px-4 font-medium">Avg Duration</th>
                      <th className="text-left py-3 px-4 font-medium">Success Rate</th>
                      <th className="text-left py-3 px-4 font-medium">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topEmployees.map((emp) => (
                      <tr key={emp.name} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{emp.name}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{emp.department}</Badge>
                        </td>
                        <td className="py-3 px-4">{emp.calls}</td>
                        <td className="py-3 px-4">{emp.minutes}</td>
                        <td className="py-3 px-4">{emp.avgDuration.toFixed(1)} min</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${Math.min(emp.avgDuration * 15, 100)}%` }}
                              />
                            </div>
                            <span>{Math.min(Math.round(emp.avgDuration * 15), 100)}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          ${(emp.minutes * 0.03 + emp.calls * 0.1).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Call Types Tab */}
        <TabsContent value="types" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Call Type Analysis</CardTitle>
                <CardDescription>Detailed breakdown of different call types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyCallData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="incoming" stackId="a" fill="#10b981" name="Incoming" />
                      <Bar dataKey="outgoing" stackId="a" fill="#3b82f6" name="Outgoing" />
                      <Bar dataKey="internal" stackId="a" fill="#8b5cf6" name="Internal" />
                      <Bar dataKey="conference" stackId="a" fill="#f59e0b" name="Conference" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Type Statistics</CardTitle>
                <CardDescription>Key metrics by call type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {callTypeData.map((type) => (
                    <div key={type.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: type.color }}
                          />
                          <span className="font-medium">{type.name}</span>
                        </div>
                        <span className="text-lg font-bold">{type.value}%</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Avg Duration:</span>
                          <span>4.2 min</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Total Calls:</span>
                          <span>{Math.round((type.value / 100) * totalCalls)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Cost per Call:</span>
                          <span>$0.15</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Call Volume Trends</CardTitle>
              <CardDescription>Historical trends and future projections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      ...monthlyCallData,
                      { month: 'Jul', incoming: 170, outgoing: 140, internal: 60, conference: 40 },
                      { month: 'Aug', incoming: 180, outgoing: 150, internal: 65, conference: 45 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="incoming" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="outgoing" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="internal" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="conference" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
          <CardDescription>Download reports in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport('excel')}>
              <Download className="h-4 w-4 mr-2" />
              Export as Excel
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Custom Report
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Export
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
