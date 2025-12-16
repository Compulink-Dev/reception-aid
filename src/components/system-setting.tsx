// components/settings/SystemSettings.tsx
'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Settings,
  Bell,
  Globe,
  Database,
  Mail,
  Shield,
  Users,
  Clock,
  Palette,
  Upload,
  Download,
  Save,
  Eye,
  EyeOff,
  Key,
} from 'lucide-react'

interface SystemSettings {
  // General Settings
  siteName: string
  siteUrl: string
  timezone: string
  language: string
  dateFormat: string
  timeFormat: string

  // Email Settings
  smtpHost: string
  smtpPort: string
  smtpUsername: string
  smtpPassword: string
  emailFrom: string
  emailFromName: string

  // Security Settings
  loginAttempts: number
  sessionTimeout: number
  passwordMinLength: number
  require2FA: boolean
  enableCaptcha: boolean

  // Notification Settings
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  notifyNewUsers: boolean
  notifySystemAlerts: boolean

  // Appearance Settings
  theme: 'light' | 'dark' | 'auto'
  primaryColor: string
  logoUrl: string
  faviconUrl: string
}

const initialSettings: SystemSettings = {
  // General Settings
  siteName: 'Company Portal',
  siteUrl: 'https://portal.company.com',
  timezone: 'America/New_York',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',

  // Email Settings
  smtpHost: 'smtp.gmail.com',
  smtpPort: '587',
  smtpUsername: 'noreply@company.com',
  smtpPassword: '',
  emailFrom: 'noreply@company.com',
  emailFromName: 'Company Portal',

  // Security Settings
  loginAttempts: 5,
  sessionTimeout: 30,
  passwordMinLength: 8,
  require2FA: false,
  enableCaptcha: true,

  // Notification Settings
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  notifyNewUsers: true,
  notifySystemAlerts: true,

  // Appearance Settings
  theme: 'light',
  primaryColor: '#3b82f6',
  logoUrl: '/logo.png',
  faviconUrl: '/favicon.ico',
}

const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney',
]

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
]

const dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'MMMM D, YYYY']

const timeFormats = ['12h', '24h']

