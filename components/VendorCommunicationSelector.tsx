'use client'

import { useState, useTransition } from 'react'
import { sendCartToVendors } from '@/lib/actions'
import { VendorSentModal } from './VendorSentModal'
import type { VendorCommunicationMode } from '@prisma/client'

interface VendorCommunicationSelectorProps {
  cartId: string
  selectedVendorCount: number
  currentMode?: VendorCommunicationMode | null
  isAlreadySent: boolean
}

export function VendorCommunicationSelector({
  cartId,
  selectedVendorCount,
  currentMode,
  isAlreadySent,
}: VendorCommunicationSelectorProps) {
  const [mode, setMode] = useState<'FIRST_COME_FIRST_SERVE' | 'REVIEW_AND_APPROVE'>(
    currentMode || 'REVIEW_AND_APPROVE'
  )
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; vendorCount?: number; error?: string } | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleSend = () => {
    console.log('🚀 Sending cart to service providers...')
    startTransition(async () => {
      const res = await sendCartToVendors(cartId, mode)
      console.log('📬 Server response:', res)
      setResult(res)
      if (res.success) {
        console.log('✅ Success! Opening modal...')
        setShowModal(true)
      } else {
        console.error('❌ Error:', res.error)
      }
    })
  }

  if (isAlreadySent) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">
              ✅ Cart Sent to Service Providers
            </h3>
            <p className="mt-1 text-sm text-green-700 dark:text-green-300">
              Mode: {currentMode === 'FIRST_COME_FIRST_SERVE' ? 'First Come First Serve' : 'Review & Approve'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        📨 Send Cart to Service Providers
      </h3>

      {selectedVendorCount === 0 ? (
        <div className="text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          ⚠️ Please select at least one service provider from the services above before sending.
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Choose how service providers will respond to this service request:
          </p>

          <div className="space-y-3 mb-6">
            <label
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                mode === 'FIRST_COME_FIRST_SERVE'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
              }`}
            >
              <input
                type="radio"
                name="communicationMode"
                value="FIRST_COME_FIRST_SERVE"
                checked={mode === 'FIRST_COME_FIRST_SERVE'}
                onChange={(e) => setMode(e.target.value as any)}
                className="mt-1 h-4 w-4 text-blue-600"
              />
              <div className="ml-3 flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">
                  ⚡ First Come First Serve
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Service providers can accept jobs immediately. The first to respond secures the work.
                  Great for urgent requests.
                </p>
              </div>
            </label>

            <label
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                mode === 'REVIEW_AND_APPROVE'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
              }`}
            >
              <input
                type="radio"
                name="communicationMode"
                value="REVIEW_AND_APPROVE"
                checked={mode === 'REVIEW_AND_APPROVE'}
                onChange={(e) => setMode(e.target.value as any)}
                className="mt-1 h-4 w-4 text-blue-600"
              />
              <div className="ml-3 flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">
                  📋 Review & Approve
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Service providers submit quotes for your review. You choose the best option.
                  Communication facilitated by ListCart.
                </p>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Ready to send
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {selectedVendorCount} service provider{selectedVendorCount !== 1 ? 's' : ''} will be contacted
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={isPending}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Sending...</span>
                </span>
              ) : (
                `Send to ${selectedVendorCount} Service Provider${selectedVendorCount !== 1 ? 's' : ''}`
              )}
            </button>
          </div>

          {result && !result.success && (
            <div className="text-sm p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
              ❌ {result.error}
            </div>
          )}
        </>
      )}

      {/* Success Modal */}
      <VendorSentModal
        isOpen={showModal}
        vendorCount={result?.vendorCount || 0}
        cartId={cartId}
        onClose={() => {
          setShowModal(false)
          // Reload the page to show updated status
          window.location.reload()
        }}
      />
    </div>
  )
}

