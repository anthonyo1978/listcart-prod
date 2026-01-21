import { SupplierType } from '@prisma/client'

export interface ServiceDefinition {
  key: string
  name: string
  description: string
  priceCents: number
  supplierType: SupplierType
}

export const SERVICES: ServiceDefinition[] = [
  {
    key: 'PHOTO_FLOORPLAN',
    name: 'Photography + Floorplan',
    description: 'Standard photography + 2D floorplan.',
    priceCents: 45000,
    supplierType: 'PHOTOGRAPHER',
  },
  {
    key: 'COPYWRITING',
    name: 'Copywriting',
    description: 'Professional listing copy based on agent/vendor brief.',
    priceCents: 18000,
    supplierType: 'COPYWRITER',
  },
  {
    key: 'SIGNBOARD',
    name: 'Signboard',
    description: 'Standard signboard install + removal.',
    priceCents: 25000,
    supplierType: 'SIGNBOARD',
  },
  {
    key: 'DIGITAL_UPGRADE',
    name: 'Digital Upgrade (Social Boost)',
    description: 'Social media boost package (FB/IG).',
    priceCents: 15000,
    supplierType: 'DIGITAL',
  },
  {
    key: 'STYLING_CONSULTATION',
    name: 'Styling Consultation',
    description: '30–45 min consult and quick recommendations.',
    priceCents: 9900,
    supplierType: 'STYLIST',
  },
]

// Recommended Pack includes all except styling consultation
export const RECOMMENDED_PACK_KEYS = [
  'PHOTO_FLOORPLAN',
  'COPYWRITING',
  'SIGNBOARD',
  'DIGITAL_UPGRADE',
]

export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function formatCurrencyAUD(cents: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(cents / 100)
}

