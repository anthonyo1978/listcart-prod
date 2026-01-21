'use client'

import { useState } from 'react'
import { ServiceCard } from '@/components/ServiceCard'
import { TotalBar } from '@/components/TotalBar'
import { approveCart } from '@/lib/actions'
import { RECOMMENDED_PACK_KEYS } from '@/lib/services'
import { useRouter } from 'next/navigation'
import type { Cart, CartItem } from '@prisma/client'

interface VendorCartClientProps {
  cart: Cart & { items: CartItem[] }
}

export default function VendorCartClient({ cart }: VendorCartClientProps) {
  const router = useRouter()
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set(cart.items.filter((item) => item.selected).map((item) => item.serviceKey))
  )
  const [paymentChoice, setPaymentChoice] = useState<'PAY_NOW' | 'PAY_LATER'>(
    'PAY_LATER'
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleToggle = (serviceKey: string) => {
    const newSelected = new Set(selectedServices)
    if (newSelected.has(serviceKey)) {
      newSelected.delete(serviceKey)
    } else {
      newSelected.add(serviceKey)
    }
    setSelectedServices(newSelected)
  }

  const totalCents = cart.items
    .filter((item) => selectedServices.has(item.serviceKey))
    .reduce((sum, item) => sum + item.priceCents, 0)

  const handleSubmit = async () => {
    if (selectedServices.size === 0) {
      setError('Please select at least one service')
      return
    }

    setIsSubmitting(true)
    setError(null)

    const result = await approveCart(
      cart.token,
      paymentChoice,
      Array.from(selectedServices)
    )

    if (result.success) {
      router.refresh()
    } else {
      setError(result.error || 'Failed to approve cart')
      setIsSubmitting(false)
    }
  }

  const recommendedPackServices = cart.items.filter((item) =>
    RECOMMENDED_PACK_KEYS.includes(item.serviceKey)
  )
  const additionalServices = cart.items.filter(
    (item) => !RECOMMENDED_PACK_KEYS.includes(item.serviceKey)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pb-32">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ListCart Service Selection
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Property: <span className="font-semibold">{cart.propertyAddress}</span>
          </p>
          {cart.agentName && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Agent: {cart.agentName}
            </p>
          )}
        </div>

        {/* Recommended Pack */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recommended Pack
              </h2>
              <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full font-medium">
                Pre-selected
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Our most popular bundle for property listings
            </p>
          </div>
            <div className="space-y-3">
              {recommendedPackServices.map((item) => (
                <ServiceCard
                  key={item.id}
                  serviceKey={item.serviceKey}
                  name={item.name}
                  description={item.description}
                  priceCents={item.priceCents}
                  selected={selectedServices.has(item.serviceKey)}
                  onToggle={handleToggle}
                  disabled={isSubmitting}
                  agentNotes={item.agentNotes}
                />
              ))}
            </div>
        </div>

        {/* Additional Services */}
        {additionalServices.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Additional Services
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Optional add-ons to enhance your listing
              </p>
            </div>
            <div className="space-y-3">
              {additionalServices.map((item) => (
                <ServiceCard
                  key={item.id}
                  serviceKey={item.serviceKey}
                  name={item.name}
                  description={item.description}
                  priceCents={item.priceCents}
                  selected={selectedServices.has(item.serviceKey)}
                  onToggle={handleToggle}
                  disabled={isSubmitting}
                  agentNotes={item.agentNotes}
                />
              ))}
            </div>
          </div>
        )}

        {/* Payment Choice */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Option
          </h2>
          <div className="space-y-3">
            <label
              className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                paymentChoice === 'PAY_NOW'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
            >
              <input
                type="radio"
                name="paymentChoice"
                value="PAY_NOW"
                checked={paymentChoice === 'PAY_NOW'}
                onChange={(e) =>
                  setPaymentChoice(e.target.value as 'PAY_NOW' | 'PAY_LATER')
                }
                disabled={isSubmitting}
                className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3">
                <div className="font-semibold text-gray-900 dark:text-white">
                  Pay Now
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Payment processed immediately
                </div>
              </div>
            </label>
            <label
              className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                paymentChoice === 'PAY_LATER'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
            >
              <input
                type="radio"
                name="paymentChoice"
                value="PAY_LATER"
                checked={paymentChoice === 'PAY_LATER'}
                onChange={(e) =>
                  setPaymentChoice(e.target.value as 'PAY_NOW' | 'PAY_LATER')
                }
                disabled={isSubmitting}
                className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3">
                <div className="font-semibold text-gray-900 dark:text-white">
                  Pay at Settlement
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Payment due upon property settlement
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Confirm Button */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedServices.size === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl text-lg"
          >
            {isSubmitting ? 'Confirming...' : 'Confirm Service Selection'}
          </button>
          {selectedServices.size === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
              Please select at least one service to continue
            </p>
          )}
        </div>
      </div>

      {/* Total Bar (sticky at bottom) */}
      <TotalBar totalCents={totalCents} selectedCount={selectedServices.size} />
    </div>
  )
}

