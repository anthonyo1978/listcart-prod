'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface PendingClientProps {
  cartId: string
  friendlyId: string
}

export default function PendingClient({ cartId, friendlyId }: PendingClientProps) {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect after 15 seconds
    const timer = setTimeout(() => {
      router.push(`/c/${cartId}/agent`)
    }, 15000)

    return () => clearTimeout(timer)
  }, [cartId, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Pulsing Circle */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Outer pulsing rings */}
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-pulse opacity-30"></div>
            
            {/* Main circle */}
            <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
              <svg
                className="w-16 h-16 text-white animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Agent verification email sent
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          Please check your email and click the verification link
        </p>

        {/* Cart ID - Big and prominent */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 max-w-md mx-auto">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            ListCart ID
          </p>
          <p className="text-6xl font-bold text-blue-600 dark:text-blue-400 tracking-wider">
            {friendlyId}
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          This will redirect automatically in a few moments...
        </p>
      </div>
    </div>
  )
}

