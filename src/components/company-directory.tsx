// components/reception/CompanyDirectory.tsx
'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Filter,
  Download,
  Plus,
  Users,
  Building,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  UserPlus,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react'

interface Employee {
  id: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  extension: string
  office: string
  hireDate: string
  status: 'active' | 'on-leave' | 'inactive'
}

interface Department {
  id: string
  name: string
  head: string
  employeeCount: number
  location: string
  phone: string
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '0712345678',
    department: 'Sales',
    position: 'Sales Manager',
    extension: '101',
    office: 'A-101',
    hireDate: '2020-03-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    phone: '0723456789',
    department: 'IT',
    position: 'Senior Developer',
    extension: '205',
    office: 'B-205',
    hireDate: '2019-07-22',
    status: 'active',
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    phone: '0734567890',
    department: 'Marketing',
    position: 'Marketing Director',
    extension: '310',
    office: 'C-310',
    hireDate: '2021-01-10',
    status: 'active',
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    phone: '0745678901',
    department: 'HR',
    position: 'HR Manager',
    extension: '415',
    office: 'D-415',
    hireDate: '2018-11-30',
    status: 'on-leave',
  },
  {
    id: '5',
    name: 'Tom Harris',
    email: 'tom.harris@company.com',
    phone: '0756789012',
    department: 'Executive',
    position: 'CEO',
    extension: '501',
    office: 'E-501',
    hireDate: '2015-06-01',
    status: 'active',
  },
]

const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Sales',
    head: 'John Doe',
    employeeCount: 12,
    location: 'Floor 1',
    phone: 'x100',
  },
  { id: '2', name: 'IT', head: 'Jane Smith', employeeCount: 8, location: 'Floor 2', phone: 'x200' },
  {
    id: '3',
    name: 'Marketing',
    head: 'Mike Chen',
    employeeCount: 6,
    location: 'Floor 1',
    phone: 'x300',
  },
  {
    id: '4',
    name: 'HR',
    head: 'Sarah Johnson',
    employeeCount: 4,
    location: 'Floor 3',
    phone: 'x400',
  },
  {
    id: '5',
    name: 'Executive',
    head: 'Tom Harris',
    employeeCount: 3,
    location: 'Floor 5',
    phone: 'x500',
  },
  {
    id: '6',
    name: 'Finance',
    head: 'Robert Kim',
    employeeCount: 5,
    location: 'Floor 2',
    phone: 'x600',
  },
]

