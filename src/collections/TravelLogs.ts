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
        { label: 'Departed', value: 'departed' },
        { label: 'Returned', value: 'returned' },
        { label: 'Delayed', value: 'delayed' },
      ],
      defaultValue: 'departed',
    },
  ],
}
