// app/(app)/(dashboard)/profile/page.t
import UserProfile from '@/components/user-profile'
import React from 'react'

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-600">Manage your personal information and account settings</p>
      </div>
      <UserProfile />
    </div>
  )
}
