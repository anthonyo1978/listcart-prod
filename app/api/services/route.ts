import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/services?key=xxx - List all services or get one by key
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const key = searchParams.get('key')

    if (key) {
      const service = await prisma.service.findUnique({
        where: { serviceKey: key, isActive: true },
      })
      return NextResponse.json(service ? [service] : [])
    }

    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST /api/services - Create a new service category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, supplierType, priceCents } = body

    if (!name || !description || !supplierType || priceCents === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate a unique service key from the name
    const serviceKey = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '')

    // Get the next display order
    const maxOrder = await prisma.service.findFirst({
      orderBy: { displayOrder: 'desc' },
      select: { displayOrder: true },
    })

    const service = await prisma.service.create({
      data: {
        serviceKey,
        name,
        description,
        supplierType,
        priceCents,
        displayOrder: (maxOrder?.displayOrder ?? 0) + 1,
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}

