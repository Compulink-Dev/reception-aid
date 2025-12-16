// components/reception/ClientManagement.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
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
  Globe,
  TrendingUp,
  Star,
  Calendar,
  MessageSquare,
  FileText,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  PhoneCall,
  Mail as MailIcon,
} from 'lucide-react'
import { format } from 'date-fns'

interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  mobile: string
  address: string
  city: string
  country: string
  website: string
  clientType: 'corporate' | 'individual' | 'government' | 'non-profit'
  industry: string
  status: 'active' | 'inactive' | 'prospect' | 'former'
  priority: 'high' | 'medium' | 'low'
  accountManager: string
  totalValue: number
  lastContact: string
  nextContact: string
  notes: string
  tags: string[]
}

interface Interaction {
  id: string
  clientId: string
  clientName: string
  type: 'call' | 'email' | 'meeting' | 'proposal' | 'contract'
  date: string
  description: string
  outcome: 'positive' | 'neutral' | 'negative'
  assignedTo: string
  followUpDate: string
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'TechCorp Solutions',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    mobile: '+1 (555) 987-6543',
    address: '123 Business Ave',
    city: 'San Francisco',
    country: 'USA',
    website: 'https://techcorp.com',
    clientType: 'corporate',
    industry: 'Technology',
    status: 'active',
    priority: 'high',
    accountManager: 'Jane Doe',
    totalValue: 125000,
    lastContact: '2024-01-15',
    nextContact: '2024-02-10',
    notes: 'Major client - VIP treatment required',
    tags: ['VIP', 'Technology', 'Enterprise'],
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Green Energy Inc',
    email: 'sarah@greenenergy.com',
    phone: '+1 (555) 234-5678',
    mobile: '+1 (555) 876-5432',
    address: '456 Eco Street',
    city: 'Portland',
    country: 'USA',
    website: 'https://greenenergy.com',
    clientType: 'corporate',
    industry: 'Renewable Energy',
    status: 'active',
    priority: 'medium',
    accountManager: 'Mike Chen',
    totalValue: 85000,
    lastContact: '2024-01-18',
    nextContact: '2024-01-30',
    notes: 'Interested in solar solutions',
    tags: ['Energy', 'Sustainability'],
  },
  {
    id: '3',
    name: 'Robert Kim',
    company: 'Global Logistics Ltd',
    email: 'rkim@globallogistics.com',
    phone: '+44 20 1234 5678',
    mobile: '+44 77 1234 5678',
    address: '789 Shipping Lane',
    city: 'London',
    country: 'UK',
    website: 'https://globallogistics.com',
    clientType: 'corporate',
    industry: 'Logistics',
    status: 'active',
    priority: 'high',
    accountManager: 'Tom Harris',
    totalValue: 210000,
    lastContact: '2024-01-20',
    nextContact: '2024-02-05',
    notes: 'Expanding to Asian markets',
    tags: ['Logistics', 'International', 'VIP'],
  },
  {
    id: '4',
    name: 'Maria Garcia',
    company: 'Creative Agency',
    email: 'maria@creativeagency.com',
    phone: '+34 91 123 4567',
    mobile: '+34 600 123 456',
    address: '101 Design Street',
    city: 'Madrid',
    country: 'Spain',
    website: 'https://creativeagency.com',
    clientType: 'corporate',
    industry: 'Marketing',
    status: 'prospect',
    priority: 'medium',
    accountManager: 'Sarah Wilson',
    totalValue: 45000,
    lastContact: '2024-01-10',
    nextContact: '2024-01-25',
    notes: 'Potential new client for branding services',
    tags: ['Prospect', 'Marketing'],
  },
  {
    id: '5',
    name: 'David Miller',
    company: 'Miller & Associates',
    email: 'david@millerlaw.com',
    phone: '+1 (555) 345-6789',
    mobile: '+1 (555) 765-4321',
    address: '222 Legal Blvd',
    city: 'New York',
    country: 'USA',
    website: 'https://millerlaw.com',
    clientType: 'individual',
    industry: 'Legal Services',
    status: 'inactive',
    priority: 'low',
    accountManager: 'John Doe',
    totalValue: 25000,
    lastContact: '2023-12-15',
    nextContact: '',
    notes: 'Contract ended in December',
    tags: ['Legal', 'Inactive'],
  },
]

const mockInteractions: Interaction[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'TechCorp Solutions',
    type: 'meeting',
    date: '2024-01-15T14:30:00',
    description: 'Quarterly business review meeting',
    outcome: 'positive',
    assignedTo: 'Jane Doe',
    followUpDate: '2024-01-22',
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'Green Energy Inc',
    type: 'call',
    date: '2024-01-18T10:00:00',
    description: 'Follow-up call regarding solar proposal',
    outcome: 'neutral',
    assignedTo: 'Mike Chen',
    followUpDate: '2024-01-30',
  },
  {
    id: '3',
    clientId: '3',
    clientName: 'Global Logistics Ltd',
    type: 'proposal',
    date: '2024-01-20T09:15:00',
    description: 'Submitted expansion proposal for Asia',
    outcome: 'positive',
    assignedTo: 'Tom Harris',
    followUpDate: '2024-02-05',
  },
]

