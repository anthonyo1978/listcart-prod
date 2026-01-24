'use client'

import { useState, useTransition } from 'react'
import { formatCurrencyAUD } from '@/lib/services'
import { updateCartItem } from '@/lib/actions'
import type { CartItem } from '@prisma/client'

interface ServiceBuilderProps {
  items: CartItem[]
  cartId: string
  isApproved: boolean
}

export function ServiceBuilder({ items, cartId, isApproved }: ServiceBuilderProps) {
  const [isPending, startTransition] = useTransition()
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())

  const handleToggle = (item: CartItem) => {
    if (isApproved) return
    
    startTransition(async () => {
      await updateCartItem(item.id, cartId, {
        selected: !item.selected,
      })
    })
  }

  const handleNotesChange = (item: CartItem, notes: string) => {
    if (isApproved) return
    
    startTransition(async () => {
      await updateCartItem(item.id, cartId, {
        agentNotes: notes || undefined,
      })
    })
  }

  const toggleNotes = (itemId: string) => {
    const newExpanded = new Set(expandedNotes)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedNotes(newExpanded)
  }

  const selectedItems = items.filter((item) => item.selected)
  const totalCents = selectedItems.reduce((sum, item) => sum + item.priceCents, 0)

  return (
    <div className="space-y-4">
      {/* Service Selection */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`border rounded-lg transition-all ${
              item.selected
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
            } ${isApproved ? 'opacity-75' : ''}`}
          >
            <div
              className={`p-4 ${!isApproved ? 'cursor-pointer' : ''}`}
              onClick={() => handleToggle(item)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => handleToggle(item)}
                    disabled={isApproved || isPending}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                    {item.agentNotes && (
                      <div className="mt-2 text-sm italic text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded">
                        💬 "{item.agentNotes}"
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                  {formatCurrencyAUD(item.priceCents)}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            {!isApproved && (
              <div className="border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => toggleNotes(item.id)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  {expandedNotes.has(item.id) ? '▼' : '▶'} Add note for vendor
                  {item.agentNotes && ' ✏️'}
                </button>
                {expandedNotes.has(item.id) && (
                  <div className="px-4 pb-4">
                    <textarea
                      value={item.agentNotes || ''}
                      onChange={(e) => handleNotesChange(item, e.target.value)}
                      placeholder='e.g. "Most people go for this" or "Optional but recommended"'
                      disabled={isPending}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white disabled:opacity-50"
                      rows={2}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      This note will be visible to the vendor when they review the
                      services
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-lg font-semibold text-gray-900 dark:text-white">
          {isApproved ? 'Total' : 'Estimated Total'}
          {!isApproved && (
            <div className="text-xs text-gray-500 dark:text-gray-400 font-normal mt-1">
              {selectedItems.length} {selectedItems.length === 1 ? 'service' : 'services'} selected
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrencyAUD(totalCents)}
        </div>
      </div>
    </div>
  )
}

