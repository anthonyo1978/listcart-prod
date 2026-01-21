'use client'

import { useState, useEffect, useTransition } from 'react'
import { useToast } from '@/components/ui/toast'

interface FinanceSettings {
  globalCommissionPercent: number
  autoApplyCommission: boolean
}

export function FinanceCommissionSettings() {
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [settings, setSettings] = useState<FinanceSettings>({
    globalCommissionPercent: 0,
    autoApplyCommission: false,
  })

  useEffect(() => {
    // Load settings
    fetch('/api/settings/finance')
      .then((res) => res.json())
      .then((data) => {
        if (data.globalCommissionPercent !== undefined) {
          setSettings(data)
        }
      })
      .catch((err) => console.error('Failed to load settings:', err))
  }, [])

  const handleSave = () => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/settings/finance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings),
        })

        if (res.ok) {
          showToast('✅ Finance settings saved!', 'success')
        } else {
          showToast('Failed to save settings', 'error')
        }
      } catch (error) {
        console.error('Error saving settings:', error)
        showToast('Failed to save settings', 'error')
      }
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Commission Markup Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-start space-x-3 mb-4">
          <div className="text-2xl">💰</div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Commission Markup
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add a commission percentage to vendor prices. This markup is absorbed into the service cost and hidden from invoices, allowing you to earn commission without displaying it separately.
            </p>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          {/* Global Commission Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Global Commission Percentage
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={settings.globalCommissionPercent}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    globalCommissionPercent: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-32 px-4 py-2 text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
              />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">%</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              This percentage will be added to vendor prices to calculate your commission.
            </p>
          </div>

          {/* Example Calculation */}
          {settings.globalCommissionPercent > 0 && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Example Calculation
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Vendor Quote:</span>
                  <span className="font-medium text-gray-900 dark:text-white">$1,000.00</span>
                </div>
                <div className="flex justify-between text-blue-600 dark:text-blue-400">
                  <span>Your Commission ({settings.globalCommissionPercent}%):</span>
                  <span className="font-medium">
                    +${((1000 * settings.globalCommissionPercent) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-900 dark:text-white">Price Shown to Vendor:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    ${(1000 + (1000 * settings.globalCommissionPercent) / 100).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
                💡 The vendor sees the final price. Your commission is built in and hidden.
              </div>
            </div>
          )}

          {/* Auto-Apply Setting */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoApplyCommission}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    autoApplyCommission: e.target.checked,
                  })
                }
                className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  Automatically apply commission when adding vendors
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  When enabled, the global commission will automatically be applied to all vendor prices. When disabled, you can manually choose whether to apply commission for each vendor.
                </p>
              </div>
            </label>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
            <strong>How it works:</strong> When you add a vendor with a quote of $1,000 and have a 10% commission set, the system will store $1,100 as the price. This way, your commission is built into the service cost and the vendor only sees the final price, not the breakdown.
          </div>
        </div>
      </div>
    </div>
  )
}

