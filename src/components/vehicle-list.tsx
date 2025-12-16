// components/security/VehicleList.tsx
'use client'

import React, { useState, useEffect } from 'react'

interface Vehicle {
  id: string
  registrationNumber: string
  vehicleType: string
  ownerName: string
  entryTime: string
  exitTime?: string
  purpose?: string
  currentMileage?: number
}

export default function VehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles')
      const data = await response.json()
      setVehicles(data.docs || [])
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async (vehicleId: string, currentMileage?: number) => {
    const exitMileage = prompt('Enter exit mileage (optional):', currentMileage?.toString() || '')

    if (exitMileage === null) return // User cancelled

    try {
      await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exitTime: new Date().toISOString(),
          exitMileage: exitMileage ? parseInt(exitMileage) : undefined,
        }),
      })
      fetchVehicles()
    } catch (error) {
      console.error('Error checking out vehicle:', error)
    }
  }

  if (loading) return <div>Loading vehicles...</div>

  const parkedVehicles = vehicles.filter((v) => !v.exitTime)
  const checkedOutVehicles = vehicles.filter((v) => v.exitTime)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Vehicle Management</h2>
        <p className="text-gray-600">Currently parked and recently checked out vehicles</p>
      </div>

      <div className="space-y-8">
        {/* Currently Parked Vehicles */}
        <div>
          <h3 className="text-lg font-medium mb-4">Currently Parked ({parkedVehicles.length})</h3>
          {parkedVehicles.length === 0 ? (
            <p className="text-gray-500">No vehicles currently parked</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reg Number
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entry Time
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mileage
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {parkedVehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td className="px-6 py-4 font-medium">{vehicle.registrationNumber}</td>
                      <td className="px-6 py-4">
                        <span className="capitalize">{vehicle.vehicleType.replace('-', ' ')}</span>
                      </td>
                      <td className="px-6 py-4">{vehicle.ownerName}</td>
                      <td className="px-6 py-4">{new Date(vehicle.entryTime).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {vehicle.currentMileage?.toLocaleString() || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleCheckout(vehicle.id, vehicle.currentMileage)}
                          className="bg-red-600 text-white py-1 px-3 rounded-md text-sm hover:bg-red-700"
                        >
                          Check Out
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recently Checked Out */}
        <div>
          <h3 className="text-lg font-medium mb-4">Recently Checked Out</h3>
          {checkedOutVehicles.length === 0 ? (
            <p className="text-gray-500">No recently checked out vehicles</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reg Number
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entry Time
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exit Time
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {checkedOutVehicles.slice(0, 10).map((vehicle) => {
                    const entry = new Date(vehicle.entryTime)
                    const exit = new Date(vehicle.exitTime!)
                    const duration = Math.round((exit.getTime() - entry.getTime()) / 60000) // minutes

                    return (
                      <tr key={vehicle.id}>
                        <td className="px-6 py-4">{vehicle.registrationNumber}</td>
                        <td className="px-6 py-4">{vehicle.ownerName}</td>
                        <td className="px-6 py-4">
                          {entry.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4">
                          {exit.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4">{duration} min</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
