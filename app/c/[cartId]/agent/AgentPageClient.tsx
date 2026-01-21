'use client'

import { ServiceBuilder } from '@/components/ServiceBuilderWithVendors'

type AgentPageClientProps = {
  items: any[]
  cartId: string
  cartStatus: string
  isApproved: boolean
}

export function AgentPageClient({ 
  items, 
  cartId, 
  cartStatus, 
  isApproved 
}: AgentPageClientProps) {
  return (
    <ServiceBuilder 
      items={items} 
      cartId={cartId} 
      isApproved={isApproved}
      cartStatus={cartStatus}
    />
  )
}

