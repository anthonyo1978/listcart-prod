'use client'

import { formatCurrencyAUD } from '@/lib/services'

interface ServiceCardProps {
  serviceKey: string
  name: string
  description: string
  priceCents: number
  selected: boolean
  onToggle: (serviceKey: string) => void
  disabled?: boolean
  agentNotes?: string | null
}

export function ServiceCard({
  serviceKey,
  name,
  description,
  priceCents,
  selected,
  onToggle,
  disabled = false,
  agentNotes,
}: ServiceCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 transition-all ${
        selected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
      } ${disabled ? 'opacity-60' : 'cursor-pointer hover:border-blue-400'}`}
      onClick={() => !disabled && onToggle(serviceKey)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggle(serviceKey)}
            disabled={disabled}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
            {agentNotes && (
              <div className="mt-2 text-sm italic text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded">
                💬 "{agentNotes}"
              </div>
            )}
          </div>
        </div>
        <div className="ml-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
          {formatCurrencyAUD(priceCents)}
        </div>
      </div>
    </div>
  )
}

