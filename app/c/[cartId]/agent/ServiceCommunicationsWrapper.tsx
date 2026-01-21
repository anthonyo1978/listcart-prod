'use client'

import { ServiceCommunicationHub } from '@/components/ServiceCommunicationHub'

type ServiceCommunicationsWrapperProps = {
  cartStatus: string
  cartId: string
}

export function ServiceCommunicationsWrapper({ 
  cartStatus, 
  cartId 
}: ServiceCommunicationsWrapperProps) {
  return (
    <div id="service-communications" className="mb-6">
      <ServiceCommunicationHub 
        cartStatus={cartStatus} 
        cartId={cartId}
      />
    </div>
  )
}

