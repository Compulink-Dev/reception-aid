//@ts-nocheck
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
      name: 'deliveryNoteNumber',
      type: 'text',
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
      admin: {
        components: {
          RowLabel: ({ data }: any) => data?.serialNumber || 'Serial Number',
        },
      },
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
      type: 'relationship',
      relationTo: 'employees',
      required: true,
      label: 'To (Recipient)',
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
    {
      name: 'weight',
      type: 'text',
    },
    {
      name: 'dimensions',
      type: 'text',
    },
    {
      name: 'deliveryService',
      type: 'text',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
