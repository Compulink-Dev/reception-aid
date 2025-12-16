// collections/PhoneCalls.ts
import { CollectionConfig } from 'payload'

export const PhoneCalls: CollectionConfig = {
  slug: 'phone-calls',
  admin: {
    useAsTitle: 'callerNumber',
  },
  fields: [
    {
      name: 'employee',
      type: 'relationship',
      relationTo: 'employees',
      required: true,
    },
    {
      name: 'callerName',
      type: 'text',
    },
    {
      name: 'callerNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'purpose',
      type: 'textarea',
      required: true,
    },
    {
      name: 'startTime',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endTime',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'duration',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'cost',
      type: 'number',
      min: 0,
    },
  ],
}
