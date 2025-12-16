// lib/validations.ts
import { z } from 'zod'

export const visitorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  company: z.string().optional(),
  purpose: z.string().min(5, 'Purpose must be at least 5 characters'),
  employeeToMeet: z.string().optional(),
  department: z.string().optional(),
  notes: z.string().optional(),
  checkInTime: z.string().optional(),
  status: z.string().optional(),
})

export const travelLogSchema = z.object({
  employee: z.string(),
  destination: z.string().min(2, 'Destination is required'),
  purpose: z.string().min(10, 'Please provide a detailed purpose'),
  departureTime: z.date(),
  expectedReturn: z.date().optional(),
})

export const parcelSchema = z.object({
  trackingNumber: z.string().optional(),
  sender: z.string().min(2, 'Sender name is required'),
  senderType: z.enum(['supplier', 'employee', 'client', 'other']),
  recipient: z.string().min(1, 'Recipient is required'),
  description: z.string().min(10, 'Please provide a detailed description'),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  deliveryService: z.string().optional(),
  notes: z.string().optional(),
})

export const phoneCallSchema = z.object({
  employee: z.string(),
  callerName: z.string().optional(),
  callerNumber: z.string().min(10, 'Phone number is required'),
  purpose: z.string().min(10, 'Please provide call purpose'),
})

export const vehicleSchema = z.object({
  registrationNumber: z.string().min(3, 'Registration number is required'),
  vehicleType: z.enum(['company-car', 'employee-personal', 'visitor', 'delivery']),
  ownerName: z.string().min(2, 'Owner name is required'),
  ownerPhone: z.string().optional(),
  purpose: z.string().optional(),
  currentMileage: z.number().min(0).optional(),
})
