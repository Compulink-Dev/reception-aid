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
  employee: z.string().min(1, 'Employee is required'),
  destination: z.string().min(1, 'Destination is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  departureTime: z.string().min(1, 'Departure time is required'),
  expectedReturn: z.string().optional(),
  status: z
    .enum(['pending', 'approved', 'departed', 'returned', 'cancelled'])
    .optional()
    .default('pending'),
  travelType: z
    .enum(['business', 'client_visit', 'conference', 'training', 'other'])
    .optional()
    .default('business'),
  transportation: z.enum(['flight', 'car', 'train', 'bus', 'other']).optional().default('flight'),
  accommodation: z.string().optional(),
  estimatedCost: z.number().min(0).optional().nullable(),
  notes: z.string().optional(),
})

// lib/validations.ts
export const parcelSchema = z.object({
  trackingNumber: z.string().optional(),
  deliveryNoteNumber: z.string().optional(),
  serialNumbers: z
    .array(
      z.object({
        serialNumber: z.string().min(1, 'Serial number is required'),
      }),
    )
    .optional(),
  from: z.string().min(1, 'Sender is required'),
  senderType: z.enum(['incoming', 'outgoing', 'other']),
  to: z.string().min(1, 'Recipient is required'),
  description: z.string().min(1, 'Description is required'),
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
