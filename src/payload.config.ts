import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Visitors } from './collections/Visitors'
import { TravelLogs } from './collections/TravelLogs'
import { ParcelLogs } from './collections/ParcelLogs'
import { PhoneCalls } from './collections/PhoneCalls'
import { Vehicles } from './collections/Vehicles'
import { Employees } from './collections/Employees'
import { Clients } from './collections/Client'
import { Appointments } from './collections/Appointment'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Appointments,
    Users,
    Media,
    Visitors,
    TravelLogs,
    ParcelLogs,
    PhoneCalls,
    Vehicles,
    Employees,
    Clients,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [],
})
