// app/(app)/(dashboard)/layout.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  Car as CarIcon,
  Package,
  PhoneCall,
  Calendar,
  Shield,
  Building,
  Settings,
  User,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Home,
  UserCheck,
  HelpCircle,
} from 'lucide-react'

interface UserData {
  name: string
  email: string
  role: string
  department?: string
}

interface NavigationItem {
  title: string
  href: string
  icon: React.ReactNode
  active: boolean
  submenu?: Array<{
    title: string
    href: string
  }>
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [_, setNotifications] = useState(3) // Keep for future use

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')

      if (!token || !userData) {
        router.push('/signin')
        return
      }

      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)

        // Verify token is still valid
        const response = await fetch('/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.push('/signin')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/signin')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/signin')
  }

  // Navigation items based on user role
  const getNavigationItems = (): NavigationItem[] => {
    const baseItems: NavigationItem[] = [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
        active: pathname === '/dashboard',
      },
    ]

    if (user?.role === 'reception' || user?.role === 'admin') {
      baseItems.push(
        {
          title: 'Parcels',
          href: '/dashboard/parcels',
          icon: <Package className="h-5 w-5" />,
          active: pathname.startsWith('/dashboard/parcels'),
          submenu: [
            // { title: 'Log Parcel', href: '/dashboard/parcels/' },
            { title: 'Delivery Logs', href: '/dashboard/parcels/deliveries' },
            { title: 'Parcel Tracking', href: '/dashboard/parcels/tracking' },
          ],
        },
        {
          title: 'Visitors',
          href: '/dashboard/visitors',
          icon: <Users className="h-5 w-5" />,
          active: pathname.startsWith('/dashboard/visitors'),
          submenu: [
            // { title: 'Check-in Visitors', href: '/dashboard/visitors' },
            { title: 'Visitor Logs', href: '/dashboard/visitors/logs' },
            { title: 'Appointments', href: '/dashboard/visitors/appointments' },
          ],
        },
        {
          title: 'Phone Calls',
          href: '/dashboard/calls',
          icon: <PhoneCall className="h-5 w-5" />,
          active: pathname.startsWith('/dashboard/calls'),
          submenu: [
            // { title: 'Log Call', href: '/dashboard/calls/' },
            { title: 'Call History', href: '/dashboard/calls/history' },
            { title: 'Call Reports', href: '/dashboard/calls/reports' },
          ],
        },
        {
          title: 'Travel Logs',
          href: '/dashboard/travel',
          icon: <Calendar className="h-5 w-5" />,
          active: pathname.startsWith('/dashboard/travel'),
          submenu: [
            // { title: 'Active Travel', href: '/dashboard/travel' },
            { title: 'Log Departure', href: '/dashboard/travel/log' },
            { title: 'Travel History', href: '/dashboard/travel/history' },
          ],
        },
      )
    }

    if (user?.role === 'security' || user?.role === 'admin') {
      baseItems.push(
        {
          title: 'Security Gate',
          href: '/dashboard/security',
          icon: <Shield className="h-5 w-5" />,
          active: pathname.startsWith('/dashboard/security'),
          submenu: [
            // { title: 'Vehicle Check-in', href: '/dashboard/security' },
            { title: 'Parked Vehicles', href: '/dashboard/security/vehicles' },
            { title: 'Mileage Tracker', href: '/dashboard/security/mileage' },
            { title: 'Gate Logs', href: '/dashboard/security/logs' },
          ],
        },
        {
          title: 'Vehicle Management',
          href: '/dashboard/vehicles',
          icon: <CarIcon className="h-5 w-5" />,
          active: pathname.startsWith('/dashboard/vehicles'),
          submenu: [
            // { title: 'All Vehicles', href: '/dashboard/vehicles' },
            { title: 'Company Fleet', href: '/dashboard/vehicles/company' },
            { title: 'Visitor Vehicles', href: '/dashboard/vehicles/visitors' },
          ],
        },
      )
    }

    if (user?.role === 'admin') {
      baseItems.push(
        {
          title: 'Clients',
          href: '/dashboard/clients',
          icon: <UserCheck className="h-5 w-5" />,
          active: pathname.startsWith('/dashboard/clients'),
        },
        {
          title: 'Employees',
          href: '/dashboard/employees',
          icon: <Users className="h-5 w-5" />,
          active: pathname.startsWith('/dashboard/employees'),
        },
        {
          title: 'Reports',
          href: '/dashboard/reports',
          icon: <BarChart3 className="h-5 w-5" />,
          active: pathname.startsWith('/dashboard/reports'),
          submenu: [
            { title: 'Daily Reports', href: '/dashboard/reports/daily' },
            { title: 'Monthly Analytics', href: '/dashboard/reports/monthly' },
            { title: 'Visitor Statistics', href: '/dashboard/reports/visitors' },
            { title: 'Vehicle Reports', href: '/dashboard/reports/vehicles' },
          ],
        },
        {
          title: 'Settings',
          href: '/dashboard/settings',
          icon: <Settings className="h-5 w-5" />,
          active: pathname.startsWith('/dashboard/settings'),
          submenu: [
            { title: 'General Settings', href: '/dashboard/settings/general' },
            { title: 'User Permissions', href: '/dashboard/settings/permissions' },
            { title: 'Notification Settings', href: '/dashboard/settings/notifications' },
            { title: 'Backup & Restore', href: '/dashboard/settings/backup' },
          ],
        },
      )
    }

    // Common items for all roles
    baseItems.push({
      title: 'Help',
      href: '/dashboard/help',
      icon: <HelpCircle className="h-5 w-5" />,
      active: pathname.startsWith('/dashboard/help'),
    })

    return baseItems
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 right-0 left-0 h-16 bg-white border-b border-gray-200 z-30 lg:left-64 transition-all duration-300">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left side - Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-6 w-6" />
              ) : (
                <ChevronRight className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Center - Breadcrumb */}
          <div className="hidden md:flex items-center space-x-2">
            <Home className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400">/</span>
            {pathname.split('/').map((segment, index) => {
              if (!segment) return null
              const href =
                '/' +
                pathname
                  .split('/')
                  .slice(0, index + 1)
                  .join('/')
              const isLast = index === pathname.split('/').length - 1

              return (
                <React.Fragment key={segment}>
                  <Link
                    href={href}
                    className={`text-sm capitalize ${isLast ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {segment.replace('-', ' ')}
                  </Link>
                  {!isLast && <span className="text-gray-400">/</span>}
                </React.Fragment>
              )
            })}
          </div>

          {/* Right side - User info and notifications */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User dropdown */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <div className="relative group">
                <div className="h-10 w-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                {/* Dropdown menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
                    >
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded hover:bg-red-50 text-red-600 mt-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-40
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'}
        lg:translate-x-0 lg:w-64
      `}
      >
        {/* Logo */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center justify-center space-x-2">
            <Building className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                R<span className="text-blue-600">A</span>
              </h1>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="h-[calc(100vh-4rem)] overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {navigationItems.map((item, index) => (
              <div key={index} className="text-sm">
                <Link
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                    ${
                      item.active
                        ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <div className={`${item.active ? 'text-blue-600' : 'text-gray-500'}`}>
                    {item.icon}
                  </div>
                  <span className="flex-1">{item.title}</span>
                  {item.submenu && (
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${item.active ? 'rotate-90' : ''}`}
                    />
                  )}
                </Link>

                {/* Submenu */}
                {item.submenu && item.active && (
                  <div className="ml-10 mt-1 space-y-1">
                    {item.submenu.map((subitem, subindex) => (
                      <Link
                        key={subindex}
                        href={subitem.href}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                      >
                        {subitem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Quick Stats */}
          <div className="mt-8 mx-3">
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Visitors Today</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Parked Vehicles</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending Parcels</span>
                  <span className="font-medium">5</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="mt-6 mx-3">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">System Status</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Database</span>
                    <span className="text-green-600 font-medium">Online</span>
                  </div>
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: '95%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">API Services</span>
                    <span className="text-green-600 font-medium">Online</span>
                  </div>
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: '98%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Storage</span>
                    <span className="text-blue-600 font-medium">64%</span>
                  </div>
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '64%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`
        pt-16 transition-all duration-300 min-h-screen
        ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}
      `}
      >
        <div className="p-4 md:p-6">{children}</div>

        {/* Mobile sidebar toggle button */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed bottom-4 left-4 lg:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-40"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </main>
    </div>
  )
}