const industryOptions = [
  'Technology',
  'Finance',
  'Healthcare',
  'Manufacturing',
  'Retail',
  'Education',
  'Energy',
  'Logistics',
  'Marketing',
  'Legal Services',
  'Consulting',
  'Real Estate',
  'Hospitality',
  'Construction',
  'Other',
]

const clientTypeOptions = [
  { value: 'corporate', label: 'Corporate' },
  { value: 'individual', label: 'Individual' },
  { value: 'government', label: 'Government' },
  { value: 'non-profit', label: 'Non-Profit' },
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'former', label: 'Former Client' },
]

const priorityOptions = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [interactions, setInteractions] = useState<Interaction[]>(mockInteractions)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [showAddClient, setShowAddClient] = useState(false)
  const [showAddInteraction, setShowAddInteraction] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list')
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    company: '',
    email: '',
    phone: '',
    clientType: 'corporate',
    status: 'prospect',
    priority: 'medium',
  })

  useEffect(() => {
    // In a real app, fetch from API
    // fetchClients()
  }, [])

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.industry.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || client.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || client.priority === priorityFilter
    const matchesIndustry = industryFilter === 'all' || client.industry === industryFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesIndustry
  })

  const stats = {
    total: clients.length,
    active: clients.filter((c) => c.status === 'active').length,
    prospects: clients.filter((c) => c.status === 'prospect').length,
    highPriority: clients.filter((c) => c.priority === 'high').length,
    totalValue: clients.reduce((sum, client) => sum + client.totalValue, 0),
    pendingFollowups: interactions.filter((i) => new Date(i.followUpDate) > new Date()).length,
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      prospect: 'bg-blue-100 text-blue-800',
      former: 'bg-red-100 text-red-800',
    }
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    }
    return (
      <Badge className={colors[priority as keyof typeof colors]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </Badge>
    )
  }

  const getClientTypeBadge = (type: string) => {
    const colors = {
      corporate: 'bg-purple-100 text-purple-800',
      individual: 'bg-indigo-100 text-indigo-800',
      government: 'bg-orange-100 text-orange-800',
      'non-profit': 'bg-pink-100 text-pink-800',
    }
    return (
      <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100'}>
        {clientTypeOptions.find((opt) => opt.value === type)?.label || type}
      </Badge>
    )
  }

  const getOutcomeBadge = (outcome: string) => {
    const colors = {
      positive: 'bg-green-100 text-green-800',
      neutral: 'bg-yellow-100 text-yellow-800',
      negative: 'bg-red-100 text-red-800',
    }
    return (
      <Badge className={colors[outcome as keyof typeof colors]}>
        {outcome.charAt(0).toUpperCase() + outcome.slice(1)}
      </Badge>
    )
  }

  const getInteractionIcon = (type: string) => {
    const icons = {
      call: PhoneCall,
      email: MailIcon,
      meeting: Users,
      proposal: FileText,
      contract: FileText,
    }
    const Icon = icons[type as keyof typeof icons] || MessageSquare
    return <Icon className="h-4 w-4" />
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    const newClient: Client = {
      id: Date.now().toString(),
      name: formData.name || '',
      company: formData.company || '',
      email: formData.email || '',
      phone: formData.phone || '',
      mobile: '',
      address: '',
      city: '',
      country: '',
      website: '',
      clientType: formData.clientType || 'corporate',
      industry: '',
      status: formData.status || 'prospect',
      priority: formData.priority || 'medium',
      accountManager: '',
      totalValue: 0,
      lastContact: '',
      nextContact: '',
      notes: '',
      tags: [],
    }

    setClients([...clients, newClient])
    setShowAddClient(false)
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      clientType: 'corporate',
      status: 'prospect',
      priority: 'medium',
    })
    alert('Client added successfully!')
  }

  const handleAddInteraction = async (e: React.FormEvent) => {
    e.preventDefault()
    // Implementation for adding interaction
    setShowAddInteraction(false)
    alert('Interaction logged successfully!')
  }

  const handleDeleteClient = (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter((client) => client.id !== id))
      alert('Client deleted successfully!')
    }
  }

  const exportClients = () => {
    const headers = [
      'Name',
      'Company',
      'Email',
      'Phone',
      'Type',
      'Industry',
      'Status',
      'Priority',
      'Account Manager',
      'Total Value',
      'Last Contact',
      'Next Contact',
    ]
    const csvData = filteredClients.map((client) => [
      client.name,
      client.company,
      client.email,
      client.phone,
      client.clientType,
      client.industry,
      client.status,
      client.priority,
      client.accountManager,
      `$${client.totalValue.toLocaleString()}`,
      client.lastContact,
      client.nextContact,
    ])

    const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'clients.csv'
    a.click()
  }

  const upcomingFollowups = interactions
    .filter((i) => new Date(i.followUpDate) >= new Date())
    .sort((a, b) => new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{stats.active} active clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">{stats.prospects} prospects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From active clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Follow-ups</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingFollowups}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>Enter client details to add to the system</DialogDescription>
              </DialogHeader>
              <ClientForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleAddClient}
                onCancel={() => setShowAddClient(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={showAddInteraction} onOpenChange={setShowAddInteraction}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Log Interaction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Log Client Interaction</DialogTitle>
                <DialogDescription>
                  Record a call, meeting, or other client interaction
                </DialogDescription>
              </DialogHeader>
              <InteractionForm
                clients={clients}
                onSubmit={handleAddInteraction}
                onCancel={() => setShowAddInteraction(false)}
              />
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={exportClients}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search clients..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="former">Former</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client List/Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Client Directory</CardTitle>
                  <CardDescription>{filteredClients.length} clients found</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    List
                  </Button>
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                  >
                    Cards
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'list' ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{client.name}</p>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Building className="h-3 w-3" />
                                <span>{client.company}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Globe className="h-3 w-3" />
                                <span>{client.industry}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <span className="text-sm">{client.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span className="text-sm">{client.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getClientTypeBadge(client.clientType)}</TableCell>
                          <TableCell>{getStatusBadge(client.status)}</TableCell>
                          <TableCell>{getPriorityBadge(client.priority)}</TableCell>
                          <TableCell className="font-bold">
                            ${client.totalValue.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteClient(client.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredClients.map((client) => (
                    <Card key={client.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{client.name}</CardTitle>
                            <CardDescription>{client.company}</CardDescription>
                          </div>
                          <div className="flex gap-1">
                            {getStatusBadge(client.status)}
                            {getPriorityBadge(client.priority)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm truncate">{client.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{client.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{client.industry}</span>
                          </div>
                          <div className="pt-2">
                            <div className="text-sm font-semibold">
                              ${client.totalValue.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">Total value</p>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              View
                            </Button>
                            <Button size="sm" className="flex-1">
                              Contact
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Follow-ups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Follow-ups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingFollowups.map((interaction) => (
                  <div key={interaction.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-blue-100 rounded">
                          {getInteractionIcon(interaction.type)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{interaction.clientName}</p>
                          <p className="text-xs text-muted-foreground">{interaction.type}</p>
                        </div>
                      </div>
                      {getOutcomeBadge(interaction.outcome)}
                    </div>
                    <p className="text-sm mt-2 truncate">{interaction.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(interaction.followUpDate), 'MMM d')}
                      </span>
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Interactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {interactions.slice(0, 3).map((interaction) => (
                  <div key={interaction.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1 rounded ${
                          interaction.outcome === 'positive'
                            ? 'bg-green-100'
                            : interaction.outcome === 'negative'
                              ? 'bg-red-100'
                              : 'bg-yellow-100'
                        }`}
                      >
                        {getInteractionIcon(interaction.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{interaction.clientName}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(interaction.date), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{interaction.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Client Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Client Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Active Clients</span>
                    <span className="font-medium">{stats.active}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(stats.active / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Prospects</span>
                    <span className="font-medium">{stats.prospects}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(stats.prospects / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>High Priority</span>
                    <span className="font-medium">{stats.highPriority}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(stats.highPriority / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* High Value Clients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            High Value Clients
          </CardTitle>
          <CardDescription>Top clients by total contract value</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clients
              .filter((c) => c.priority === 'high')
              .sort((a, b) => b.totalValue - a.totalValue)
              .slice(0, 3)
              .map((client) => (
                <div key={client.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-lg">{client.company}</p>
                      <p className="text-sm text-muted-foreground">{client.name}</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">VIP</Badge>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold">${client.totalValue.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">Total contract value</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm truncate">{client.email}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ClientForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
}: {
  formData: Partial<Client>
  setFormData: (data: Partial<Client>) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Contact Name *</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Smith"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Company Name *</label>
          <Input
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="TechCorp Solutions"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email Address *</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@company.com"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Phone Number *</label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Client Type *</label>
          <Select
            value={formData.clientType}
            onValueChange={(value) => setFormData({ ...formData, clientType: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {clientTypeOptions.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Status *</label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Priority *</label>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Industry</label>
          <Select
            value={formData.industry}
            onValueChange={(value) => setFormData({ ...formData, industry: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industryOptions.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Client</Button>
      </DialogFooter>
    </form>
  )
}

function InteractionForm({
  clients,
  onSubmit,
  onCancel,
}: {
  clients: Client[]
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    clientId: '',
    type: 'call',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(':').slice(0, 2).join(':'),
    description: '',
    outcome: 'neutral',
    assignedTo: '',
    followUpDate: '',
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Client *</label>
          <Select
            value={formData.clientId}
            onValueChange={(value) => setFormData({ ...formData, clientId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.company} - {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Interaction Type *</label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">Phone Call</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="proposal">Proposal Sent</SelectItem>
              <SelectItem value="contract">Contract Signed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Date *</label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Time *</label>
          <Input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Outcome</label>
          <Select
            value={formData.outcome}
            onValueChange={(value) => setFormData({ ...formData, outcome: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select outcome" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Follow-up Date</label>
          <Input
            type="date"
            value={formData.followUpDate}
            onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Description *</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the interaction..."
            required
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Log Interaction</Button>
      </DialogFooter>
    </form>
  )
}
