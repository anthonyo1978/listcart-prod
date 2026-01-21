import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // TODO: In production, filter by authenticated user's email
    // For MVP, we'll get all carts (simulating lee.sales@estates.com.au)
    
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
            status: true,
          },
        },
      },
    })

    return NextResponse.json({ carts })
  } catch (error) {
    console.error('Failed to fetch carts:', error)
    return NextResponse.json({ error: 'Failed to fetch carts' }, { status: 500 })
  }
}

