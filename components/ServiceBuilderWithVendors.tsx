'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { formatCurrencyAUD } from '@/lib/services'
import { updateCartItem, progressCartItemStatus, updateCartItemVendor } from '@/lib/actions'
import type { CartItem } from '@prisma/client'

interface Vendor {
  id: string
  businessName: string
  contactName: string | null
  priceCents: number
  isPreferred: boolean
}

interface ServiceBuilderProps {
  items: CartItem[]
  cartId: string
  isApproved: boolean
  cartStatus: string
}

export function ServiceBuilder({ items, cartId, isApproved, cartStatus }: ServiceBuilderProps) {
  const [isPending, startTransition] = useTransition()
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())
  const [expandedVendors, setExpandedVendors] = useState<Set<string>>(new Set())
  const [vendorsByService, setVendorsByService] = useState<Record<string, Vendor[]>>({})
  const [selectedVendors, setSelectedVendors] = useState<Record<string, Set<string>>>({})
  const [localNotes, setLocalNotes] = useState<Record<string, string>>({})
  const saveTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({})
  const [showMarginBreakdown, setShowMarginBreakdown] = useState(false)
  const [commissionPercent, setCommissionPercent] = useState(0)

  const isEditable = cartStatus === 'DRAFT'
  const isCorrespondenceMode = cartStatus === 'SENT'

  // Load global commission percentage
  useEffect(() => {
    fetch('/api/settings/finance')
      .then((res) => res.json())
      .then((data) => {
        if (data.globalCommissionPercent !== undefined) {
          setCommissionPercent(data.globalCommissionPercent)
        }
      })
      .catch((err) => console.error('Failed to load commission settings:', err))
  }, [])

  const handleToggle = (item: CartItem) => {
    if (!isEditable) return
    
    startTransition(async () => {
      await updateCartItem(item.id, cartId, {
        selected: !item.selected,
      })
    })
  }

  const handleServiceClick = (item: CartItem) => {
    if (!isCorrespondenceMode || !item.selected) return
    
    startTransition(async () => {
      await progressCartItemStatus(item.id, cartId)
    })
  }

  const handleNotesChange = (itemId: string, notes: string) => {
    if (isApproved) return
    
    // Update local state immediately
    setLocalNotes((prev) => ({ ...prev, [itemId]: notes }))
    
    // Clear existing timeout for this item
    if (saveTimeoutRef.current[itemId]) {
      clearTimeout(saveTimeoutRef.current[itemId])
    }
    
    // Set new timeout to save after user stops typing
    saveTimeoutRef.current[itemId] = setTimeout(() => {
      startTransition(async () => {
        await updateCartItem(itemId, cartId, {
          agentNotes: notes || undefined,
        })
      })
    }, 1500) // Save 1.5s after user stops typing
  }
  
  // Initialize selected vendors from cart items
  useEffect(() => {
    const initialSelections: Record<string, Set<string>> = {}
    items.forEach((item) => {
      if (item.vendorId) {
        initialSelections[item.id] = new Set([item.vendorId])
      }
    })
    setSelectedVendors(initialSelections)
  }, []) // Only run on mount
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(saveTimeoutRef.current).forEach(clearTimeout)
    }
  }, [])

  const toggleNotes = (itemId: string) => {
    const newExpanded = new Set(expandedNotes)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedNotes(newExpanded)
  }

  const toggleVendors = async (itemId: string, serviceKey: string) => {
    const newExpanded = new Set(expandedVendors)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
      // Fetch vendors if not already loaded
      if (!vendorsByService[serviceKey]) {
        try {
          const res = await fetch(`/api/vendors?serviceKey=${serviceKey}`)
          if (res.ok) {
            const vendors = await res.json()
            setVendorsByService((prev) => ({ ...prev, [serviceKey]: vendors }))
          }
        } catch (error) {
          console.error('Failed to load vendors:', error)
        }
      }
    }
    setExpandedVendors(newExpanded)
  }

  const toggleVendorSelection = (itemId: string, vendorId: string, vendorPriceCents: number) => {
    const itemVendors = selectedVendors[itemId] || new Set()
    const isCurrentlySelected = itemVendors.has(vendorId)
    
    // Update UI state immediately
    setSelectedVendors((prev) => {
      const newItemVendors = new Set(prev[itemId] || [])
      if (isCurrentlySelected) {
        newItemVendors.delete(vendorId)
      } else {
        newItemVendors.clear() // Only one vendor per service
        newItemVendors.add(vendorId)
      }
      return { ...prev, [itemId]: newItemVendors }
    })
    
    // Save to database
    startTransition(async () => {
      if (isCurrentlySelected) {
        // Deselecting - clear vendor and price
        await updateCartItemVendor(itemId, cartId, null, 0)
      } else {
        // Selecting - set vendor and price
        await updateCartItemVendor(itemId, cartId, vendorId, vendorPriceCents)
      }
    })
  }

  const selectedItems = items.filter((item) => item.selected)
  const totalCents = selectedItems.reduce((sum, item) => sum + item.priceCents, 0)

  return (
    <div className="space-y-4">
      {/* Service Selection */}
      <div className="space-y-3">
        {items.map((item) => {
          const vendors = vendorsByService[item.serviceKey] || []
          const itemSelectedVendors = selectedVendors[item.id] || new Set()

          return (
            <div
              key={item.id}
              data-service-key={item.serviceKey}
              className={`border rounded-lg transition-all ${
                (item as any).itemStatus === 'AGENT_APPROVED' && item.selected
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : item.selected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
              } ${!isEditable && (item as any).itemStatus !== 'AGENT_APPROVED' ? 'opacity-75' : ''} ${
                isCorrespondenceMode && item.selected ? 'cursor-pointer hover:shadow-md' : ''
              }`}
            >
              <div
                className={`p-4 ${isEditable ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (isCorrespondenceMode && item.selected) {
                    handleServiceClick(item)
                  } else if (isEditable) {
                    handleToggle(item)
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => handleToggle(item)}
                      disabled={!isEditable || isPending}
                      className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.name}
                        {itemSelectedVendors.size > 0 && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded-full">
                            {itemSelectedVendors.size} provider{itemSelectedVendors.size > 1 ? 's' : ''} selected
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                      {item.agentNotes && (
                        <div className="mt-2 text-sm italic text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded">
                          💬 "{item.agentNotes}"
                        </div>
                      )}
                      
                      {/* Correspondence Section */}
                      {isCorrespondenceMode && item.selected && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-gray-500 dark:text-gray-400">
                              Status:
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full font-semibold ${
                                (item as any).itemStatus === 'AGENT_APPROVED'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : (item as any).itemStatus === 'PROVIDER_ACCEPTED'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {(item as any).itemStatus === 'AGENT_APPROVED'
                                ? '✅ Vendor Approved'
                                : (item as any).itemStatus === 'PROVIDER_ACCEPTED'
                                ? '📨 Provider Accepted'
                                : '⏳ Awaiting Response'}
                            </span>
                          </div>
                          
                          {(item as any).providerResponse && (
                            <div className="text-sm bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded border border-gray-200 dark:border-gray-600">
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                Provider Response:
                              </div>
                              <div className="text-gray-900 dark:text-white">
                                {(item as any).providerResponse}
                              </div>
                            </div>
                          )}
                          
                          {isCorrespondenceMode && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                              {(item as any).itemStatus === 'AGENT_APPROVED'
                                ? '🎉 Locked in! Vendor has approved this provider.'
                                : (item as any).itemStatus === 'PROVIDER_ACCEPTED'
                                ? '👆 Click again for vendor to approve'
                                : '👆 Click to simulate provider response'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    {formatCurrencyAUD(item.priceCents)}
                  </div>
                </div>
              </div>

              {/* Vendor Selection Section */}
              {isEditable && item.selected && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleVendors(item.id, item.serviceKey)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center space-x-1"
                  >
                    <span>{expandedVendors.has(item.id) ? '▼' : '▶'}</span>
                    <span>Select service providers</span>
                    {vendors.length > 0 && (
                      <span className="text-gray-500 dark:text-gray-400">
                        ({vendors.length} available)
                      </span>
                    )}
                  </button>

                  {expandedVendors.has(item.id) && (
                    <div className="px-4 pb-4 space-y-2" onClick={(e) => e.stopPropagation()}>
                      {vendors.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          No service providers configured. Add them in Settings.
                        </p>
                      ) : (
                        vendors.map((vendor) => (
                          <div
                            key={vendor.id}
                            className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={itemSelectedVendors.has(vendor.id)}
                              onChange={() => toggleVendorSelection(item.id, vendor.id, vendor.priceCents)}
                              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              disabled={isPending}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {vendor.businessName}
                                  </span>
                                </div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                  {formatCurrencyAUD(vendor.priceCents)}
                                </span>
                              </div>
                              {vendor.contactName && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                  {vendor.contactName}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Notes Section */}
              {isEditable && item.selected && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleNotes(item.id)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center space-x-1"
                  >
                    <span>{expandedNotes.has(item.id) ? '▼' : '▶'}</span>
                    <span>
                      {item.agentNotes ? 'Edit note for service providers' : 'Add note for service providers'}
                    </span>
                  </button>

                  {expandedNotes.has(item.id) && (
                    <div className="px-4 pb-4" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        key={`notes-${item.id}`}
                        value={localNotes[item.id] ?? item.agentNotes ?? ''}
                        onChange={(e) => handleNotesChange(item.id, e.target.value)}
                        onBlur={(e) => {
                          // Save immediately on blur
                          if (saveTimeoutRef.current[item.id]) {
                            clearTimeout(saveTimeoutRef.current[item.id])
                          }
                          startTransition(async () => {
                            await updateCartItem(item.id, cartId, {
                              agentNotes: e.target.value || undefined,
                            })
                          })
                        }}
                        placeholder="Add instructions or requirements for service providers..."
                        disabled={isPending}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                        rows={3}
                        autoComplete="off"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {isPending ? 'Saving...' : 'Saves when you click away'}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Margin Breakdown - Expandable */}
      {commissionPercent > 0 && selectedItems.length > 0 && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowMarginBreakdown(!showMarginBreakdown)}
            className="w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">
                  Your Commission Breakdown
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {showMarginBreakdown ? 'Click to hide' : 'Click to view earnings'}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">Total Margin</div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {(() => {
                    const totalMargin = selectedItems.reduce((sum, item) => {
                      const finalPrice = item.priceCents
                      const rawPrice = finalPrice / (1 + commissionPercent / 100)
                      const margin = finalPrice - rawPrice
                      return sum + margin
                    }, 0)
                    return formatCurrencyAUD(Math.round(totalMargin))
                  })()}
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${showMarginBreakdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Expanded Margin Details */}
          {showMarginBreakdown && (
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-2 mb-3">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      How Your Commission Works
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      A {commissionPercent}% markup is applied to all vendor quotes. This commission is built into the service prices shown to vendors and absorbed in the service cost - it's not shown as a separate line item on invoices.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Service-by-Service Breakdown
                </div>
                {selectedItems.map((item) => {
                  const finalPrice = item.priceCents / 100
                  const rawPrice = finalPrice / (1 + commissionPercent / 100)
                  const margin = finalPrice - rawPrice

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Vendor: ${rawPrice.toFixed(2)} + {commissionPercent}% → ${finalPrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Your margin</div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          +${margin.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
                  <div className="font-bold text-gray-900 dark:text-white">
                    Total Commission Earned
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {(() => {
                      const totalMargin = selectedItems.reduce((sum, item) => {
                        const finalPrice = item.priceCents
                        const rawPrice = finalPrice / (1 + commissionPercent / 100)
                        const margin = finalPrice - rawPrice
                        return sum + margin
                      }, 0)
                      return formatCurrencyAUD(Math.round(totalMargin))
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Total Bar */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t-2 border-blue-500 shadow-lg rounded-t-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedItems.length} service{selectedItems.length !== 1 ? 's' : ''} selected
            </div>
            {!isApproved && (
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Estimated total (pending vendor approval)
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrencyAUD(totalCents)}
          </div>
        </div>
      </div>
    </div>
  )
}

