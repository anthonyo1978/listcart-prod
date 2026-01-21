'use client'

import { useState, useEffect } from 'react'
import { SERVICES, formatCurrencyAUD } from '@/lib/services'

interface Vendor {
  id: string
  businessName: string
  contactName: string | null
  email: string | null
  phone: string | null
  priceCents: number
  isPreferred: boolean
  displayOrder: number
}

interface ServiceVendorManagerProps {
  serviceKey: string
}

export function ServiceVendorManager({ serviceKey }: ServiceVendorManagerProps) {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const service = SERVICES.find((s) => s.key === serviceKey)

  useEffect(() => {
    loadVendors()
  }, [serviceKey])

  async function loadVendors() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/vendors?serviceKey=${serviceKey}`)
      if (res.ok) {
        const data = await res.json()
        setVendors(data)
      }
    } catch (error) {
      console.error('Failed to load vendors:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!service) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {service.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {service.description}
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Vendor
        </button>
      </div>

      {/* Add Vendor Form */}
      {isAdding && (
        <AddVendorForm
          serviceKey={serviceKey}
          defaultPrice={service.priceCents}
          onClose={() => setIsAdding(false)}
          onSuccess={() => {
            setIsAdding(false)
            loadVendors()
          }}
        />
      )}

      {/* Vendors List */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Loading vendors...
        </div>
      ) : vendors.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            No vendors added yet
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Click "Add Vendor" to add approved vendors for this service
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {vendors.map((vendor, index) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              index={index}
              onUpdate={loadVendors}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function AddVendorForm({
  serviceKey,
  defaultPrice,
  onClose,
  onSuccess,
}: {
  serviceKey: string
  defaultPrice: number
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    priceCents: defaultPrice,
    isPreferred: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, serviceKey }),
      })

      if (res.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to add vendor:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mb-6 p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Add New Vendor
        </h4>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Business Name *
          </label>
          <input
            type="text"
            required
            value={formData.businessName}
            onChange={(e) =>
              setFormData({ ...formData, businessName: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contact Name
          </label>
          <input
            type="text"
            value={formData.contactName}
            onChange={(e) =>
              setFormData({ ...formData, contactName: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price (AUD) *
          </label>
          <input
            type="number"
            required
            step="0.01"
            value={(formData.priceCents / 100).toFixed(2)}
            onChange={(e) =>
              setFormData({
                ...formData,
                priceCents: Math.round(parseFloat(e.target.value) * 100),
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPreferred}
              onChange={(e) =>
                setFormData({ ...formData, isPreferred: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preferred Vendor
            </span>
          </label>
        </div>

        <div className="col-span-2 flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add Vendor'}
          </button>
        </div>
      </form>
    </div>
  )
}

function VendorCard({
  vendor,
  index,
  onUpdate,
}: {
  vendor: Vendor
  index: number
  onUpdate: () => void
}) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Delete ${vendor.businessName}?`)) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/vendors/${vendor.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to delete vendor:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <span className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-bold">
              #{index + 1}
            </span>
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white">
                {vendor.businessName}
                {vendor.isPreferred && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    ⭐ Preferred
                  </span>
                )}
              </h5>
              {vendor.contactName && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {vendor.contactName}
                </p>
              )}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {vendor.email && (
              <div className="text-gray-600 dark:text-gray-400">
                📧 {vendor.email}
              </div>
            )}
            {vendor.phone && (
              <div className="text-gray-600 dark:text-gray-400">
                📞 {vendor.phone}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-4 ml-4">
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrencyAUD(vendor.priceCents)}
            </div>
          </div>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
            title="Delete vendor"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

