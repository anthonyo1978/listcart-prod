'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { UserMenu } from '@/components/UserMenu'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <span
              className={`text-xl font-bold transition-colors ${
                isScrolled
                  ? 'text-gray-900 dark:text-white'
                  : 'text-white drop-shadow-lg'
              }`}
            >
              ListCart AI AI
            </span>
          </Link>

          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                isScrolled
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-white drop-shadow-lg'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                isScrolled
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-white drop-shadow-lg'
              }`}
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('roadmap')}
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                isScrolled
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-white drop-shadow-lg'
              }`}
            >
              Roadmap
            </button>
            <button
              onClick={() => scrollToSection('resources')}
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                isScrolled
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-white drop-shadow-lg'
              }`}
            >
              Resources
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                isScrolled
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-white drop-shadow-lg'
              }`}
            >
              <Link href="/support" className={`text-sm font-medium transition-colors hover:text-blue-500 ${isScrolled ? "text-gray-700 dark:text-gray-300" : "text-white drop-shadow-lg"}`} + ">Support</Link>
              <Link href="/support" className="text-sm font-medium transition-colors hover:text-blue-500 " + (isScrolled ? "text-gray-700 dark:text-gray-300" : "text-white drop-shadow-lg") + ">Support</Link>
              About Us
            </button>
          </div>

          {/* User Menu - Right */}
          <div className="flex items-center space-x-4">
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}

