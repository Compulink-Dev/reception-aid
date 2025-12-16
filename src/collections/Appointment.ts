// collections/Appointments.ts
import { CollectionConfig } from 'payload'

export const Appointments: CollectionConfig = {
  slug: 'appointments',
  admin: {
    useAsTitle: 'visitorName',
    defaultColumns: ['visitorName', 'company', 'employeeToMeet', 'scheduledTime', 'status'],
    group: 'Visitor Management',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'visitorName',
      type: 'text',
      required: true,
      label: 'Visitor Name',
    },
    {
      name: 'company',
      type: 'text',
      required: true,
      label: 'Company',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email Address',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Phone Number',
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
      required: true,
    },
    {
      name: 'employeeToMeetText',
      type: 'text',
      label: 'Employee to Meet (Text)',
      admin: {
        description: 'Fallback if no employee relationship',
      },
    },
    {
      name: 'department',
      type: 'select',
      label: 'Department',
      options: [
        { label: 'IT', value: 'IT' },
        { label: 'Sales', value: 'Sales' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Legal', value: 'Legal' },
        { label: 'Executive', value: 'Executive' },
        { label: 'HR', value: 'HR' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Operations', value: 'Operations' },
      ],
      required: true,
    },
    {
      name: 'scheduledTime',
      type: 'date',
      label: 'Scheduled Date & Time',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'duration',
      type: 'number',
      label: 'Duration (minutes)',
      required: true,
      defaultValue: 60,
      min: 15,
      max: 480,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Completed', value: 'completed' },
        { label: 'No-show', value: 'no-show' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'appointmentType',
      type: 'select',
      label: 'Appointment Type',
      options: [
        { label: 'Meeting', value: 'meeting' },
        { label: 'Interview', value: 'interview' },
        { label: 'Delivery', value: 'delivery' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'meeting',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
    },
    {
      name: 'visitorArrived',
      type: 'checkbox',
      label: 'Visitor Arrived',
      defaultValue: false,
    },
    {
      name: 'checkInTime',
      type: 'date',
      label: 'Check-in Time',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        condition: (data) => data?.visitorArrived,
      },
    },
    {
      name: 'checkOutTime',
      type: 'date',
      label: 'Check-out Time',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        condition: (data) => data?.checkInTime,
      },
    },
    {
      name: 'sendReminder',
      type: 'checkbox',
      label: 'Send Reminder',
      defaultValue: true,
    },
    {
      name: 'reminderSent',
      type: 'checkbox',
      label: 'Reminder Sent',
      defaultValue: false,
    },
    {
      name: 'reminderSentAt',
      type: 'date',
      label: 'Reminder Sent At',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        condition: (data) => data?.reminderSent,
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Created By',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Updated By',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Set createdBy on create
        if (operation === 'create' && req.user) {
          data.createdBy = req.user.id
        }

        // Set updatedBy on update
        if (operation === 'update' && req.user) {
          data.updatedBy = req.user.id
        }

        // Auto-set check-in time when visitor arrives
        if (data.visitorArrived && !data.checkInTime) {
          data.checkInTime = new Date()
          data.status = 'completed'
        }

        // Auto-set check-out time when provided
        if (data.checkInTime && !data.checkOutTime && data.status === 'completed') {
          data.checkOutTime = new Date()
        }

        // Set reminder sent timestamp
        if (data.sendReminder && !data.reminderSent) {
          data.reminderSent = true
          data.reminderSentAt = new Date()
        }

        return data
      },
    ],
  },
}
