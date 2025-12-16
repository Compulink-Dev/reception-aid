'use client'
import { Building, Menu, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from './ui/button'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div>
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">
                  Reception<span className="text-blue-600">Aide</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button asChild variant="ghost">
                <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
                  Home
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link
                  href="/features"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Features
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link
                  href="/pricing"
                  className="text-gray-200 hover:text-blue-600 font-medium transition"
                >
                  Pricing
                </Link>
              </Button>
              <Button className="text-gray-200 hover:text-gray-300 font-medium transition">
                <Link href="/contact">Contact</Link>
              </Button>
              <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                <Link href="/signin">Sign In</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
                  Home
                </Link>
                <Link
                  href="/features"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Features
                </Link>
                <Link
                  href="/pricing"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Pricing
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Contact
                </Link>
                <Link
                  href="/signin"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-center"
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Navbar
