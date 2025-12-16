// collections/TravelLogs.ts
import { CollectionConfig } from 'payload'

export const TravelLogs: CollectionConfig = {
  slug: 'travel-logs',
  admin: {
    useAsTitle: 'employee',
  },
  fields: [
    {
      name: 'employee',
      type: 'relationship',
      relationTo: 'employees',
      required: true,
    },
    {
      name: 'destination',
      type: 'text',
      required: true,
    },
    {
      name: 'purpose',
      type: 'textarea',
      required: true,
    },
    {
      name: 'departureTime',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'expectedReturn',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'actualReturn',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Departed', value: 'departed' },
        { label: 'Returned', value: 'returned' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'travelType',
      type: 'select',
      options: [
        { label: 'Business Meeting', value: 'business' },
        { label: 'Client Visit', value: 'client_visit' },
        { label: 'Conference/Event', value: 'conference' },
        { label: 'Training', value: 'training' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'business',
    },
    {
      name: 'transportation',
      type: 'select',
      options: [
        { label: 'Flight', value: 'flight' },
        { label: 'Car', value: 'car' },
        { label: 'Bus', value: 'bus' },
        { label: 'Train', value: 'train' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'flight',
    },
    {
      name: 'accommodation',
      type: 'text',
    },
    {
      name: 'estimatedCost',
      type: 'number',
      min: 0,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
