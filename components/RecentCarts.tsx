'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface RecentCart {
  id: string
  friendlyId: string
  status: string
  propertyAddress: string | null
  createdAt: string
  totalCents: number
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT: { label: 'Draft', color: 'text-gray-600', bg: 'bg-gray-100' },
  PENDING_VENDOR: { label: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  SENT_TO_PROVIDERS: { label: 'Sent', color: 'text-blue-600', bg: 'bg-blue-100' },
  VENDOR_APPROVED: { label: 'Approved', color: 'text-green-600', bg: 'bg-green-100' },
  INVOICE_SENT: { label: 'Invoiced', color: 'text-purple-600', bg: 'bg-purple-100' },
  PAID: { label: 'Paid', color: 'text-emerald-600', bg: 'bg-emerald-100' },
}

export function RecentCarts() {
  const [carts, setCarts] = useState<RecentCart[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecentCarts() {
      try {
        const res = await fetch('/api/carts?limit=5')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setCarts(data.carts || [])
      } catch {
        setError('Could not load recent carts')
      } finally {
        setLoading(false)
      }
    }
    fetchRecentCarts()
  }, [])

  // Don't show anything if no carts or still loading
  if (loading) {
    return (
      <div className="mt-8 max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-center gap-2 text-white/70">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="text-sm">Loading recent carts...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || carts.length === 0) {
    return null // Don't show section if no carts
  }

  return (
    <div className="mt-8 max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white/90">Your Recent ListCarts</h3>
          <Link
            href="/my-carts"
            className="text-xs text-blue-300 hover:text-blue-200 transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="space-y-2">
          {carts.map((cart) => {
            const status = STATUS_CONFIG[cart.status] || STATUS_CONFIG.DRAFT
            return (
              <Link
                key={cart.id}
                href={`/c/${cart.id}/agent`}
                className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-2 0h2" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {cart.propertyAddress || cart.friendlyId}
                    </p>
                    <p className="text-xs text-white/50">
                      {cart.friendlyId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                  <svg className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

