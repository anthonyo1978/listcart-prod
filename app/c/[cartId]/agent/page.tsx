import { getCartById } from '@/lib/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AgentCartClient from './AgentCartClient'
import { AgentPageClient } from './AgentPageClient'
import { ServiceCommunicationsWrapper } from './ServiceCommunicationsWrapper'
import { VendorCommunicationSelector } from '@/components/VendorCommunicationSelector'
import { formatCurrencyAUD } from '@/lib/services'
import { UserMenu } from '@/components/UserMenu'

export default async function AgentCartPage({
  params,
}: {
  params: Promise<{ cartId: string }>
}) {
  const { cartId } = await params
  const cart = await getCartById(cartId)

  if (!cart) {
    notFound()
  }

  const vendorLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/v/${cart.token}`
  const selectedItems = cart.items.filter((item) => item.selected)
  const approvedServices = cart.items.filter(
    (item) => item.selected && (item as any).itemStatus === 'AGENT_APPROVED'
  )
  
  // Calculate estimated total from selected items (for pre-approval display)
  const estimatedTotal = selectedItems.reduce((sum, item) => sum + item.priceCents, 0)
  // Use actual total if approved, otherwise show estimated
  const displayTotal = cart.status === 'APPROVED' ? cart.totalCents : estimatedTotal
  
  // Count unique vendors from ServiceVendor relationships for selected services
  const { prisma } = await import('@/lib/prisma')
  const selectedServiceKeys = selectedItems.map((item) => item.serviceKey)
  
  let selectedVendorCount = 0
  if (selectedServiceKeys.length > 0) {
    const vendors = await prisma.serviceVendor.findMany({
      where: {
        serviceKey: { in: selectedServiceKeys },
      },
      select: {
        vendor: {
          select: {
            email: true,
          },
        },
      },
    })
    
    // Count unique vendor emails
    const uniqueEmails = new Set(
      vendors
        .map((sv) => sv.vendor.email)
        .filter((email): email is string => !!email)
    )
    selectedVendorCount = uniqueEmails.size
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      {/* User Menu - Top Right */}
      <div className="absolute top-6 right-6">
        <UserMenu />
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  ListCart Details
                </h1>
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-2 border-blue-200 dark:border-blue-700">
                  {cart.friendlyId}
                </span>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {cart.propertyAddress}
              </p>
            </div>
            <div>
              <StatusBadge status={cart.status} />
            </div>
          </div>

          {/* Timeline - Train Station Style */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <TimelineItem
                label="Created"
                date={cart.createdAt}
                completed={true}
              />
              <TimelineConnector 
                completed={['SENT', 'VENDOR_APPROVED', 'INVOICE_SENT', 'PAID'].includes(cart.status as string)}
              />
              <TimelineItem 
                label="Sent to Providers" 
                completed={['SENT', 'VENDOR_APPROVED', 'INVOICE_SENT', 'PAID'].includes(cart.status as string)}
              />
              <TimelineConnector 
                completed={['VENDOR_APPROVED', 'INVOICE_SENT', 'PAID'].includes(cart.status as string)}
              />
              <TimelineItem
                label="Vendor Approved"
                completed={['VENDOR_APPROVED', 'INVOICE_SENT', 'PAID'].includes(cart.status as string)}
              />
              <TimelineConnector 
                completed={['INVOICE_SENT', 'PAID'].includes(cart.status as string)}
              />
              <TimelineItem
                label="Invoice Sent"
                completed={['INVOICE_SENT', 'PAID'].includes(cart.status as string)}
              />
              <TimelineConnector 
                completed={(cart.status as string) === 'PAID'}
              />
              <TimelineItem
                label="Paid"
                date={(cart.status as string) === 'PAID' ? cart.updatedAt : undefined}
                completed={(cart.status as string) === 'PAID'}
              />
            </div>
          </div>
        </div>

        {/* Service Items - Interactive builder: build the cart with the vendor */}
        <details 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6 border border-gray-200 dark:border-gray-700"
          open={cart.status === 'DRAFT'}
        >
          <summary className="cursor-pointer px-6 py-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors list-none">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white inline">
                  {cart.status === 'APPROVED'
                    ? 'Approved Services'
                    : 'Build Your Service Package'}
                </h2>
                {cart.status === 'SENT' && (
                  <span className="ml-3 text-xs text-gray-500 dark:text-gray-400">
                    (Sent to providers - expand to view selections)
                  </span>
                )}
                {cart.status === 'DRAFT' && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Select services and add notes that will be visible to service providers
                  </p>
                )}
              </div>
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </summary>
          <div className="p-6">
            {cart.status === 'SENT' && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Click on a service to view communications with providers
              </p>
            )}
            <AgentPageClient
              items={cart.items}
              cartId={cart.id}
              cartStatus={cart.status}
              isApproved={cart.status === 'APPROVED'}
            />
            {cart.paymentChoice && (
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Payment Option:{' '}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {cart.paymentChoice === 'PAY_NOW'
                      ? 'Pay Now'
                      : 'Pay at Settlement'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </details>

        {/* Service Provider Communications - Separate Section */}
        <ServiceCommunicationsWrapper 
          cartStatus={cart.status}
          cartId={cart.id}
        />

        {/* Vendor Communication Mode Selector */}
        {cart.status === 'DRAFT' && (
          <div className="mb-6">
            <VendorCommunicationSelector
              cartId={cart.id}
              selectedVendorCount={selectedVendorCount}
              currentMode={(cart as any).vendorCommunicationMode}
              isAlreadySent={cart.status !== 'DRAFT'}
            />
          </div>
        )}

        {/* Status Display for Sent Carts */}
        {cart.status === 'SENT' && (
          <div className="mb-6">
            <VendorCommunicationSelector
              cartId={cart.id}
              selectedVendorCount={selectedVendorCount}
              currentMode={(cart as any).vendorCommunicationMode}
              isAlreadySent={true}
            />
          </div>
        )}

        {/* Vendor Invoice - Generate and send invoice to vendor */}
        <AgentCartClient 
          vendorLink={vendorLink} 
          cartId={cart.id}
          approvedServices={approvedServices.map(item => ({
            name: item.name,
            priceCents: item.priceCents,
            providerQuoteCents: (item as any).providerQuoteCents,
          }))}
          vendorName={cart.vendorName}
          vendorEmail={cart.vendorEmail}
          cartStatus={cart.status}
        />

        {/* Vendor & Agent Details - The people involved */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Vendor Details
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <div>
                <span className="font-medium">Name:</span> {cart.vendorName}
              </div>
              {cart.vendorEmail && (
                <div>
                  <span className="font-medium">Email:</span> {cart.vendorEmail}
                </div>
              )}
              {cart.vendorPhone && (
                <div>
                  <span className="font-medium">Phone:</span> {cart.vendorPhone}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Agent Details
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              {cart.agentName ? (
                <>
                  <div>
                    <span className="font-medium">Name:</span> {cart.agentName}
                  </div>
                  {cart.agentEmail && (
                    <div>
                      <span className="font-medium">Email:</span> {cart.agentEmail}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-500 dark:text-gray-400">
                  No agent details provided
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Generated Emails */}
        {cart.outboundEmails.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Generated Emails
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              These email payloads have been generated (not sent in MVP). In
              production, these would be sent to the respective recipients.
            </p>
            <div className="space-y-4">
              {cart.outboundEmails.map((email) => (
                <details
                  key={email.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <summary className="cursor-pointer px-4 py-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-gray-900 dark:text-white">
                    {email.type === 'AGENT_SUMMARY'
                      ? '📧 Agent Summary'
                      : `📋 ${email.supplierType} Work Order`}
                  </summary>
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        To
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {email.toEmail || 'N/A (MVP)'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Subject
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {email.subject}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Body
                      </div>
                      <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
                        {email.bodyText}
                      </pre>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    DRAFT: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    SENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    VENDOR_APPROVED: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    INVOICE_SENT: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    PAID: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  }

  const labels = {
    DRAFT: 'Draft',
    SENT: 'Sent to Providers',
    VENDOR_APPROVED: 'Vendor Approved',
    INVOICE_SENT: 'Invoice Sent',
    PAID: 'Paid',
    APPROVED: 'Approved',
  }

  return (
    <span
      className={`px-4 py-2 rounded-full text-sm font-medium ${colors[status as keyof typeof colors]}`}
    >
      {labels[status as keyof typeof labels] || status}
    </span>
  )
}

function TimelineItem({
  label,
  date,
  completed,
}: {
  label: string
  date?: Date | null
  completed: boolean
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          completed
            ? 'bg-green-500 text-white'
            : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
        }`}
      >
        {completed ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <div className="w-3 h-3 rounded-full bg-current" />
        )}
      </div>
      <div className="mt-2 text-xs text-center">
        <div className="font-medium text-gray-900 dark:text-white">{label}</div>
        {date && (
          <div className="text-gray-500 dark:text-gray-400">
            {new Date(date).toLocaleDateString('en-AU')}
          </div>
        )}
      </div>
    </div>
  )
}

function TimelineConnector({ completed = false }: { completed?: boolean }) {
  return (
    <div 
      className={`flex-1 h-0.5 mb-8 transition-colors ${
        completed 
          ? 'bg-green-500 dark:bg-green-400' 
          : 'bg-gray-300 dark:bg-gray-600'
      }`} 
    />
  )
}

