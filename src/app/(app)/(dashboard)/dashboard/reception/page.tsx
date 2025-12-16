// app/(app)/(dashboard)/(reception)/reception/page.tsx
'use client'

import ParcelLog from '@/components/parcel-log'
import PhoneCallLog from '@/components/phone-call-log'
import TravelLog from '@/components/travel-log'
import VisitorCheckin from '@/components/vistor-checkin'
import React, { useState } from 'react'

export default function ReceptionPage() {
  const [activeTab, setActiveTab] = useState('visitors')

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reception Management</h1>
        <p className="text-gray-600">Manage visitors, parcels, calls, and travel logs</p>
      </div>

      <div className="flex border-b mb-6 overflow-x-auto">
        {['visitors', 'parcels', 'calls', 'travel'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'visitors' && 'Visitor Management'}
            {tab === 'parcels' && 'Parcel Logs'}
            {tab === 'calls' && 'Phone Calls'}
            {tab === 'travel' && 'Travel Logs'}
          </button>
        ))}
      </div>

      {activeTab === 'visitors' && <VisitorCheckin />}
      {activeTab === 'parcels' && <ParcelLog />}
      {activeTab === 'calls' && <PhoneCallLog />}
      {activeTab === 'travel' && <TravelLog />}
    </div>
  )
}
