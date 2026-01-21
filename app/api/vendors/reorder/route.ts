import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/vendors/reorder - Reorder vendors for a service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceKey, vendorOrder } = body

    if (!serviceKey || !vendorOrder || !Array.isArray(vendorOrder)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    // Update display order for each vendor
    await Promise.all(
      vendorOrder.map(({ serviceVendorId, displayOrder }) =>
        prisma.serviceVendor.update({
          where: { id: serviceVendorId },
          data: { displayOrder },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering vendors:', error)
    return NextResponse.json(
      { error: 'Failed to reorder vendors' },
      { status: 500 }
    )
  }
}

