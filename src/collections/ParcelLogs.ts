// collections/ParcelLogs.ts (Simplified version)
import { CollectionConfig } from 'payload'

export const ParcelLogs: CollectionConfig = {
  slug: 'parcel-logs',
  admin: {
    useAsTitle: 'from',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'description',
          type: 'text',
          required: true,
          label: 'Item Description',
        },
        {
          name: 'serialNumbers',
          type: 'array',
          fields: [
            {
              name: 'serialNumber',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'from',
      type: 'text',
      required: true,
      label: 'From (Sender)',
    },
    {
      name: 'senderType',
      type: 'select',
      options: [
        { label: 'Incoming', value: 'incoming' },
        { label: 'Outgoing', value: 'outgoing' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'to',
      type: 'text',
      required: true,
      label: 'To (Recipient)',
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
    {
      name: 'weight',
      type: 'text',
    },
    {
      name: 'dimensions',
      type: 'text',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