export default function CompanyDirectory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [showAddDepartment, setShowAddDepartment] = useState(false)

  const filteredEmployees = mockEmployees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter

    return matchesSearch && matchesDepartment && matchesStatus
  })

  const filteredDepartments = mockDepartments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    totalEmployees: mockEmployees.length,
    activeEmployees: mockEmployees.filter((e) => e.status === 'active').length,
    departments: mockDepartments.length,
    onLeave: mockEmployees.filter((e) => e.status === 'on-leave').length,
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      'on-leave': 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-red-100 text-red-800',
    }
    return (
      <Badge className={colors[status as keyof typeof colors]}>{status.replace('-', ' ')}</Badge>
    )
  }

  const exportEmployees = () => {
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Department',
      'Position',
      'Extension',
      'Office',
      'Hire Date',
      'Status',
    ]
    const csvData = filteredEmployees.map((e) => [
      e.name,
      e.email,
      e.phone,
      e.department,
      e.position,
      e.extension,
      e.office,
      e.hireDate,
      e.status,
    ])

    const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'employees.csv'
    a.click()
  }

  const exportDepartments = () => {
    const headers = ['Department', 'Head', 'Employee Count', 'Location', 'Phone']
    const csvData = filteredDepartments.map((d) => [
      d.name,
      d.head,
      d.employeeCount,
      d.location,
      d.phone,
    ])

    const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'departments.csv'
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Company workforce</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeEmployees}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.departments}</div>
            <p className="text-xs text-muted-foreground">Functional units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onLeave}</div>
            <p className="text-xs text-muted-foreground">Currently unavailable</p>
          </CardContent>
        </Card>
      </div>

      {/* Directory Tabs */}
      <Tabs defaultValue="employees" className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="employees">
              <Users className="h-4 w-4 mr-2" />
              Employees
            </TabsTrigger>
            <TabsTrigger value="departments">
              <Building className="h-4 w-4 mr-2" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="org-chart">
              <Briefcase className="h-4 w-4 mr-2" />
              Org Chart
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Employees Tab */}
        <TabsContent value="employees" className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>Add a new employee to the company directory</DialogDescription>
                </DialogHeader>
                <EmployeeForm onCancel={() => setShowAddEmployee(false)} />
              </DialogContent>
            </Dialog>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={exportEmployees}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Office</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Ext: {employee.extension}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{employee.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{employee.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{employee.department}</Badge>
                        </TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span>{employee.office}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(employee.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Dialog open={showAddDepartment} onOpenChange={setShowAddDepartment}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Department</DialogTitle>
                  <DialogDescription>Create a new department in the organization</DialogDescription>
                </DialogHeader>
                <DepartmentForm onCancel={() => setShowAddDepartment(false)} />
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={exportDepartments}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepartments.map((dept) => (
              <Card key={dept.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{dept.name}</span>
                    <Badge variant="outline">{dept.employeeCount} people</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Head: {dept.head}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Location: {dept.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Extension: {dept.phone}</span>
                    </div>
                    <div className="pt-3">
                      <Button size="sm" variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Org Chart Tab */}
        <TabsContent value="org-chart">
          <Card>
            <CardHeader>
              <CardTitle>Organization Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-8">
                <div className="text-center mb-8">
                  <div className="inline-block p-4 border-2 border-primary rounded-lg">
                    <p className="font-bold">Tom Harris</p>
                    <p className="text-sm text-muted-foreground">CEO</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  {['Sales', 'IT', 'Marketing'].map((dept) => (
                    <div key={dept} className="text-center">
                      <div className="inline-block p-3 border rounded-lg">
                        <p className="font-medium">{dept} Department</p>
                        <p className="text-sm text-muted-foreground">
                          Head: {mockDepartments.find((d) => d.name === dept)?.head}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {['HR', 'Finance', 'Operations'].map((dept) => (
                    <div key={dept} className="text-center">
                      <div className="inline-block p-3 border rounded-lg">
                        <p className="font-medium">{dept} Department</p>
                        <p className="text-sm text-muted-foreground">
                          Head: {mockDepartments.find((d) => d.name === dept)?.head || 'TBD'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmployeeForm({ onCancel }: { onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    extension: '',
    office: '',
    hireDate: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Employee added successfully!')
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Full Name *</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email *</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@company.com"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Phone Number</label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="0712345678"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Department *</label>
          <Select
            value={formData.department}
            onValueChange={(value) => setFormData({ ...formData, department: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Executive">Executive</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Position *</label>
          <Input
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            placeholder="Software Developer"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Extension</label>
          <Input
            value={formData.extension}
            onChange={(e) => setFormData({ ...formData, extension: e.target.value })}
            placeholder="101"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Office</label>
          <Input
            value={formData.office}
            onChange={(e) => setFormData({ ...formData, office: e.target.value })}
            placeholder="A-101"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Hire Date</label>
          <Input
            type="date"
            value={formData.hireDate}
            onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
          />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          Add Employee
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

function DepartmentForm({ onCancel }: { onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    head: '',
    location: '',
    phone: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Department added successfully!')
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Department Name *</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Marketing"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Department Head</label>
        <Input
          value={formData.head}
          onChange={(e) => setFormData({ ...formData, head: e.target.value })}
          placeholder="Jane Smith"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Location</label>
        <Input
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Floor 3, Building A"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Phone Extension</label>
        <Input
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="x300"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          Add Department
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
