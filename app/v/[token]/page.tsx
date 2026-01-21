import { getCartByToken } from '@/lib/actions'
import { notFound } from 'next/navigation'
import VendorCartClient from './VendorCartClient'

export default async function VendorCartPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const cart = await getCartByToken(token)

  if (!cart) {
    notFound()
  }

  if (cart.status === 'APPROVED') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="text-center">
              <div className="mb-6">
                <svg
                  className="mx-auto h-16 w-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Cart Approved!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Thank you for confirming your service selections.
              </p>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 text-left">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Next Steps:
                </h2>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>
                      Suppliers will be contacted and scheduled for your property
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>
                      Your agent will receive a confirmation summary
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>
                      You will be contacted for access arrangements
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <VendorCartClient cart={cart} />
}

