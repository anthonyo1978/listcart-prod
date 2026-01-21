'use client'

import { useState, useTransition } from 'react'
import { savePaymentPreference } from '@/lib/actions'

interface VendorSentModalProps {
  isOpen: boolean
  vendorCount: number
  cartId: string
  onClose: () => void
}

export function VendorSentModal({ isOpen, vendorCount, cartId, onClose }: VendorSentModalProps) {
  const [paymentPreference, setPaymentPreference] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState<'story' | 'payment' | 'complete'>('story')

  if (!isOpen) return null

  const handleContinue = () => {
    setStep('payment')
  }

  const handlePaymentSubmit = () => {
    startTransition(async () => {
      // Save payment preference to database
      await savePaymentPreference(cartId, paymentPreference as any)
      
      setStep('complete')
      
      // Close modal after 3 seconds
      setTimeout(() => {
        onClose()
      }, 3000)
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={step === 'complete' ? onClose : undefined}
        />
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {step === 'story' && (
            <>
              {/* Success Animation */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                    <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {/* Pulsing ring */}
                  <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
                🎉 Cart Sent Successfully!
              </h2>

              <div className="space-y-4 text-gray-700 dark:text-gray-300 mb-8">
                <p className="text-center text-lg font-medium text-green-600 dark:text-green-400">
                  We've emailed {vendorCount} service provider{vendorCount !== 1 ? 's' : ''}
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
                  <p className="flex items-start">
                    <span className="mr-2">📧</span>
                    <span>As service providers accept or request more details, you'll receive emails to help with arranging and booking.</span>
                  </p>
                  
                  <p className="flex items-start">
                    <span className="mr-2">💬</span>
                    <span><strong>ListCart will facilitate all communication</strong> between you and the service providers.</span>
                  </p>
                  
                  <p className="flex items-start">
                    <span className="mr-2">📋</span>
                    <span>Once all service providers are locked in, we'll send you an invoice.</span>
                  </p>
                  
                  <p className="flex items-start">
                    <span className="mr-2">💳</span>
                    <span>You can pay securely using the link in the invoice email.</span>
                  </p>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Continue →
              </button>
            </>
          )}

          {step === 'payment' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Preference
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please indicate now for our records how you'd like to pay when the time comes:
              </p>

              <div className="space-y-3 mb-8">
                <label
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentPreference === 'CARD'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentPreference"
                    value="CARD"
                    checked={paymentPreference === 'CARD'}
                    onChange={(e) => setPaymentPreference(e.target.value)}
                    className="mt-1 h-4 w-4 text-blue-600"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      💳 Card
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Pay securely with credit or debit card when invoice is ready
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentPreference === 'PAY_LATER'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentPreference"
                    value="PAY_LATER"
                    checked={paymentPreference === 'PAY_LATER'}
                    onChange={(e) => setPaymentPreference(e.target.value)}
                    className="mt-1 h-4 w-4 text-blue-600"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      📅 Pay Later / Financing
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Flexible payment options and financing available
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentPreference === 'NOT_SURE'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentPreference"
                    value="NOT_SURE"
                    checked={paymentPreference === 'NOT_SURE'}
                    onChange={(e) => setPaymentPreference(e.target.value)}
                    className="mt-1 h-4 w-4 text-blue-600"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      ❓ Not sure, send me all options
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      We'll provide details on all available payment methods
                    </p>
                  </div>
                </label>
              </div>

              <button
                onClick={handlePaymentSubmit}
                disabled={!paymentPreference || isPending}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isPending ? 'Saving...' : 'Submit Preference'}
              </button>
            </>
          )}

          {step === 'complete' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
                Thank You! 🙏
              </h2>

              <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
                Your preference has been recorded. We'll be in touch soon!
              </p>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                This window will close automatically...
              </div>
            </>
          )}

          {/* Close button for story and payment steps */}
          {step !== 'complete' && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

