'use client'

import { formatCurrencyAUD } from '@/lib/services'

interface TotalBarProps {
  totalCents: number
  selectedCount: number
}

export function TotalBar({ totalCents, selectedCount }: TotalBarProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedCount} {selectedCount === 1 ? 'service' : 'services'}{' '}
              selected
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrencyAUD(totalCents)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

