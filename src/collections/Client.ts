// collections/Clients.ts
import { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'companyName',
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      required: true,
    },
    {
      name: 'contactPerson',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'city',
      type: 'text',
    },
    {
      name: 'country',
      type: 'text',
    },
    {
      name: 'industry',
      type: 'select',
      options: [
        { label: 'Technology', value: 'technology' },
        { label: 'Finance', value: 'finance' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Retail', value: 'retail' },
        { label: 'Manufacturing', value: 'manufacturing' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'clientSince',
      type: 'date',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Prospect', value: 'prospect' },
      ],
      defaultValue: 'active',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'documents',
      type: 'array',
      fields: [
        {
          name: 'document',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
    {
      name: 'assignedEmployee',
      type: 'relationship',
      relationTo: 'employees',
    },
  ],
}
