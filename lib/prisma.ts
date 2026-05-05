import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const DATABASE_URL = process.env.DATABASE_URL!

function createClient(): PrismaClient {
  if (DATABASE_URL.startsWith('prisma+postgres://')) {
    return new PrismaClient({ accelerateUrl: DATABASE_URL })
  }
  const adapter = new PrismaPg(DATABASE_URL)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
