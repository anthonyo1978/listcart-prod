'use server'

import { prisma } from './prisma'
import { SERVICES, RECOMMENDED_PACK_KEYS } from './services'
import { revalidatePath } from 'next/cache'
import { randomBytes } from 'crypto'
import { z } from 'zod'
import { PaymentChoice, SupplierType, OutboundEmailType, VendorCommunicationMode, PaymentPreference, CartItemStatus } from '@prisma/client'

// Validation schemas
const createCartSchema = z.object({
  propertyAddress: z.string().min(1, 'Property address is required'),
  vendorName: z.string().min(1, 'Vendor name is required'),
  vendorEmail: z.string().refine(val => !val || z.string().email().safeParse(val).success, {
    message: 'Invalid email address'
  }).optional(),
  vendorPhone: z.string().optional(),
  agentName: z.string().min(1, 'Agent name is required'),
  agentEmail: z.string().email('Valid agent email is required'),
})

const approveCartSchema = z.object({
  token: z.string(),
  paymentChoice: z.enum(['PAY_NOW', 'PAY_LATER']),
  selectedServiceKeys: z.array(z.string()).min(1, 'Select at least one service'),
})

// Generate unique token
function generateToken(): string {
  return randomBytes(16).toString('hex')
}

// Generate friendly cart ID (LC-001, LC-002, etc.)
async function generateFriendlyId(): Promise<string> {
  const count = await prisma.cart.count()
  const nextNumber = count + 1
  return `LC-${String(nextNumber).padStart(3, '0')}`
}

// Create cart action
export async function createCart(formData: FormData) {
  try {
    const data = {
      propertyAddress: formData.get('propertyAddress') as string,
      vendorName: formData.get('vendorName') as string,
      vendorEmail: formData.get('vendorEmail') as string,
      vendorPhone: formData.get('vendorPhone') as string,
      agentName: formData.get('agentName') as string,
      agentEmail: formData.get('agentEmail') as string,
    }

    const validated = createCartSchema.parse(data)

    const token = generateToken()
    const friendlyId = await generateFriendlyId()

    // Get active services from database
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    })

    // Create cart with items
    const cart = await prisma.cart.create({
      data: {
        ...validated,
        vendorEmail: validated.vendorEmail || null,
        vendorPhone: validated.vendorPhone || null,
        token,
        friendlyId,
        items: {
          create: services.map((service) => ({
            serviceKey: service.serviceKey,
            name: service.name,
            description: service.description,
            supplierType: service.supplierType,
            priceCents: 0, // Start at $0 - price set when vendor selected
            selected: service.defaultSelected,
          })),
        },
      },
    })

    return { success: true, cartId: cart.id, friendlyId: cart.friendlyId }
  } catch (error) {
    console.error('Error creating cart:', error)
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.issues[0]?.message || 'Validation failed' 
      }
    }
    return { success: false, error: 'Failed to create cart' }
  }
}

// Get cart by token (for vendor view)
export async function getCartByToken(token: string) {
  const cart = await prisma.cart.findUnique({
    where: { token },
    include: {
      items: true,
    },
  })

  return cart
}

