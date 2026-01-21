'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function CartSearchBox() {
  const [cartNumber, setCartNumber] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  // Auto-dismiss error after 3 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!cartNumber.trim()) {
      return
    }

    setIsSearching(true)
    setErrorMessage('')

    try {
      const friendlyId = `LC-${cartNumber.padStart(3, '0')}`
      const response = await fetch(`/api/carts/search?friendlyId=${friendlyId}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.cart) {
          // Navigate to agent view
          router.push(`/c/${data.cart.id}/agent`)
        } else {
          setErrorMessage(`Cart ${friendlyId} not found`)
        }
      } else {
        setErrorMessage(`Cart ${friendlyId} not found`)
      }
    } catch (error) {
      console.error('Search error:', error)
      setErrorMessage('Search failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/\D/g, '')
    setCartNumber(value)
    setErrorMessage('') // Clear error when typing
  }

  return (
    <div className="pt-6 flex flex-col items-center">
      <form onSubmit={handleSearch} className="relative w-72">
        <div className="relative">
          <div className="absolute left-10 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-500 pointer-events-none">
            LC-
          </div>
          <input
            type="text"
            value={cartNumber}
            onChange={handleInputChange}
            placeholder="001"
            disabled={isSearching}
            autoComplete="off"
            className="w-full px-4 py-3 pl-16 pr-4 text-sm border-2 border-white/30 rounded-full bg-white/20 backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all disabled:opacity-50"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {isSearching && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            </div>
          )}
        </div>
      </form>
      
      {/* Error message - appears briefly then fades */}
      {errorMessage && (
        <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-sm text-white bg-red-500/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  )
}