export default function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>(initialSettings)
  const [activeTab, setActiveTab] = useState('general')
  const [showSmtpPassword, setShowSmtpPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      alert('Settings saved successfully!')
      setIsSaving(false)
    }, 1000)
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings(initialSettings)
      alert('Settings reset to default!')
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = 'system-settings.json'

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedSettings = JSON.parse(content)
        setSettings(importedSettings)
        alert('Settings imported successfully!')
      } catch (error) {
        alert('Error importing settings. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset to Default
        </Button>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Settings
        </Button>
        <Button variant="outline" asChild>
          <Label htmlFor="import-settings" className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Import Settings
            <Input
              id="import-settings"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </Label>
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={settings.siteUrl}
                    onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => setSettings({ ...settings, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={settings.dateFormat}
                    onValueChange={(value) => setSettings({ ...settings, dateFormat: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dateFormats.map((format) => (
                        <SelectItem key={format} value={format}>
                          {format}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select
                    value={settings.timeFormat}
                    onValueChange={(value) => setSettings({ ...settings, timeFormat: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeFormats.map((format) => (
                        <SelectItem key={format} value={format}>
                          {format}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings Tab */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Configure SMTP settings for sending emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                    placeholder="587"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={settings.smtpUsername}
                    onChange={(e) => setSettings({ ...settings, smtpUsername: e.target.value })}
                    placeholder="username@domain.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <div className="relative">
                    <Input
                      id="smtpPassword"
                      type={showSmtpPassword ? 'text' : 'password'}
                      value={settings.smtpPassword}
                      onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                      placeholder="Your SMTP password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                    >
                      {showSmtpPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="emailFrom">From Email</Label>
                  <Input
                    id="emailFrom"
                    value={settings.emailFrom}
                    onChange={(e) => setSettings({ ...settings, emailFrom: e.target.value })}
                    placeholder="noreply@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="emailFromName">From Name</Label>
                  <Input
                    id="emailFromName"
                    value={settings.emailFromName}
                    onChange={(e) => setSettings({ ...settings, emailFromName: e.target.value })}
                    placeholder="Company Portal"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => alert('Test email sent!')}>
                Send Test Email
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security preferences and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="loginAttempts">Maximum Login Attempts</Label>
                    <p className="text-sm text-muted-foreground">
                      Number of failed login attempts before account lockout
                    </p>
                  </div>
                  <Input
                    id="loginAttempts"
                    type="number"
                    className="w-20"
                    value={settings.loginAttempts}
                    onChange={(e) =>
                      setSettings({ ...settings, loginAttempts: parseInt(e.target.value) })
                    }
                    min="1"
                    max="10"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <p className="text-sm text-muted-foreground">
                      Time before automatic logout due to inactivity
                    </p>
                  </div>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    className="w-20"
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })
                    }
                    min="5"
                    max="480"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimum number of characters required for passwords
                    </p>
                  </div>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    className="w-20"
                    value={settings.passwordMinLength}
                    onChange={(e) =>
                      setSettings({ ...settings, passwordMinLength: parseInt(e.target.value) })
                    }
                    min="6"
                    max="32"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="require2FA">Require Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Force all users to enable 2FA for their accounts
                    </p>
                  </div>
                  <Switch
                    id="require2FA"
                    checked={settings.require2FA}
                    onCheckedChange={(checked) => setSettings({ ...settings, require2FA: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableCaptcha">Enable CAPTCHA on Login</Label>
                    <p className="text-sm text-muted-foreground">
                      Show CAPTCHA challenge on login page to prevent bots
                    </p>
                  </div>
                  <Switch
                    id="enableCaptcha"
                    checked={settings.enableCaptcha}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, enableCaptcha: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when to send notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, emailNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send browser push notifications</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, pushNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via SMS (requires SMS gateway)
                    </p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, smsNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Notification Events</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifyNewUsers">New User Registration</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify admins when new users register
                      </p>
                    </div>
                    <Switch
                      id="notifyNewUsers"
                      checked={settings.notifyNewUsers}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, notifyNewUsers: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifySystemAlerts">System Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify admins of system errors and warnings
                      </p>
                    </div>
                    <Switch
                      id="notifySystemAlerts"
                      checked={settings.notifySystemAlerts}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, notifySystemAlerts: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value: 'light' | 'dark' | 'auto') =>
                      setSettings({ ...settings, theme: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="primaryColor"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      placeholder="#3b82f6"
                    />
                    <div
                      className="h-10 w-10 rounded border"
                      style={{ backgroundColor: settings.primaryColor }}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={settings.logoUrl}
                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                    placeholder="/logo.png"
                  />
                </div>

                <div>
                  <Label htmlFor="faviconUrl">Favicon URL</Label>
                  <Input
                    id="faviconUrl"
                    value={settings.faviconUrl}
                    onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                    placeholder="/favicon.ico"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Custom CSS/JS */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Styling</CardTitle>
                <CardDescription>
                  Add custom CSS or JavaScript for advanced customization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customCSS">Custom CSS</Label>
                  <Textarea
                    id="customCSS"
                    placeholder="/* Add your custom CSS here */"
                    className="min-h-[150px] font-mono text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="customJS">Custom JavaScript</Label>
                  <Textarea
                    id="customJS"
                    placeholder="// Add your custom JavaScript here"
                    className="min-h-[150px] font-mono text-sm"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => alert('Preview updated!')}>
                  Preview Changes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Advanced Settings
          </CardTitle>
          <CardDescription>Danger zone - be careful with these settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <p className="font-semibold text-red-800">Clear Cache</p>
                <p className="text-sm text-red-600">Clear all cached data and temporary files</p>
              </div>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm('Are you sure you want to clear all cache?')) {
                    alert('Cache cleared successfully!')
                  }
                }}
              >
                Clear Cache
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
              <div>
                <p className="font-semibold text-yellow-800">Reset All Settings</p>
                <p className="text-sm text-yellow-600">Reset all settings to factory defaults</p>
              </div>
              <Button variant="destructive" onClick={handleReset}>
                Reset to Defaults
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <p className="font-semibold text-red-800">Delete All Data</p>
                <p className="text-sm text-red-600">
                  Permanently delete all data. This action cannot be undone.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm('WARNING: This will delete ALL data. Are you absolutely sure?')) {
                    if (confirm('This action is irreversible. Type "DELETE" to confirm:')) {
                      alert('All data deleted. (Simulated)')
                    }
                  }
                }}
              >
                Delete All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
