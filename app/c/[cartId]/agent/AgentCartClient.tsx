'use client'

import { useState, useTransition } from 'react'
import { formatCurrencyAUD } from '@/lib/services'
import { markInvoiceAsSent, markCartAsPaid } from '@/lib/actions'

interface AgentCartClientProps {
  vendorLink: string
  cartId: string
  approvedServices: Array<{
    name: string
    priceCents: number
    providerQuoteCents?: number | null
  }>
  vendorName: string
  vendorEmail?: string | null
  cartStatus: string
}

export default function AgentCartClient({
  vendorLink,
  cartId,
  approvedServices,
  vendorName,
  vendorEmail,
  cartStatus,
}: AgentCartClientProps) {
  const [invoiceGenerated, setInvoiceGenerated] = useState(
    cartStatus === 'VENDOR_APPROVED' || cartStatus === 'INVOICE_SENT' || cartStatus === 'PAID'
  )
  const [isPending, startTransition] = useTransition()

  const invoiceSent = cartStatus === 'INVOICE_SENT' || cartStatus === 'PAID'
  const paid = cartStatus === 'PAID'

  // Calculate totals
  const serviceTotal = approvedServices.reduce(
    (sum, service) => sum + (service.providerQuoteCents || service.priceCents),
    0
  )
  const lcFee = Math.round(serviceTotal * 0.02) // 2% LC fee
  const grandTotal = serviceTotal + lcFee

  const handleGenerateInvoice = () => {
    startTransition(() => {
      // Mock invoice generation
      setTimeout(() => {
        setInvoiceGenerated(true)
      }, 500)
    })
  }

  const handleSendInvoice = () => {
    startTransition(async () => {
      await markInvoiceAsSent(cartId)
    })
  }

  const handleMarkAsPaid = () => {
    startTransition(async () => {
      await markCartAsPaid(cartId)
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        📄 Vendor Invoice
      </h2>
      
      {!invoiceGenerated ? (
        <>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Generate an invoice for <strong>{vendorName}</strong> with all approved services plus ListCart fee.
          </p>
          <button
            onClick={handleGenerateInvoice}
            disabled={isPending || approvedServices.length === 0}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Generating...' : '📄 Generate Invoice'}
          </button>
          {approvedServices.length === 0 && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
              ⚠️ No approved services yet. Approve provider quotes first.
            </p>
          )}
        </>
      ) : (
        <div className="space-y-4">
          {/* Invoice Preview */}
          <div className="border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
            <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Invoice To: {vendorName}
              {vendorEmail && (
                <span className="text-gray-600 dark:text-gray-400 font-normal ml-2">
                  ({vendorEmail})
                </span>
              )}
            </div>
            
            <div className="space-y-2 mb-3">
              {approvedServices.map((service, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{service.name}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrencyAUD(service.providerQuoteCents || service.priceCents)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-blue-300 dark:border-blue-700 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">Services Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrencyAUD(serviceTotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">ListCart Fee (2%)</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrencyAUD(lcFee)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-blue-300 dark:border-blue-700 pt-2">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-blue-600 dark:text-blue-400">
                  {formatCurrencyAUD(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Send Invoice Button */}
          {!invoiceSent && !paid ? (
            <button
              onClick={handleSendInvoice}
              disabled={isPending}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isPending ? 'Sending...' : '📧 Send Invoice to Vendor'}
            </button>
          ) : paid ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500 dark:border-emerald-600 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-emerald-800 dark:text-emerald-200 font-bold text-lg">
                PAID - {formatCurrencyAUD(grandTotal)}
              </div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                Payment received! All services confirmed.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                <div className="text-green-800 dark:text-green-200 font-semibold">
                  ✅ Invoice Sent to {vendorName}!
                </div>
                <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Awaiting payment from vendor...
                </div>
              </div>
              <button
                onClick={handleMarkAsPaid}
                disabled={isPending}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {isPending ? 'Processing...' : '💰 Mark as Paid'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

