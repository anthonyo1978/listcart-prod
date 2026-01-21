import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const friendlyId = searchParams.get('friendlyId')

    if (!friendlyId) {
      return NextResponse.json({ error: 'friendlyId is required' }, { status: 400 })
    }

    // TODO: In production, filter by agentEmail to ensure user can only see their own carts
    // For now, we'll just search by friendlyId
    const cart = await prisma.cart.findUnique({
      where: { friendlyId },
      select: {
        id: true,
        friendlyId: true,
        status: true,
        agentName: true,
        agentEmail: true,
      },
    })

    if (!cart) {
      return NextResponse.json({ cart: null }, { status: 404 })
    }

    // TODO: In production, verify that cart.agentEmail matches the authenticated user's email
    // For MVP, we're simulating auth with lee.sales@estates.com.au

    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Cart search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

