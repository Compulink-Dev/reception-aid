// collections/Visitors.ts
import { CollectionConfig } from 'payload'

export const Visitors: CollectionConfig = {
  slug: 'visitors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'purpose', 'status', 'checkInTime'],
  },
  access: {
    read: () => true, // Allow public read access
    create: () => true, // Allow public create access
    update: () => true, // Allow public update access
    delete: () => true, // Allow public delete access (adjust as needed)
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Phone Number',
    },
    {
      name: 'company',
      type: 'text',
      label: 'Company/Organization',
    },
    {
      name: 'purpose',
      type: 'textarea',
      required: true,
      label: 'Purpose of Visit',
    },
    {
      name: 'employeeToMeet',
      type: 'relationship',
      relationTo: 'employees',
      label: 'Employee to Meet',
    },
    {
      name: 'employeeToMeetName', // New field for storing text name
      type: 'text',
      label: 'Employee to Meet (Text)',
      required: false,
    },
    {
      name: 'checkInTime',
      type: 'date',
      label: 'Check-in Time',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      defaultValue: () => new Date(),
    },
    {
      name: 'checkOutTime',
      type: 'date',
      label: 'Check-out Time',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Checked In', value: 'checked-in' },
        { label: 'Checked Out', value: 'checked-out' },
        { label: 'Expected', value: 'expected' },
      ],
      defaultValue: 'checked-in',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Additional Notes',
    },
    {
      name: 'badgeNumber',
      type: 'text',
      label: 'Visitor Badge Number',
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Auto-set check-in time on create
        if (operation === 'create') {
          data.checkInTime = data.checkInTime || new Date()
        }

        // Auto-set check-out time when status changes to checked-out
        if (data.status === 'checked-out' && !data.checkOutTime) {
          data.checkOutTime = new Date()
        }

        return data
      },
    ],
  },
}
