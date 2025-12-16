// collections/ParcelLogs.ts
import { CollectionConfig } from 'payload'

export const ParcelLogs: CollectionConfig = {
  slug: 'parcel-logs',
  admin: {
    useAsTitle: 'trackingNumber',
  },
  fields: [
    {
      name: 'trackingNumber',
      type: 'text',
      unique: true,
    },
    {
      name: 'sender',
      type: 'text',
      required: true,
    },
    {
      name: 'senderType',
      type: 'select',
      options: [
        { label: 'Supplier', value: 'supplier' },
        { label: 'Employee', value: 'employee' },
        { label: 'Client', value: 'client' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'employees',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'receivedAt',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'collectedAt',
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
        { label: 'Received', value: 'received' },
        { label: 'Collected', value: 'collected' },
        { label: 'Returned', value: 'returned' },
      ],
      defaultValue: 'received',
    },
  ],
}
