import { PrismaClient } from '@prisma/client'
import { SERVICES, RECOMMENDED_PACK_KEYS } from '../lib/services'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding services...')

  for (let i = 0; i < SERVICES.length; i++) {
    const service = SERVICES[i]
    await prisma.service.upsert({
      where: { serviceKey: service.key },
      update: {},
      create: {
        serviceKey: service.key,
        name: service.name,
        description: service.description,
        supplierType: service.supplierType,
        priceCents: service.priceCents,
        displayOrder: i,
        defaultSelected: RECOMMENDED_PACK_KEYS.includes(service.key),
      },
    })
  }

  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

