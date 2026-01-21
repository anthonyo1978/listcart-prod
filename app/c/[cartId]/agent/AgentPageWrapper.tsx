'use client'

import { useState, createContext, useContext } from 'react'

type ServiceSelectionContextType = {
  selectedServiceKey: string | undefined
  setSelectedServiceKey: (key: string) => void
}

const ServiceSelectionContext = createContext<ServiceSelectionContextType>({
  selectedServiceKey: undefined,
  setSelectedServiceKey: () => {},
})

export const useServiceSelection = () => useContext(ServiceSelectionContext)

export function ServiceSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedServiceKey, setSelectedServiceKey] = useState<string | undefined>(undefined)

  return (
    <ServiceSelectionContext.Provider value={{ selectedServiceKey, setSelectedServiceKey }}>
      {children}
    </ServiceSelectionContext.Provider>
  )
}

