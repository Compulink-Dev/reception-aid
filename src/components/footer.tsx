import {
  Building,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  PhoneIcon,
  Twitter,
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <div>
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold text-white">
                  Reception<span className="text-blue-400">Aid</span>
                </span>
              </div>
              <p className="text-gray-400">
                Modern reception management system for efficient office operations and security.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="hover:text-white transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="hover:text-white transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-white font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/features/visitor-management" className="hover:text-white transition">
                    Visitor Management
                  </Link>
                </li>
                <li>
                  <Link href="/features/vehicle-tracking" className="hover:text-white transition">
                    Vehicle Tracking
                  </Link>
                </li>
                <li>
                  <Link href="/features/parcel-management" className="hover:text-white transition">
                    Parcel Management
                  </Link>
                </li>
                <li>
                  <Link href="/features/phone-calls" className="hover:text-white transition">
                    Phone Call Logs
                  </Link>
                </li>
                <li>
                  <Link href="/features/travel-logs" className="hover:text-white transition">
                    Travel Logs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />
                  <span>123 Business Street, City, Country</span>
                </li>
                <li className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-blue-400" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span>support@receptionaid.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">
                © {new Date().getFullYear()} ReceptionAid. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
