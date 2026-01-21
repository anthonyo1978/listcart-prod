import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/services/reorder - Reorder services
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { services } = body

    // Update display order for each service
    const updatePromises = services.map((service: { id: string; displayOrder: number }) =>
      prisma.service.update({
        where: { id: service.id },
        data: { displayOrder: service.displayOrder },
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering services:', error)
    return NextResponse.json(
      { error: 'Failed to reorder services' },
      { status: 500 }
    )
  }
}

