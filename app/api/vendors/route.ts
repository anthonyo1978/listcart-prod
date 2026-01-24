import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/vendors?serviceKey=xxx - List vendors for a service
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const serviceKey = searchParams.get('serviceKey')

    if (!serviceKey) {
      return NextResponse.json(
        { error: 'serviceKey is required' },
        { status: 400 }
      )
    }

    // Get all vendors with their service-specific pricing
    const serviceVendors = await prisma.serviceVendor.findMany({
      where: { serviceKey },
      include: {
        vendor: true,
      },
      orderBy: [
        { displayOrder: 'asc' },
      ],
    })

    const vendors = serviceVendors.map((sv: any) => ({
      id: sv.vendor.id,
      serviceVendorId: sv.id,
      businessName: sv.vendor.businessName,
      contactName: sv.vendor.contactName,
      email: sv.vendor.email,
      phone: sv.vendor.phone,
      priceCents: sv.priceCents,
      isPreferred: sv.isPreferred,
      displayOrder: sv.displayOrder,
    }))

    return NextResponse.json(vendors)
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    )
  }
}

// POST /api/vendors - Add a new vendor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      serviceKey,
      businessName,
      contactName,
      email,
      phone,
      priceCents,
      isPreferred,
    } = body

    if (!serviceKey || !businessName || priceCents === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the next display order for this service
    const maxOrder = await prisma.serviceVendor.findFirst({
      where: { serviceKey },
      orderBy: { displayOrder: 'desc' },
      select: { displayOrder: true },
    })

    // Create vendor and link to service
    const vendor = await prisma.vendor.create({
      data: {
        businessName,
        contactName: contactName || undefined,
        email: email || undefined,
        phone: phone || undefined,
        serviceVendors: {
          create: {
            serviceKey,
            priceCents,
            isPreferred: isPreferred || false,
            displayOrder: (maxOrder?.displayOrder ?? -1) + 1,
          },
        },
      },
    })

    return NextResponse.json(vendor, { status: 201 })
  } catch (error) {
    console.error('Error creating vendor:', error)
    return NextResponse.json(
      { error: 'Failed to create vendor' },
      { status: 500 }
    )
  }
}

