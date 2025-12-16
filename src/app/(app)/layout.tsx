import React from 'react'
import './styles.css'
import { Toaster } from 'sonner'

export const metadata = {
  description: 'Reception Aide',
  title: 'Reception Aide',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
