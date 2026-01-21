'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/toast'

interface AddServiceFormProps {
  onClose: () => void
  onSuccess: () => void
}

export function AddServiceForm({ onClose, onSuccess }: AddServiceFormProps) {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    supplierType: 'PHOTOGRAPHER' as const,
    priceCents: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        showToast(`✅ Category "${formData.name}" added successfully!`, 'success')
        onSuccess()
      } else {
        showToast('Failed to add category', 'error')
      }
    } catch (error) {
      console.error('Failed to add service:', error)
      showToast('Failed to add category', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          New Category
        </h4>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            required
            placeholder="Category name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            autoComplete="off"
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <textarea
            required
            placeholder="Description *"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            autoComplete="off"
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            rows={2}
          />
        </div>

        <div>
          <select
            value={formData.supplierType}
            onChange={(e) =>
              setFormData({
                ...formData,
                supplierType: e.target.value as any,
              })
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="PHOTOGRAPHER">Photographer</option>
            <option value="COPYWRITER">Copywriter</option>
            <option value="SIGNBOARD">Signboard</option>
            <option value="DIGITAL">Digital</option>
            <option value="STYLIST">Stylist</option>
          </select>
        </div>

        <div>
          <input
            type="number"
            required
            step="0.01"
            placeholder="Base price (AUD) *"
            value={(formData.priceCents / 100).toFixed(2)}
            onChange={(e) =>
              setFormData({
                ...formData,
                priceCents: Math.round(parseFloat(e.target.value || '0') * 100),
              })
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  )
}

