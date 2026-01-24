'use client'

import Link from 'next/link'
import { CartStatus, CartItemStatus } from '@prisma/client'
import { formatCurrencyAUD } from '@/lib/services'

type CartSummary = {
  id: string
  friendlyId: string
  status: CartStatus
  propertyAddress: string
  vendorName: string
  agentName: string | null
  createdAt: Date
  updatedAt: Date
  approvedAt: Date | null
  totalCents: number
  items: {
    id: string
    selected: boolean
    itemStatus: CartItemStatus | null
  }[]
}

function StatusBadge({ status }: { status: CartStatus }) {
  const statusConfig: Record<
    CartStatus,
    { label: string; color: string; icon: string }
  > = {
    DRAFT: {
      label: 'Draft',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      icon: '📝',
    },
    SENT: {
      label: 'Sent to Providers',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      icon: '📤',
    },
    VENDOR_APPROVED: {
      label: 'Providers Approved',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      icon: '✅',
    },
    INVOICE_SENT: {
      label: 'Invoice Sent',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      icon: '💳',
    },
    PAID: {
      label: 'Paid',
      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
      icon: '💰',
    },
    APPROVED: {
      label: 'Vendor Approved',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      icon: '✅',
    },
  }

  const config = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  )
}

function CartCard({ cart }: { cart: CartSummary }) {
  const selectedItems = cart.items.filter((item) => item.selected)
  const approvedItems = selectedItems.filter(
    (item) => item.itemStatus === 'AGENT_APPROVED'
  )

  const formattedDate = new Date(cart.createdAt).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <Link
      href={`/c/${cart.id}/agent`}
      className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg group"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                {cart.friendlyId}
              </span>
              <StatusBadge status={cart.status} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {cart.propertyAddress}
            </h3>
          </div>
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="font-medium">{cart.vendorName}</span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span>
              {selectedItems.length} service{selectedItems.length !== 1 ? 's' : ''}
              {cart.status !== 'DRAFT' && approvedItems.length > 0 && (
                <span className="ml-1 text-green-600 dark:text-green-400">
                  • {approvedItems.length} approved
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Created {formattedDate}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {cart.status === 'DRAFT' && 'Estimated total'}
            {cart.status !== 'DRAFT' && 'Total'}
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrencyAUD(cart.totalCents)}
          </div>
        </div>
      </div>
    </Link>
  )
}

export function MyCartsClient({ carts }: { carts: CartSummary[] }) {
  if (carts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No ListCarts yet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Create your first ListCart to get started
        </p>
        <Link
          href="/create"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
        >
          Create a ListCart
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Total Carts
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {carts.length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            In Progress
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {carts.filter((c) => c.status === 'SENT').length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Completed
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {carts.filter((c) => c.status === 'PAID').length}
          </div>
        </div>
      </div>

      {/* Carts Grid */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          All Carts ({carts.length})
        </h2>
        <Link
          href="/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Cart
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {carts.map((cart) => (
          <CartCard key={cart.id} cart={cart} />
        ))}
      </div>
    </div>
  )
}

