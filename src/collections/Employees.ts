// collections/Employees.ts
import { CollectionConfig } from 'payload'

export const Employees: CollectionConfig = {
  slug: 'employees',
  admin: {
    useAsTitle: 'name',
  },
  //   access: {
  //     read: access.isAdminOrSelf,
  //     update: access.isAdminOrSelf,
  //     delete: access.isAdmin,
  //   },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'employeeId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'department',
      type: 'select',
      options: [
        { label: 'IT', value: 'it' },
        { label: 'HR', value: 'hr' },
        { label: 'Finance', value: 'finance' },
        { label: 'Operations', value: 'operations' },
        { label: 'Sales', value: 'sales' },
      ],
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
