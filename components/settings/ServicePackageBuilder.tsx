'use client'

import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ServiceVendorManager } from './ServiceVendorManagerWithDnD'
import { AddServiceForm } from './AddServiceForm'
import { EditServiceForm } from './EditServiceForm'

interface Service {
  id: string
  serviceKey: string
  name: string
  description: string
  supplierType: string
  priceCents: number
  displayOrder: number
  defaultSelected: boolean
}

export function ServicePackageBuilder() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [isAddingService, setIsAddingService] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadServices()
  }, [])

  // Auto-select first service when services are loaded
  useEffect(() => {
    if (services.length > 0 && !selectedService) {
      setSelectedService(services[0].serviceKey)
    }
  }, [services, selectedService])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = services.findIndex((s) => s.id === active.id)
      const newIndex = services.findIndex((s) => s.id === over.id)

      const newOrder = arrayMove(services, oldIndex, newIndex)
      setServices(newOrder)

      // Update display order on server
      try {
        await fetch('/api/services/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            services: newOrder.map((s, index) => ({ id: s.id, displayOrder: index })),
          }),
        })
      } catch (error) {
        console.error('Failed to reorder services:', error)
      }
    }
  }

  async function loadServices() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/services')
      if (res.ok) {
        const data = await res.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Failed to load services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteService(service: Service) {
    if (!confirm(`Are you sure you want to delete "${service.name}"?\n\nThis will also remove all associated vendors.`)) {
      return
    }

    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        // If the deleted service was selected, clear selection
        if (selectedService === service.serviceKey) {
          setSelectedService(null)
        }
        // Reload services
        loadServices()
      } else {
        alert('Failed to delete category')
      }
    } catch (error) {
      console.error('Failed to delete service:', error)
      alert('Failed to delete category')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Service Package Builder
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage service categories and their approved vendors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Categories List */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Service Categories
            </h3>
            <button
              onClick={() => setIsAddingService(true)}
              className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
              title="Add new category"
            >
              <svg
                className="w-4 h-4 mr-1"
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
              New
            </button>
          </div>

          {isAddingService && (
            <AddServiceForm
              onClose={() => setIsAddingService(false)}
              onSuccess={() => {
                setIsAddingService(false)
                loadServices()
              }}
            />
          )}

          {editingService && (
            <EditServiceForm
              service={editingService}
              onClose={() => setEditingService(null)}
              onSuccess={() => {
                setEditingService(null)
                loadServices()
              }}
            />
          )}

          {isLoading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={services.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {services.map((service) => (
                    <SortableServiceItem
                      key={service.id}
                      service={service}
                      isSelected={selectedService === service.serviceKey}
                      onSelect={() => setSelectedService(service.serviceKey)}
                      onEdit={() => setEditingService(service)}
                      onDelete={() => handleDeleteService(service)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Vendor Management Panel */}
        <div className="lg:col-span-2">
          {selectedService ? (
            <ServiceVendorManager serviceKey={selectedService} />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px] bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <svg
                  className="mx-auto h-12 w-12 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="text-lg font-medium">Select a service category</p>
                <p className="text-sm mt-1">
                  Choose a service from the left to manage its vendors
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SortableServiceItem({
  service,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  service: Service
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: service.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-lg transition-all ${
        isSelected
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-gray-50 dark:bg-gray-700'
      }`}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className={`p-2 cursor-grab active:cursor-grabbing ${
          isSelected
            ? 'text-white hover:bg-blue-700'
            : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
        } rounded transition-colors`}
        title="Drag to reorder"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      <button
        onClick={onSelect}
        className={`flex-1 text-left px-4 py-3 rounded-lg transition-all ${
          isSelected
            ? 'text-white'
            : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium">{service.name}</span>
        </div>
        <div className={`text-xs mt-1 ${
          isSelected
            ? 'text-blue-100'
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          {service.supplierType}
        </div>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onEdit()
        }}
        className={`p-2 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded transition-colors ${
          isSelected
            ? 'text-white hover:text-purple-600'
            : 'text-gray-400 hover:text-purple-600 dark:text-gray-500 dark:hover:text-purple-400'
        }`}
        title="Edit category"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className={`p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors ${
          isSelected
            ? 'text-white hover:text-red-600'
            : 'text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400'
        }`}
        title="Delete category"
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
  )
}

