'use client'

import { useState, useEffect } from 'react'
import { formatCurrencyAUD } from '@/lib/services'
import { useToast } from '@/components/ui/toast'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Vendor {
  id: string
  serviceVendorId: string
  businessName: string
  contactName: string | null
  email: string | null
  phone: string | null
  priceCents: number
  isPreferred: boolean
  displayOrder: number
}

interface Service {
  name: string
  description: string
  priceCents: number
}

interface ServiceVendorManagerProps {
  serviceKey: string
}

export function ServiceVendorManager({ serviceKey }: ServiceVendorManagerProps) {
  const { showToast } = useToast()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [service, setService] = useState<Service | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    loadService()
    loadVendors()
  }, [serviceKey])

  async function loadService() {
    try {
      const res = await fetch(`/api/services?key=${serviceKey}`)
      if (res.ok) {
        const data = await res.json()
        setService(data[0])
      }
    } catch (error) {
      console.error('Failed to load service:', error)
    }
  }

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

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = vendors.findIndex((v) => v.serviceVendorId === active.id)
      const newIndex = vendors.findIndex((v) => v.serviceVendorId === over.id)

      const newVendors = arrayMove(vendors, oldIndex, newIndex).map(
        (v, idx) => ({
          ...v,
          displayOrder: idx,
        })
      )

      setVendors(newVendors)

      // Save new order to backend
      try {
        const res = await fetch('/api/vendors/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceKey,
            vendorOrder: newVendors.map((v, idx) => ({
              serviceVendorId: v.serviceVendorId,
              displayOrder: idx,
            })),
          }),
        })

        if (res.ok) {
          showToast('✅ Vendor order saved', 'success')
        } else {
          showToast('Failed to save order', 'error')
          loadVendors()
        }
      } catch (error) {
        console.error('Failed to save vendor order:', error)
        showToast('Failed to save order', 'error')
        // Reload vendors on error
        loadVendors()
      }
    }
  }

  if (!service) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    )
  }

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

      {/* Vendors List with Drag & Drop */}
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
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            💡 Drag vendors to reorder them. The order here determines vendor priority.
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={vendors.map((v) => v.serviceVendorId)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {vendors.map((vendor, index) => (
                  <SortableVendorCard
                    key={vendor.serviceVendorId}
                    vendor={vendor}
                    index={index}
                    onUpdate={loadVendors}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
}

function SortableVendorCard({
  vendor,
  index,
  onUpdate,
}: {
  vendor: Vendor
  index: number
  onUpdate: () => void
}) {
  const { showToast } = useToast()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: vendor.serviceVendorId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Delete ${vendor.businessName}?`)) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/vendors/${vendor.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        showToast(`✅ "${vendor.businessName}" deleted`, 'success')
        onUpdate()
      } else {
        showToast('Failed to delete vendor', 'error')
      }
    } catch (error) {
      console.error('Failed to delete vendor:', error)
      showToast('Failed to delete vendor', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
    >
      <div className="flex items-start justify-between">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="flex-shrink-0 mr-3 mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 10-.001 4.001A2 2 0 007 2zm0 6a2 2 0 10-.001 4.001A2 2 0 007 8zm0 6a2 2 0 10-.001 4.001A2 2 0 007 14zm6-8a2 2 0 10-.001-4.001A2 2 0 0013 6zm0 2a2 2 0 10-.001 4.001A2 2 0 0013 8zm0 6a2 2 0 10-.001 4.001A2 2 0 0013 14z" />
          </svg>
        </button>

        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <span className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-bold">
              #{index + 1}
            </span>
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white">
                {vendor.businessName}
They only chat about the Olympics              </h5>
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

// Import the existing AddVendorForm component code below
// (keeping the same as before)
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
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    priceCents: defaultPrice,
    isPreferred: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commissionPercent, setCommissionPercent] = useState(0)

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Calculate final price with commission markup
      const finalPriceCents = Math.round(
        formData.priceCents * (1 + commissionPercent / 100)
      )

      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          priceCents: finalPriceCents, // Store the final price with markup
          serviceKey 
        }),
      })

      if (res.ok) {
        showToast(`✅ "${formData.businessName}" added successfully!`, 'success')
        onSuccess()
      } else {
        showToast('Failed to add vendor', 'error')
      }
    } catch (error) {
      console.error('Failed to add vendor:', error)
      showToast('Failed to add vendor', 'error')
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
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Vendor Quote (AUD) *
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
          
          {/* Price Calculator */}
          {formData.priceCents > 0 && (
            <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600 rounded-lg">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Price Breakdown
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700 dark:text-gray-300">Vendor Quote:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${(formData.priceCents / 100).toFixed(2)}
                  </span>
                </div>
                {commissionPercent > 0 && (
                  <>
                    <div className="flex justify-between items-center text-sm text-blue-600 dark:text-blue-400">
                      <span>Your Margin ({commissionPercent}%):</span>
                      <span className="font-semibold">
                        +${((formData.priceCents / 100) * (commissionPercent / 100)).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-blue-200 dark:border-gray-600 pt-2 flex justify-between items-center">
                      <span className="font-bold text-gray-900 dark:text-white">
                        Final ListCart Price:
                      </span>
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        ${((formData.priceCents / 100) * (1 + commissionPercent / 100)).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
                {commissionPercent === 0 && (
                  <div className="border-t border-blue-200 dark:border-gray-600 pt-2 flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white">
                      Final ListCart Price:
                    </span>
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                      ${(formData.priceCents / 100).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 italic flex items-start">
                <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {commissionPercent > 0 
                  ? 'This final price (including your margin) will be used in ListCarts. Your commission is built in.'
                  : 'No commission markup applied. Set a global commission in Finance & Commission settings.'}
              </div>
            </div>
          )}
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