// Get cart by ID (for agent view)
export async function getCartById(id: string) {
  const cart = await prisma.cart.findUnique({
    where: { id },
    include: {
      items: true,
      outboundEmails: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  return cart
}

// Generate email templates
function generateAgentSummaryEmail(cart: any, selectedItems: any[]) {
  const subject = `ListCart Approved: ${cart.propertyAddress}`
  
  const total = selectedItems.reduce((sum, item) => sum + item.priceCents, 0)
  const itemsList = selectedItems
    .map((item) => `  - ${item.name}: $${(item.priceCents / 100).toFixed(2)}`)
    .join('\n')

  const body = `
ListCart Order Confirmation

Property: ${cart.propertyAddress}

Vendor Details:
  Name: ${cart.vendorName}
  Email: ${cart.vendorEmail || 'N/A'}
  Phone: ${cart.vendorPhone || 'N/A'}

Selected Services:
${itemsList}

Total: $${(total / 100).toFixed(2)}

Payment Choice: ${cart.paymentChoice === 'PAY_NOW' ? 'Pay Now' : 'Pay at Settlement'}

Approved at: ${new Date(cart.approvedAt).toLocaleString('en-AU')}

---
This is an automated confirmation from ListCart.
`.trim()

  return { subject, body }
}

function generateSupplierWorkOrder(
  cart: any,
  supplierType: SupplierType,
  services: any[]
) {
  const serviceNames = services.map((s) => s.name).join(', ')
  const subject = `New Work Order: ${serviceNames} — ${cart.propertyAddress}`

  const servicesList = services
    .map((s) => `  - ${s.name}: ${s.description}`)
    .join('\n')

  const body = `
New Work Order from ListCart

Property Address: ${cart.propertyAddress}

Services Requested:
${servicesList}

Vendor Contact:
  Name: ${cart.vendorName}
  Email: ${cart.vendorEmail || 'N/A'}
  Phone: ${cart.vendorPhone || 'N/A'}

Agent Contact:
  Name: ${cart.agentName || 'N/A'}
  Email: ${cart.agentEmail || 'N/A'}

Notes: Access details: TBD

Please confirm receipt and schedule this work order.

---
This is an automated work order from ListCart.
`.trim()

  return { subject, body }
}

// Approve cart action
export async function approveCart(
  token: string,
  paymentChoice: PaymentChoice,
  selectedServiceKeys: string[]
) {
  try {
    const validated = approveCartSchema.parse({
      token,
      paymentChoice,
      selectedServiceKeys,
    })

    const cart = await prisma.cart.findUnique({
      where: { token },
      include: { items: true },
    })

    if (!cart) {
      return { success: false, error: 'Cart not found' }
    }

    if (cart.status === 'APPROVED') {
      return { success: false, error: 'Cart already approved' }
    }

    // Update cart items selection
    await Promise.all(
      cart.items.map((item) =>
        prisma.cartItem.update({
          where: { id: item.id },
          data: {
            selected: validated.selectedServiceKeys.includes(item.serviceKey),
          },
        })
      )
    )

    // Get selected items
    const selectedItems = cart.items.filter((item) =>
      validated.selectedServiceKeys.includes(item.serviceKey)
    )

    const totalCents = selectedItems.reduce(
      (sum, item) => sum + item.priceCents,
      0
    )

    // Update cart status
    const updatedCart = await prisma.cart.update({
      where: { id: cart.id },
      data: {
        status: 'APPROVED',
        paymentChoice: validated.paymentChoice,
        totalCents,
        approvedAt: new Date(),
      },
      include: { items: true },
    })

    // Generate agent summary email
    const agentEmail = generateAgentSummaryEmail(updatedCart, selectedItems)
    await prisma.outboundEmail.create({
      data: {
        cartId: cart.id,
        type: OutboundEmailType.AGENT_SUMMARY,
        toEmail: cart.agentEmail || null,
        subject: agentEmail.subject,
        bodyText: agentEmail.body,
      },
    })

    // Generate supplier work orders
    const supplierGroups = selectedItems.reduce((acc, item) => {
      if (!acc[item.supplierType]) {
        acc[item.supplierType] = []
      }
      acc[item.supplierType].push(item)
      return acc
    }, {} as Record<SupplierType, any[]>)

    for (const [supplierType, services] of Object.entries(supplierGroups)) {
      const workOrder = generateSupplierWorkOrder(
        updatedCart,
        supplierType as SupplierType,
        services
      )
      await prisma.outboundEmail.create({
        data: {
          cartId: cart.id,
          type: OutboundEmailType.SUPPLIER_WORK_ORDER,
          supplierType: supplierType as SupplierType,
          toEmail: null, // MVP: no real supplier emails
          subject: workOrder.subject,
          bodyText: workOrder.body,
        },
      })
    }

    revalidatePath(`/c/${cart.id}/agent`)
    revalidatePath(`/v/${token}`)

    return { success: true, cartId: cart.id }
  } catch (error) {
    console.error('Error approving cart:', error)
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.issues[0]?.message || 'Validation failed' 
      }
    }
    return { success: false, error: 'Failed to approve cart' }
  }
}

// Update cart status to SENT (when agent copies link)
export async function markCartAsSent(cartId: string) {
  try {
    await prisma.cart.update({
      where: { id: cartId },
      data: { status: 'SENT' },
    })
    revalidatePath(`/c/${cartId}/agent`)
    return { success: true }
  } catch (error) {
    console.error('Error marking cart as sent:', error)
    return { success: false, error: 'Failed to update cart' }
  }
}

// Update cart item (selection and notes)
export async function updateCartItem(
  itemId: string,
  cartId: string,
  data: { selected?: boolean; agentNotes?: string }
) {
  try {
    await prisma.cartItem.update({
      where: { id: itemId },
      data,
    })
    revalidatePath(`/c/${cartId}/agent`)
    return { success: true }
  } catch (error) {
    console.error('Error updating cart item:', error)
    return { success: false, error: 'Failed to update item' }
  }
}

// Update cart item with vendor selection and price
export async function updateCartItemVendor(
  itemId: string,
  cartId: string,
  vendorId: string | null,
  priceCents: number
) {
  try {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: {
        vendorId: vendorId,
        priceCents: priceCents,
      },
    })
    revalidatePath(`/c/${cartId}/agent`)
    return { success: true }
  } catch (error) {
    console.error('Error updating cart item vendor:', error)
    return { success: false, error: 'Failed to update vendor' }
  }
}

