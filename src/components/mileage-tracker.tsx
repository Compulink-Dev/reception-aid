// components/security/MileageTracker.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface MileageData {
  date: string
  mileage: number
  vehicle: string
}

export const MileageTracker: React.FC = () => {
  const [data, setData] = useState<MileageData[]>([])

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockData: MileageData[] = [
      { date: '2024-01-01', mileage: 10000, vehicle: 'ABC 123' },
      { date: '2024-01-02', mileage: 10200, vehicle: 'ABC 123' },
      { date: '2024-01-03', mileage: 10450, vehicle: 'ABC 123' },
      { date: '2024-01-04', mileage: 10700, vehicle: 'ABC 123' },
      { date: '2024-01-05', mileage: 11000, vehicle: 'ABC 123' },
    ]
    setData(mockData)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Vehicle Mileage Tracking</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="mileage" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Mileage Log</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Vehicle</th>
                <th className="px-4 py-2 text-left">Mileage</th>
                <th className="px-4 py-2 text-left">Distance</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">{item.vehicle}</td>
                  <td className="px-4 py-2">{item.mileage.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {index > 0 ? (item.mileage - data[index - 1].mileage).toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
