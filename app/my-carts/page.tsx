import { prisma } from '@/lib/prisma'
import { MyCartsClient } from './MyCartsClient'
import { UserMenu } from '@/components/UserMenu'

export default async function MyCartsPage() {
  // Fetch all carts for the authenticated user
  // TODO: In production, filter by authenticated user's email
  const carts = await prisma.cart.findMany({
    // where: { agentEmail: 'lee.sales@estates.com.au' }, // Enable in production
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      friendlyId: true,
      status: true,
      propertyAddress: true,
      vendorName: true,
      agentName: true,
      createdAt: true,
      updatedAt: true,
      approvedAt: true,
      totalCents: true,
      items: {
        select: {
          id: true,
          selected: true,
          itemStatus: true,
        },
      },
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a
              href="/"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
              <svg
                className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="text-sm font-medium">Home</span>
            </a>
            <span className="text-gray-400 dark:text-gray-500">|</span>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              My ListCarts
            </h1>
          </div>
          <UserMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MyCartsClient carts={carts} />
      </main>
    </div>
  )
}