// Send cart to vendors
export async function sendCartToVendors(
  cartId: string,
  communicationMode: 'FIRST_COME_FIRST_SERVE' | 'REVIEW_AND_APPROVE'
) {
  try {
    // Get cart with items
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          where: { selected: true },
          include: {
            vendor: true,
          },
        },
      },
    })

    if (!cart) {
      return { success: false, error: 'Cart not found' }
    }

    // Collect unique vendors from selected items
    const vendorEmails = new Set<string>()
    cart.items.forEach((item) => {
      if (item.vendor?.email) {
        vendorEmails.add(item.vendor.email)
      }
    })

    // Update cart status and communication mode
    await prisma.cart.update({
      where: { id: cartId },
      data: {
        status: 'SENT',
        vendorCommunicationMode: communicationMode as VendorCommunicationMode,
      },
    })

    // Mock sending emails to vendors
    const emailPromises = Array.from(vendorEmails).map((email) =>
      prisma.outboundEmail.create({
        data: {
          cartId,
          type: 'SUPPLIER_WORK_ORDER',
          toEmail: email,
          subject: `New Service Request - ${cart.propertyAddress} (${cart.friendlyId})`,
          bodyText: `
Hello,

You have a new service request from ${cart.agentName} at ${cart.agentEmail}.

Property: ${cart.propertyAddress}
Cart ID: ${cart.friendlyId}
Communication Mode: ${communicationMode === 'FIRST_COME_FIRST_SERVE' ? 'First Come First Serve' : 'Review & Approve'}

Selected Services:
${cart.items.map((item) => `- ${item.name}: ${(item.priceCents / 100).toFixed(2)} AUD`).join('\n')}

${communicationMode === 'FIRST_COME_FIRST_SERVE' 
  ? 'You can accept this job immediately by clicking the link below.'
  : 'Please review the requirements and submit your quote for approval.'
}

View and respond: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/v/${cart.token}

Thanks,
ListCart Team
          `.trim(),
        },
      })
    )

    await Promise.all(emailPromises)

    // Don't revalidate here - let the modal close handle the reload
    // revalidatePath(`/c/${cartId}/agent`)
    return {
      success: true,
      vendorCount: vendorEmails.size,
      communicationMode,
    }
  } catch (error) {
    console.error('Error sending cart to vendors:', error)
    return { success: false, error: 'Failed to send to vendors' }
  }
}

