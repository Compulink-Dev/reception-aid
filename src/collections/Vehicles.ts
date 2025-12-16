// collections/Vehicles.ts
import { CollectionConfig } from 'payload'

export const Vehicles: CollectionConfig = {
  slug: 'vehicles',
  admin: {
    useAsTitle: 'registrationNumber',
  },
  fields: [
    {
      name: 'registrationNumber',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'vehicleType',
      type: 'select',
      options: [
        { label: 'Company Car', value: 'company-car' },
        { label: 'Employee Personal', value: 'employee-personal' },
        { label: 'Visitor', value: 'visitor' },
        { label: 'Delivery', value: 'delivery' },
      ],
      required: true,
    },
    {
      name: 'ownerName',
      type: 'text',
      required: true,
    },
    {
      name: 'ownerPhone',
      type: 'text',
    },
    {
      name: 'purpose',
      type: 'textarea',
    },
    {
      name: 'entryTime',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'exitTime',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'currentMileage',
      type: 'number',
      min: 0,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'securityGuard',
      type: 'text',
    },
  ],
}
