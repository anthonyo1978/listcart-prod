import { redirect } from 'next/navigation'
import { createCart } from '@/lib/actions'
import Link from 'next/link'
import { UserMenu } from '@/components/UserMenu'

export default function CreateCartPage() {
  async function handleCreateCart(formData: FormData) {
    'use server'
    const result = await createCart(formData)
    if (result.success) {
      redirect(`/c/${result.cartId}/pending`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      {/* User Menu - Top Right */}
      <div className="absolute top-6 right-6">
        <UserMenu />
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-gray-900 dark:text-white">Lee</span>
            <span>@</span>
            <span>Estates</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create a ListCart
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter the property and vendor details to get started
            </p>
          </div>

          <form action={handleCreateCart} className="space-y-6">
            {/* Property Address */}
            <div>
              <label
                htmlFor="propertyAddress"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Property Address *
              </label>
              <input
                type="text"
                id="propertyAddress"
                name="propertyAddress"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="123 Main Street, Sydney NSW 2000"
              />
            </div>

            {/* Vendor Details */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Vendor Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="vendorName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Vendor Name *
                  </label>
                  <input
                    type="text"
                    id="vendorName"
                    name="vendorName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label
                    htmlFor="vendorEmail"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Vendor Email
                  </label>
                  <input
                    type="email"
                    id="vendorEmail"
                    name="vendorEmail"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="vendor@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="vendorPhone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Vendor Phone
                  </label>
                  <input
                    type="tel"
                    id="vendorPhone"
                    name="vendorPhone"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0400 000 000"
                  />
                </div>
              </div>
            </div>

            {/* Agent Details - Pre-populated (Authenticated Session) */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Agent Details
                </h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Authenticated
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="agentName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Agent Name
                  </label>
                  <input
                    type="text"
                    id="agentName"
                    name="agentName"
                    required
                    readOnly
                    defaultValue="Lee"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white text-gray-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label
                    htmlFor="agentEmail"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Agent Email
                  </label>
                  <input
                    type="email"
                    id="agentEmail"
                    name="agentEmail"
                    required
                    readOnly
                    defaultValue="lee.sales@estates.com.au"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white text-gray-700 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Create ListCart
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