// Save payment preference
export async function savePaymentPreference(
  cartId: string,
  preference: 'CARD' | 'PAY_LATER' | 'NOT_SURE'
) {
  try {
    await prisma.cart.update({
      where: { id: cartId },
      data: {
        paymentPreference: preference as PaymentPreference,
      },
    })

    revalidatePath(`/c/${cartId}/agent`)
    return { success: true }
  } catch (error) {
    console.error('Error saving payment preference:', error)
    return { success: false, error: 'Failed to save preference' }
  }
}

// Progress cart item status (mock provider correspondence)
export async function progressCartItemStatus(itemId: string, cartId: string) {
  try {
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
    })

    if (!item) {
      return { success: false, error: 'Item not found' }
    }

    // Progress through states: PENDING → PROVIDER_ACCEPTED → AGENT_APPROVED
    let newStatus: CartItemStatus
    let providerResponse: string | null = null
    let providerQuoteCents: number | null = null
    let providerAvailableDate: string | null = null

    if (item.itemStatus === 'PENDING') {
      newStatus = 'PROVIDER_ACCEPTED'
      // Mock provider response
      providerResponse = `Can do on ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU')} for $${(item.priceCents / 100 * 0.9).toFixed(0)} + GST`
      providerQuoteCents = Math.round(item.priceCents * 0.9)
      providerAvailableDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU')
    } else if (item.itemStatus === 'PROVIDER_ACCEPTED') {
      newStatus = 'AGENT_APPROVED'
      // Keep existing response data
      providerResponse = item.providerResponse
      providerQuoteCents = item.providerQuoteCents
      providerAvailableDate = item.providerAvailableDate
    } else {
      // Already approved, reset to pending for demo purposes
      newStatus = 'PENDING'
      providerResponse = null
      providerQuoteCents = null
      providerAvailableDate = null
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: {
        itemStatus: newStatus,
        providerResponse,
        providerQuoteCents,
        providerAvailableDate,
      },
    })

    // Check if all selected items are now approved
    const allItems = await prisma.cartItem.findMany({
      where: { cartId, selected: true },
    })
    
    const allApproved = allItems.every((item) => item.itemStatus === 'AGENT_APPROVED')
    
    // Update cart status if all services are approved
    if (allApproved && allItems.length > 0) {
      await prisma.cart.update({
        where: { id: cartId },
        data: { status: 'VENDOR_APPROVED' },
      })
    }

    revalidatePath(`/c/${cartId}/agent`)
    return { success: true, newStatus, cartStatusUpdated: allApproved }
  } catch (error) {
    console.error('Error progressing item status:', error)
    return { success: false, error: 'Failed to update status' }
  }
}

// Mark invoice as sent
export async function markInvoiceAsSent(cartId: string) {
  try {
    await prisma.cart.update({
      where: { id: cartId },
      data: { status: 'INVOICE_SENT' },
    })

    revalidatePath(`/c/${cartId}/agent`)
    return { success: true }
  } catch (error) {
    console.error('Error marking invoice as sent:', error)
    return { success: false, error: 'Failed to update status' }
  }
}

// Mark cart as paid
export async function markCartAsPaid(cartId: string) {
  try {
    await prisma.cart.update({
      where: { id: cartId },
      data: { status: 'PAID' },
    })

    revalidatePath(`/c/${cartId}/agent`)
    return { success: true }
  } catch (error) {
    console.error('Error marking cart as paid:', error)
    return { success: false, error: 'Failed to update status' }
  }
}

